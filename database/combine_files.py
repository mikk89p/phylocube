# -*- coding: cp1257 -*-
#Last update: 18.06.18


import sys, getopt, os
from sets import Set


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
			allDomains.add(key)
			value = (lineList[value_column]).strip()
			dict[key] = value

		
	file.close()
	return dict	

def combine(allDomains,archaea,bacteria,eukaryota,viruses):
	for acc in allDomains:
		a = archaea.get(acc) if archaea.get(acc) is not None  else 0
		b = bacteria.get(acc) if bacteria.get(acc) is not None  else 0
		e = eukaryota.get(acc) if eukaryota.get(acc) is not None  else 0
		v = viruses.get(acc) if viruses.get(acc) is not None  else 0
		print (acc + "\t" + str(a) + "\t" + str(b) + "\t" + str(e) + "\t" + str(v))

def usage():
	print('scriptName.py -a -b -e -v')
	print('-a, --archaea \t a domain_acc and count tsv file')
	print('-b, --bacteria \t a domain_acc and count tsv file')
	print('-e, --eukaryota \t a domain_acc and count tsv file')
	print('-v, --viruses \t a domain_acc and count tsv file')
	


if __name__ == '__main__':
	try:
		opts, args = getopt.getopt(sys.argv[1:], "ha:b:e:v:", ["help","archaea=", "bacteria=","eukaryota=","viruses="])
	except getopt.GetoptError as err:
		print(err)  # will print something like "option -a not recognized"
		usage()
		sys.exit(2)

	for opt, arg in opts:
		if opt in ("-h", "--help"):
			usage()
			sys.exit()
		elif opt in ("-a", "--archaea"):
			archaea = arg
		elif opt in ("-b", "--bacteria"):
			bacteria = arg
		elif opt in ("-e", "--eukaryota"):
			eukaryota = arg
		elif opt in ("-v", "--viruses"):
			viruses = arg

	allDomains = Set([])
	
	archaea = readFileToDictionary(archaea,"\t",0,1)
	bacteria = readFileToDictionary(bacteria,"\t",0,1)
	eukaryota = readFileToDictionary(eukaryota,"\t",0,1)
	viruses = readFileToDictionary(viruses,"\t",0,1)
	combine(allDomains,archaea,bacteria,eukaryota,viruses)
	

	
