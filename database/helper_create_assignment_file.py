# -*- coding: cp1257 -*-
#Last update: 2.07.18


import sys, getopt, os
from sets import Set


def is_number(s):
	try:
		float(s)
		return True
	except ValueError:
		return False
	
def readFileToDictionary(filePath, split):
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

		if (len(lineList)>1):
			# key taxid + acc
			taxid = (lineList[0]).strip()
			acc = (lineList[1]).strip()
			if (len(lineList)>2):
			  e_val = float((lineList[2]).strip())
			else:
				e_val = "NULL"

			key = str(taxid)+str(acc)
			value = dict.get(key)
			if(value is None):
				e_vals = []
				e_vals.append(e_val)
				value = {'taxid':taxid,'acc':acc,'e_val':e_val, 'count':1,'e_vals':e_vals} 
				dict[key] = value
			else:
				value['count'] = value['count'] + 1
				value['e_vals'].append(e_val)
				if (e_val <= value['e_val'] ):
					value['e_val'] = e_val
					

	file.close()
	return dict	

def printDict(d):
  if (sys.version_info > (3, 0)):
    items = d.items()
  else:
    items = d.iteritems()
  for key, value in items:
    arr = value['e_vals']
    arr.sort()
    e_vals = ";".join(map(str, arr)) 
    print (str(value['taxid']) + '\t' + str(value['acc']) + '\t' + str(value['count']) + '\t' + str(value['e_val']) + '\t' + str(e_vals))



def usage():
	print('scriptName.py -i')
	print('-i, --input \t a taxon ID, domain_acc and e-value tsv file')
	


if __name__ == '__main__':
	try:
		opts, args = getopt.getopt(sys.argv[1:], "hi:", ["help","input="])
	except getopt.GetoptError as err:
		print(err)  # will print something like "option -a not recognized"
		usage()
		sys.exit(2)

	for opt, arg in opts:
		if opt in ("-h", "--help"):
			usage()
			sys.exit()
		elif opt in ("-i", "--input"):
			input = arg


	data = readFileToDictionary(input,"\t")
	printDict(data)
	

	
