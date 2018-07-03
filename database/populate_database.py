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

	
def insertTaxonomy(db,cursor,resource):
	version = resources[resource]['version']
	taxonomy_file = resources[resource]['taxonomy_file']
	values = []
	with open(taxonomy_file, 'r') as f:
		 content = f.readlines()

	contentLen = len(content)
	maxNumberInsert = 4000
	count = 0
	for line in content:
		count += 1
		line = line.strip() 
		arr = line.split("\t")
		taxid = int(arr[0])
		name = arr[1] 
		rank = arr[2]
		parent_id = arr[3] 
		full_taxonomy = "-"
		full_taxonomy_id = "-"
		if (len(arr) > 4):
			full_taxonomy = arr[4]
		if (len(arr) > 5):
			full_taxonomy_id = arr[5]
	
		value = [taxid,name,rank,parent_id,full_taxonomy,full_taxonomy_id]
		values.append(value)
		if (len(values)>=maxNumberInsert or count == contentLen):
			try:
				cursor.executemany("INSERT INTO taxonomy (id,name,rank,parent_id,full_taxonomy,full_taxonomy_id) VALUES (%s,%s,%s,%s,%s,%s)",values)
				db.commit()
				values = []
			except:     
				print("ERROR in insert Taxonomy or taxonomy exist")
				db.rollback()

def insertResource(db,cursor,resource):
	id = resources[resource]['id']
	type = resources[resource]['type']
	name = resources[resource]['name']
	description = resources[resource]['description']
	version = resources[resource]['version']
	url = resources[resource]['url']
	api_url = resources[resource]['api_url']
	classification_version = resources[resource]['classification_version']
	cellular_genomes_version = resources[resource]['cellular_genomes_version']
	viral_genomes_version = resources[resource]['viral_genomes_version']
	archaea_genomes = resources[resource]['archaea_genomes']
	bacteria_genomes = resources[resource]['bacteria_genomes']
	eukaryota_genomes = resources[resource]['eukaryota_genomes']
	virus_genomes = resources[resource]['virus_genomes']
	
	try:
		cursor.execute("INSERT INTO resource (id, type, name, description, version, url, api_url, classification_version, cellular_genomes_version, viral_genomes_version,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
		(id,type,name,description,version,url,api_url,classification_version,cellular_genomes_version,viral_genomes_version,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes))
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
		cursor.executemany("INSERT INTO distribution (protein_domain_id,archaea, bacteria, eukaryota, virus) VALUES (%s,%s,%s,%s,%s)",values)
		db.commit()
	except:     
		print("ERROR in insert into distribution")
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
		frequency = arr[2]
    # Lowest e-value
		e_val = False
		if (len(arr)>3):
			e_val = arr[3]
		if (acc == ""):
			continue

		# without domain grep "1111708,[a-zA-Z0-9]*,[a-zA-Z0-9]*,,"  ../gene3d/representative_uniprot_genome_assignments.csv
		#  grep "taxid,[a-zA-Z0-9]*,[a-zA-Z0-9]*,[a-zA-Z0-9.]*,[a-zA-Z0-9-]*,p-value,"  ../gene3d/representative_uniprot_genome_assignments.csv
		protein_domain_id = acc_dict.get(acc)
		if(protein_domain_id is not None):
			value = [taxid,protein_domain_id,frequency,e_val]
			values.append(value)
		
		if (len(values)>=maxNumberInsert or count == contentLen):
			try:
				if (e_val):
					sql = "INSERT INTO assignment (taxonomy_id,protein_domain_id,frequency,e_val) VALUES (%s,%s,%s,%s)"
				else:
					sql = "INSERT INTO assignment (taxonomy_id,protein_domain_id,frequency) VALUES (%s,%s,%s)" 
				cursor.executemany(sql,values)
				db.commit()
				values = []
			except:     
				print("ERROR in insert into distribution")
				db.rollback()

def insertClanMembership(db,cursor,resource):
	membership_file = resources[resource]['membership_file']
	with open(membership_file, 'r') as f:
		content = f.readlines()
	
	values = []
	for line in content:
		line = line.strip() 
		arr = line.split("\t")
		clan = arr[0]
		pfam = arr[1]
		value = [clan,pfam]
		values.append(value)
	try:
		cursor.executemany("INSERT INTO clan_membership (clan_acc,pfam_acc) VALUES (%s,%s)",values)
		db.commit()
	except:     
		print("ERROR in insert into clan_membership")
		db.rollback()


def addIndex(db,cursor,resource):	
	cursor.execute("CREATE INDEX assignment_taxid_index ON assignment (taxonomy_id)")
	cursor.execute("CREATE INDEX taxonomy_name ON taxonomy (name)")
	cursor.execute("CREATE INDEX taxonomy_rank ON taxonomy (rank)")
	cursor.execute("CREATE INDEX taxonomy_parent_id ON taxonomy (parent_id)")
	cursor.execute("CREATE INDEX taxonomy_full_taxonomy_id ON taxonomy (full_taxonomy_id)")
	cursor.execute("CREATE INDEX taxonomy_full_taxonomy ON taxonomy (full_taxonomy)")
	#Must be - Makes pfamclan query much faster
	cursor.execute("CREATE INDEX clan_membership_pfam_acc ON clan_membership (pfam_acc)")
	cursor.execute("CREATE INDEX acc_index ON protein_domain (acc)")
	cursor.execute("CREATE INDEX description_index ON protein_domain (description)")
  
	'''
	TO VIEW INDEX
  SHOW INDEX FROM mytable;

	TO DROP INDEX
  ALTER TABLE assignment DROP INDEX assignment_index
  ALTER TABLE assignment DROP INDEX assignment_domainid_index
  

	ALTER TABLE assignment DROP INDEX assignment_taxid_index;
  ALTER TABLE assignment DROP INDEX assignment_domainid_index;
	'''

if __name__ == '__main__':
	# Connect
	db = connectDb()
	cursor = db.cursor()


	with open('resources.json') as f:
		resources = json.load(f)

	initList = ["taxonomy","gene3d","supfam","pfam","clan","clanpfam"]
	initList = ["gene3d","supfam","pfam","clan"]

	
	for resource in initList:
		if (resource == "taxonomy"):
			insertTaxonomy(db,cursor,resource)
		elif (resource == "pfam"):
			pass
			#insertClanMembership(db,cursor,resource)
		elif (resource == "clanpfam"):
			print("Only building " + str(resource) + " resource")
			#insertResource(db,cursor,resource)
		else:
			print("Building " + str(resource) + " resource")
			#insertResource(db,cursor,resource)
			print("Inserting " + str(resource) + " protein domains")
			#insertProteinDomain(db,cursor,resource)
			print("Inserting " + str(resource) + " distribution")
			#insertSummary(db,cursor,resource)
			print("Inserting " + str(resource) + " assignments (takes several minutes)")
			insertAssignments(db,cursor,resource)
		
			
	
	#print("Adding index to assignment and taxonomy table (takes several minutes)")
	#addIndex(db,cursor,resource)

	# Close the connection
	db.close()
	print("Database connection closed")
	print("Done")

	
	 
	

	
