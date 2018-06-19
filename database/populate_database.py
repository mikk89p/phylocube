# -*- coding: cp1257 -*-
#Last update: 17.05.18

#import sys, getopt, subprocess, os
from sets import Set
import json
import MySQLdb

def is_number(s):
	try:
		float(s)
		return True
	except ValueError:
		return False
	
def readFileToDictionary(filePath, split, key_column,value_column):
	try:
		file = open(filePath, "r")
	except:
		print ("ERROR - Reading " + str(filePath))

	dict = {}
	while True :
		line = file.readline()

		if line == "" :
			break

		line = line.strip()
		lineList = line.split(split)

		if (len(lineList)>key_column and len(lineList)>value_column):
			key = (lineList[key_column]).strip()
			
			value = (lineList[value_column]).strip()
			dict[key] = value

		
	file.close()
	return dict	
		
def connectDb():

	credentials = {}
	with open('database.env', 'r') as f:
		 content = f.readlines()

	for line in content:
		line = line.strip() 
		arr = line.split("=")
		credentials[arr[0]]=arr[1]

	db = MySQLdb.connect(
		host=credentials['DB_HOST'],
		port=int(credentials['DB_PORT']),
		user=credentials['DB_USER'],
		passwd=credentials['DB_PASS'],
		db=credentials['DB_NAME'])
	
	return db
	


def insertResource(db,cursor,resource):
	id = resources[resource]['id']
	type = resources[resource]['type']
	name = resources[resource]['name']
	description = resources[resource]['description']
	version = resources[resource]['version']
	classification_version = resources[resource]['classification_version']
	cellular_genomes = resources[resource]['cellular_genomes']
	viral_genomes = resources[resource]['viral_genomes']
	
	try:
		cursor.execute("INSERT INTO resource (id, type, name, description, version, classification_version, cellular_genomes, viral_genomes) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
		(id,type,name,description,version,classification_version,cellular_genomes,viral_genomes))
		db.commit()
	except:     
		print("ERROR in insertResource or resource exist")
		db.rollback()
		
		
def insertProteinDomain(db,cursor,resource):

	#Load descriptions dictionary
	description_file = resources[resource]['description_file']
	description_dict = readFileToDictionary(description_file, "\t", 0,1)

	id = resources[resource]['id']
	domains_file = resources[resource]['domains_file']
	with open(domains_file, 'r') as f:
		 content = f.readlines()

	uniqueAcc = Set([])
	values = []
	length = len(content)
	for line in content:
		line = line.strip() 
		arr = line.split("\t")
		acc = arr[0]

		#First row has headings
		if (acc == "domain_acc"):
			continue
		if (acc == "0" or acc == "-"):
			acc = "None"
			
		#Insert only unique domains
		if acc in uniqueAcc:
			continue
		else:
			uniqueAcc.add(acc)
		
		description = description_dict.get(acc)
		if(description  is None):
			description = "None"

		resource_id = id
		value = [acc,description,resource_id]
		values.append(value)
			
	try:
		cursor.executemany("INSERT INTO protein_domain (acc, description, resource_id) VALUES (%s,%s,%s)",values)
		db.commit()
	except:     
		print("ERROR in insert Protein Domain")
		db.rollback()


def insertSummary(db,cursor,resource):
	cursor.execute("SELECT acc, id FROM protein_domain")
	rows = cursor.fetchall()
	acc_dict = {}
	for row in rows:
		acc_dict[row[0]] = row[1]


	domains_file = resources[resource]['domains_file']
	with open(domains_file, 'r') as f:
		content = f.readlines()
	
	values = []
	for line in content:
		line = line.strip() 
		arr = line.split("\t")
		acc = arr[0]

		#First row has headings
		if (not is_number(arr[1])):
			continue

		archaea = int(arr[1]) if is_number(arr[1])  else 0
		bacteria = int(arr[2]) if is_number(arr[2])  else 0
		eukaryota = int(arr[3]) if is_number(arr[3])  else 0
		virus = int(arr[4]) if is_number(arr[4])  else 0

		protein_domain_id = acc_dict.get(acc)

		if(protein_domain_id is not None):
			value = [protein_domain_id,archaea,bacteria,eukaryota,virus]
			values.append(value)
		else:
			print(acc)

	try:
		cursor.executemany("INSERT INTO summary (protein_domain_id,archaea, bacteria, eukaryota, virus) VALUES (%s,%s,%s,%s,%s)",values)
		db.commit()
	except:     
		print("ERROR in insert into summary")
		db.rollback()

def insertAssignments(db,cursor,resource):	

	# each assignment is connected to a protein domain from protein_domain table
	cursor.execute("SELECT acc, id FROM protein_domain")
	rows = cursor.fetchall()
	acc_dict = {}
	values = []

	for row in rows:
		acc_dict[row[0]] = row[1]

	assignments_file = resources[resource]['assignments_file']
	with open(assignments_file, 'r') as f:
		 content = f.readlines()
	
	contentLen = len(content)
	maxNumberInsert = 5000
	count = 0
	for line in content:
		count += 1
		line = line.strip() 
		arr = line.split("\t")
		taxid = arr[0]
		acc = arr[1]
		significance = 0
		if (len(arr)>2):
			significance = arr[2]
		if (acc == ""):
			continue

		# without domain grep "1111708,[a-zA-Z0-9]*,[a-zA-Z0-9]*,,"  ../gene3d/representative_uniprot_genome_assignments.csv
    #  grep "taxid,[a-zA-Z0-9]*,[a-zA-Z0-9]*,[a-zA-Z0-9.]*,[a-zA-Z0-9-]*,p-value,"  ../gene3d/representative_uniprot_genome_assignments.csv
		protein_domain_id = acc_dict.get(acc)
		if(protein_domain_id is not None):
			value = [taxid,protein_domain_id,significance]
			values.append(value)
		
		if (len(values)>=maxNumberInsert or count == contentLen):
			try:
				cursor.executemany("INSERT INTO assignment (taxid,protein_domain_id,significance) VALUES (%s,%s,%s)",values)
				db.commit()
				values = []
			except:     
				print("ERROR in insert into summary")
				db.rollback()


def addIndex(db,cursor,resource):	
	cursor.execute("CREATE INDEX assignment_index ON assignment (taxid, protein_domain_id)")

if __name__ == '__main__':
	# Connect
	db = connectDb()
	cursor = db.cursor()
	
	with open('resources.json') as f:
		resources = json.load(f)

	#loadResources = ["gene3d","supfam"]
	loadResources = ["supfam"]
	
	for resource in loadResources:
		print("Building " + str(resource) + " resource")
		insertResource(db,cursor,resource)
		print("Inserting" + str(resource) + " protein domains")
		#insertProteinDomain(db,cursor,resource)
		print("Inserting" + str(resource) + " summary")
		#insertSummary(db,cursor,resource)
		print("Inserting" + str(resource) + " assignments (takes several minutes)")
		#insertAssignments(db,cursor,resource)
	
	print("Adding index to assignment table")
	addIndex(db,cursor,resource)

	# Execute SQL select statement
	cursor.execute("SELECT * FROM resource")
	# Get the number of rows in the resultset
	numrows = cursor.rowcount

	# Get and display one row at a time
	for x in range(0, numrows):
		row = cursor.fetchone()
		print row[0], "-->", row[1]

	# Close the connection
	db.close()

	
	 
	

	
