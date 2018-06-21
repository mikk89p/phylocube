# -*- coding: cp1257 -*-
#Author: Mikk Puustusmaa
#Last update: 17.10.17
import sys, getopt

def is_number(s):
	try:
		float(s)
		return True
	except ValueError:
		return False

def striplist(l):
    return([x.strip() for x in l])

def printDict(d):
	if (sys.version_info > (3, 0)):
		items = d.items()
	else:
		items = d.iteritems()
	
	for key, value in items:
		print (value)
		
def write_list_to_file(filename,list):
	outputfile = open(filename, "w")
	for i in range (0,len(list)):
		outputfile.write(str(list[i][0])+"\t"+str(list[i][1])+"\n")
	outputfile.close()
	
def getParentId(tax_id):
	parent_in_dict = node_dict.get(tax_id)
	if(parent_in_dict is not None):
		result = int(parent_in_dict)
		#cellular organisms = 131567; viruses = 10239
		if (result == 1 or result == 131567):
			return 1
		else:
			return result
	else:
		return False

def findFullTaxonomy(tax_id):

	result = getParentId(tax_id)
	if(result):
		if (result == 1):
			return ""
		else:
			return str(findFullTaxonomy(result)) + ";" + str(tax_dict.get(result)) + ";" + str(tax_dict.get(tax_id))
	else:
		return ""
 


def findFullTaxonomyIds(tax_id):
	result = getParentId(tax_id)
	if(result):
		if (result == 1):
			return ""
		else:
			return str(findFullTaxonomyIds(result)) + ";" + str(result) + ";" + str(tax_id)
	else:
		return ""
	
def addFulltaxonomy(input):
	result = {}

	with open(input, 'r') as f:
		content = f.readlines()
	for line in content:		
		lineList = line.split("\t")
	
		tax_id = lineList[0]
		name = lineList[1].split("\n")
		name = name[0]
	
		if(is_number(tax_id)):
			tax_id = int(tax_id)
			rank = rank_dict.get(tax_id)
			parent_id = getParentId(tax_id)
			if (not parent_id):
				print (tax_id)
				continue #Some taxons do not have parent in nodes.dmp. However, parent id is in uniprot taxonomy
			full_taxonomy = findFullTaxonomy(parent_id)
			full_taxonomy_id = findFullTaxonomyIds(parent_id)
			full_taxonomy = full_taxonomy.strip(";")
			full_taxonomy_id = full_taxonomy_id.strip(";")
			
			value = str(tax_id) + '\t' + name + '\t' + str(rank) + '\t' + str(parent_id) + '\t' + full_taxonomy + '\t' + full_taxonomy_id
			result[tax_id] = value
			
			
			#Is current taxon_id merged with some old taxon_id
			#merged key is new taxon_id
			merged = merged_dict_multiple.get(tax_id)
			if(merged is not None):
				#New can be merged with many
				for x in range(0, len(merged)):
					old_tax_id = merged[x]
					old_tax_id = int(old_tax_id)
					is_in_tax_dict = tax_dict.get(old_tax_id)
					if(is_in_tax_dict is None):
						value =  str(old_tax_id) + '\t' + name + '\t' + str(rank) + '\t' + str(parent_id) + '\t' + full_taxonomy + '\t' + full_taxonomy_id
						result[old_tax_id] = value
		

	if(uniprotTaxonomy):
		with open(uniprotTaxonomy, 'r') as f:
			content = f.readlines()
		for line in content:
			arr = line.split('\t')
			tax_id = int(arr[0])
			is_in_result = result.get(tax_id)

			if(is_in_result is None):
				name = arr[1]
				rank = arr[2]
				parent_id = int(arr[4])
				if (rank == ""):
					rank = "no rank"
				full_taxonomy = arr[3]
				taxonomy_arr = full_taxonomy.split(';')
				taxonomy_arr = striplist(taxonomy_arr)
				full_taxonomy = ';'.join(taxonomy_arr)
				full_taxonomy_id = findFullTaxonomyIds(parent_id)
				full_taxonomy_id = full_taxonomy_id.strip(";")
				value =  str(tax_id) + '\t' + name + '\t' + str(rank) + '\t' + str(parent_id) + '\t' + full_taxonomy + '\t' + full_taxonomy_id
				result[tax_id] = value



	printDict(result)

def readFileToDictionaryMultipleValues(filePath, split, key_column,value_column):
	dictionary = {}
	with open(filePath, 'r') as f:
		content = f.readlines()
	for line in content:

		lineList = line.split("\n")
		lineList = lineList[0].split(split)
		key = (lineList[key_column]).strip()
		value = []
		if(is_number(key)):
			key = int(key)
			exists = dictionary.get(key)
			if(exists is not None):
				new_value = (lineList[value_column]).strip()
				exists.append(new_value)
			else:
				val = (lineList[value_column]).strip()
				
				value.append(val)
				dictionary[key] = value
		
	return dictionary	


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
	print('scriptName.py -i <nodes.dmp> -t <ncbi_taxonomy.tsv> -o <output>')
	print('-i, --input \t input file, a nodes.dmp')
	print('-t, --taxonomy \t ncbi taxonomy tsv file: tax_id /t name')
	print('-m, --merged \t ncbi merged.dmp file in tsv format') 
	print('-u, --uniprot taxonomy \t uniprot full taxonomy tsv file')
	print('-v, --verbose \t print process steps')
	
	
def main():
	try:
		#with options that require an argument followed by a colon
		#usage of full names "help", "input=","output=" help doesn't need argument input and output does
		opts, args = getopt.getopt(sys.argv[1:], "hi:t:m:u:v", ["help", "input=","taxonomy=","merged=","uniprot=","verbose"])
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
		elif opt in ("-m", "--merged"):
			global merged
			merged = arg
		elif opt in ("-u", "--uniprot"):
			global uniprotTaxonomy
			uniprotTaxonomy = arg
		else:
			assert False, "unhandled option"


if __name__ == '__main__':
	merged_dict_multiple = {}
	node_dict = {}
	rank_dict = {}
	tax_dict = {}
	uniprotTaxonomy = False
	verbose = False
	main()

	merged_dict_multiple = readFileToDictionaryMultipleValues(merged,"\t",1,0)
	node_dict = readFileToDictionary(input, "	|	", 0,1)
	rank_dict = readFileToDictionary(input, "	|	", 0,2)
	tax_dict = readFileToDictionary(taxonomy, "\t", 0,1)
	addFulltaxonomy(taxonomy)

	if(verbose):
		print('completed') 


	
