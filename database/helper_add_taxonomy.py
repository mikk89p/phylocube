# -*- coding: cp1257 -*-
#Author: Mikk Puustusmaa
#Last update: 20.06.18

import sys, getopt

def is_number(s):
	try:
		float(s)
		return True
	except ValueError:
		return False

def striplist(l):
    return([x.strip() for x in l])

def addName(filePath):
	with open(filePath, 'r') as f:
		content = f.readlines()
	for line in content:

		arr = line.split("\t")
		arr = striplist(arr)
		tax_id = arr[0]

		if(is_number(tax_id)):
			full_taxonomy = tax_dict.get(int(tax_id))
			if(full_taxonomy is not None):
				taxonomy_arr = full_taxonomy.split(";")
				domain = taxonomy_arr[0]
				if (domain_only):
					arr.append(domain)
				else:
					arr.append(full_taxonomy)
				
				print ('\t'.join(arr))
			

def readFileToDictionary(filePath, split, key_column,value_column):
	dictionary = {}
	with open(filePath, 'r') as f:
		content = f.readlines()
	for line in content:

		lineList = line.split("\n")
		lineList = lineList[0].split(split)
		key = (lineList[key_column]).strip()
		if(is_number(key)):
			key = int(key)
			value = (lineList[value_column]).strip()
			dictionary[key] = value

	return dictionary



def usage():
	print('scriptName.py -i <tsv file> -t <ncbi_taxonomy.tsv> ')
	print('-v, --verbose  \t print process steps')
	print('-i, --input \t input file, a tsv file')
	print('-t, --taxonomy \t ncbi taxonomy tsv file')
	print('-d, --domain_only \t only domain: Bacteria, Archaea, Eukaryota or Viruses is included')
	
def main():
	try:
		#with options that require an argument followed by a colon
		#usage of full names "help", "input=","output=" help doesn't need argument input and output does
		opts, args = getopt.getopt(sys.argv[1:], "hvi:t:d", ["help", "verbose","input=","taxonomy=","domain_only"])
	except getopt.GetoptError as err:
		# print help information and exit:
		print(err)  # will print something like "option -a not recognized"
		usage()
		sys.exit(2)

	for opt, arg in opts:
		if opt in ("-v", "--verbose"):
			global verbose
			verbose = True
		elif opt in ("-h", "--help"):
			usage()
			sys.exit()
		elif opt in ("-i", "--input"):
			global input
			input = arg
		elif opt in ("-t", "--taxonomy"):
			global taxonomy
			taxonomy = arg
		elif opt in ("-d", "--domain_only"):
			global domain_only
			domain_only = True
		else:
			assert False, "unhandled option"




if __name__ == '__main__':
	verbose = False
	domain_only = False
	main()
	tax_dict = readFileToDictionary(taxonomy, "\t", 0,4)
	addName(input)

	if(verbose):
		print('completed') 


	
