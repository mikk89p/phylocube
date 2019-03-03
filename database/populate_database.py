# -*- coding: cp1257 -*-
# Last update: 17.05.18

# import sys, getopt, subprocess, os
from sets import Set
import json
import MySQLdb


def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False


def readFileToDictionary(filePath, split, key_column, value_column):
    try:
        file = open(filePath, "r")
    except:
        print("ERROR - Reading " + str(filePath))

    dict = {}
    while True:
        line = file.readline()

        if line == "":
            break

        line = line.strip()
        lineList = line.split(split)

        if (len(lineList) > key_column and len(lineList) > value_column):
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
        credentials[arr[0]] = arr[1]

    db = MySQLdb.connect(
        host=credentials['DB_HOST'],
        port=int(credentials['DB_PORT']),
        user=credentials['DB_USER'],
        passwd=credentials['DB_PASS'],
        db=credentials['DB_NAME'])

    return db


def addTaxonParentsToSet(taxonomy_set, taxonomy_file):
    with open(taxonomy_file, 'r') as f:
        content = f.readlines()

    for line in content:
        arr = line.split("\t")
        taxid = int(arr[0])
        full_taxonomy_id = "-"
        if (len(arr) > 5):
            full_taxonomy_id = arr[5]

        if (taxid in taxonomy_set):
            ids = full_taxonomy_id.split(';')
            for id in ids:
                if (is_number(id)):
                    taxonomy_set.add(int(id))

    return taxonomy_set


def insertTaxonomy(db, cursor, resource):

    # Import only taxons which exist in the assignment table
    # Default ~1,618,192 rows ~2GB
    cursor.execute("SELECT DISTINCT taxonomy_id FROM pfam_assignment UNION SELECT DISTINCT taxonomy_id FROM supfam_assignment UNION SELECT DISTINCT taxonomy_id FROM gene3d_assignment ORDER BY taxonomy_id DESC")
    rows = cursor.fetchall()
    taxonomy_set = set()
    values = []

    for row in rows:
        taxonomy_set.add(int(row[0]))

    version = resources[resource]['version']
    taxonomy_file = resources[resource]['taxonomy_file']

    # Add all genera, family etc
    taxonomy_set = addTaxonParentsToSet(taxonomy_set, taxonomy_file)
    taxonomy_set.add(1)  # root

    values = []
    with open(taxonomy_file, 'r') as f:
        content = f.readlines()

    contentLen = len(content)
    maxNumberInsert = 5000
    count = 0
    for line in content:
        add = False  # If a taxon should be added to the database
        count += 1
        line = line.strip()
        arr = line.split("\t")
        taxid = int(arr[0])
        name = arr[1]
        rank = arr[2]
        parent_id = int(arr[3])
        full_taxonomy = "-"
        full_taxonomy_id = "-"
        if (len(arr) > 4):
            full_taxonomy = arr[4]
        if (len(arr) > 5):
            full_taxonomy_id = arr[5]

        ids = full_taxonomy_id.split(';')
        if(taxid == 7742):
            print(rank)
            print(full_taxonomy_id)
            print(full_taxonomy)
            print(ids[0])
            print(taxid)
            print(taxid in taxonomy_set)
            print(rank == 'no rank' and len(ids) <= 10 and ids[0] != 10239)

        # 'no rank' must be added for Vertebrata etc. Vertebrata has 9 taxons, species or isolates more than 10 but viruses 10239 samller full tax
        # Current settings 273.4 MiB
        # removed parent_id in taxonomy_set

        # if ((rank in ['kingdom', 'superkingdom', 'phylum', 'class', 'order', 'family', 'genus']) or (rank == 'no rank' and len(ids) <= 10 and ids[0] != "10239") or taxid in taxonomy_set):
        # Add only taxons present in all databases
        if (taxid in taxonomy_set):
            for id in ids:
                if(id == 2072063):
                    print(ids)
                if (is_number(id)):
                    taxonomy_set.add(int(id))
            add = True

        if (not add):
            continue

        value = [str(taxid), name, rank, str(parent_id),
                 full_taxonomy, full_taxonomy_id]
        values.append(value)
        if (len(values) >= maxNumberInsert or count == contentLen):
            try:
                cursor.executemany(
                    "INSERT INTO taxonomy (id,name,rank,parent_id,full_taxonomy,full_taxonomy_id) VALUES (%s,%s,%s,%s,%s,%s)", values)
                db.commit()
                values = []
            except:
                # print(values)
                print("ERROR in insert Taxonomy or taxonomy exist")
                db.rollback()


def insertResource(db, cursor, resource):
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

    print(id)
    print(type)

    try:
        cursor.execute("INSERT INTO resource (id, type, name, description, version, url, api_url, classification_version, cellular_genomes_version, viral_genomes_version,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                       (id, type, name, description, version, url, api_url, classification_version, cellular_genomes_version, viral_genomes_version, archaea_genomes, bacteria_genomes, eukaryota_genomes, virus_genomes))
        db.commit()
    except:
        print("ERROR in insertResource or resource exist")
        db.rollback()


def insertProteinDomain(db, cursor, resource):

    # Load descriptions dictionary
    description_file = resources[resource]['description_file']
    description_dict = readFileToDictionary(description_file, "\t", 0, 1)

    classification_dict = {}
    if (resource == "supfam"):
        classification_dict = readFileToDictionary(
            description_file, "\t", 0, 2)
    if (resource == "gene3d"):
        classification_dict = readFileToDictionary(
            description_file, "\t", 0, 0)

    id = resources[resource]['id']
    domains_file = resources[resource]['domains_file']
    with open(domains_file, 'r') as f:
        content = f.readlines()

    uniqueAcc = Set([])
    values = []
    for line in content:
        line = line.strip()
        arr = line.split("\t")
        acc = arr[0]

        # First row has headings
        if (acc == "domain_acc"):
            continue
        if (acc == "0" or acc == "-"):
            acc = "None"

        # Gene3D Fold classes
        '''
		fold_class_id = 100
		if (resource == "supfam" or resource == "gene3d"):
			if (acc.startswith( '1.')):
				fold_class_id = 1
			elif (acc.startswith( '2.')):
				fold_class_id = 2
			elif (acc.startswith( '3.')):
				fold_class_id = 3
			elif (acc.startswith( '4.')):
				fold_class_id = 4
			elif(acc.startswith("a")):
				fold_class_id = 11
			elif(acc.startswith("b")):
				fold_class_id = 12
			elif(acc.startswith("c")):
				fold_class_id = 13
			elif(acc.startswith("d")):
				fold_class_id = 14
			elif(acc.startswith("e")):
				fold_class_id = 15
			elif(acc.startswith("f")):
				fold_class_id = 16
			elif(acc.startswith("g")):
				fold_class_id = 17
			elif(acc.startswith("h")):
				fold_class_id = 18
			elif(acc.startswith("i")):
				fold_class_id = 19
			elif(acc.startswith("j")):
				fold_class_id = 20
			elif(acc.startswith("k")):
				fold_class_id = 21
		'''

        # Insert only unique domains
        if acc in uniqueAcc:
            continue
        else:
            uniqueAcc.add(acc)

        description = description_dict.get(acc)
        if(description is None):
            description = "None"

        classification = classification_dict.get(acc)
        if(classification is None):
            classification = None

        resource_id = id
        value = [acc, description, resource_id, classification]
        values.append(value)

    try:
        cursor.executemany(
            "INSERT INTO protein_domain (acc, description, resource_id, classification) VALUES (%s,%s,%s,%s)", values)
        db.commit()
    except:
        print("ERROR in insert Protein Domain")
        db.rollback()


def insertSummary(db, cursor, resource):
    resource_id = resources[resource]['id']
  # CL0507 is under pfam and pfam32. Thus, two entries in db
    cursor.execute(
        "SELECT acc, id FROM protein_domain WHERE resource_id="+str(resource_id))
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

        # First row has headings
        if (not is_number(arr[1])):
            continue

        archaea = int(arr[1]) if is_number(arr[1]) else 0
        bacteria = int(arr[2]) if is_number(arr[2]) else 0
        eukaryota = int(arr[3]) if is_number(arr[3]) else 0
        virus = int(arr[4]) if is_number(arr[4]) else 0

        protein_domain_id = acc_dict.get(acc)

        if(protein_domain_id is not None):
            value = [protein_domain_id, archaea, bacteria, eukaryota, virus]
            values.append(value)
        else:
            print(acc)

    try:
        cursor.executemany(
            "INSERT INTO distribution (protein_domain_id, archaea, bacteria, eukaryota, virus) VALUES (%s,%s,%s,%s,%s)", values)
        db.commit()
    except:
        print("ERROR in insert into distribution")
        db.rollback()


def insertAssignments(db, cursor, resource):

    resource_id = resources[resource]['id']
    resource_type = resources[resource]['type']
    # if (resource_type == 'clan'):
    # resource_type =='pfam'

    # CL0507 is under pfam and pfam32. Thus, two entries in db
    # each assignment is connected to a protein domain from protein_domain table
    cursor.execute(
        "SELECT acc, id FROM protein_domain WHERE resource_id="+str(resource_id))
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
        if (len(arr) > 3):
            e_val = arr[3]
        if (acc == ""):
            continue

        protein_domain_id = acc_dict.get(acc)
        if(protein_domain_id is not None):
            value = [taxid, protein_domain_id, frequency, e_val]
            values.append(value)

        if (len(values) >= maxNumberInsert or count == contentLen):
            try:
                # Created three tables for each resource to get faster query speeds
                if (e_val):
                    sql = "INSERT INTO " + \
                        str(resource_type) + \
                        "_assignment (taxonomy_id,protein_domain_id,frequency,e_val) VALUES (%s,%s,%s,%s)"
                else:
                    sql = "INSERT INTO " + \
                        str(resource_type) + \
                        "_assignment (taxonomy_id,protein_domain_id,frequency) VALUES (%s,%s,%s)"
                cursor.executemany(sql, values)
                db.commit()
                values = []
            except:
                #  DELETE t FROM `assignment` t JOIN `protein_domain` e ON t.protein_domain_id = e.id WHERE e.resource_id >5;
                print("ERROR in insert into assignment")
                db.rollback()


def insertClanMembership(db, cursor, resource):
    version = resources[resource]['version']
    membership_file = resources[resource]['membership_file']
    with open(membership_file, 'r') as f:
        content = f.readlines()

    values = []
    for line in content:
        line = line.strip()
        arr = line.split("\t")
        clan = arr[0]
        pfam = arr[1]
        value = [clan, pfam, version]
        values.append(value)
    try:
        cursor.executemany(
            "INSERT INTO clan_membership (clan_acc,pfam_acc,version) VALUES (%s,%s,%s)", values)
        db.commit()
    except:
        print("ERROR in insert into clan_membership")
        db.rollback()


def insertFoldClass(db, cursor, fold_class):
    id = fold_class['id']
    description = fold_class['description']
    values = [id, description]

    try:
        cursor.execute(
            "INSERT INTO fold_class (id,description) VALUES (%s,%s)", values)
        db.commit()
    except:
        print("ERROR in insert into fold_class")
        db.rollback()


def addIndex(db, cursor, resource):
  # Very important for speed
    cursor.execute(
        "CREATE INDEX taxonomy_id_index ON gene3d_assignment (taxonomy_id)")
    cursor.execute(
        "CREATE INDEX taxonomy_id_index ON supfam_assignment (taxonomy_id)")
    cursor.execute(
        "CREATE INDEX taxonomy_id_index ON pfam_assignment (taxonomy_id)")
    cursor.execute(
        "CREATE INDEX taxonomy_id_index ON clan_assignment (taxonomy_id)")
    cursor.execute("CREATE INDEX taxonomy_rank_index  ON taxonomy (rank)")
    cursor.execute(
        "CREATE INDEX taxonomy_parent_id_index ON taxonomy (parent_id)")
    cursor.execute(
        "CREATE INDEX clan_membership_pfam_acc_index  ON clan_membership (pfam_acc)")
    cursor.execute(
        "CREATE INDEX clan_membership_clan_acc_index  ON clan_membership (clan_acc)")
    cursor.execute("CREATE INDEX acc_index ON protein_domain (acc)")
    cursor.execute(
        "CREATE INDEX description_index ON protein_domain (description)")

    cursor.execute("CREATE INDEX resource_type_index ON resource (type)")
    cursor.execute("CREATE INDEX resource_version_index ON resource (version)")


if __name__ == '__main__':
    # Connect
    db = connectDb()
    cursor = db.cursor()

    '''
	with open('fold_classes.json') as f:
		fold_classes = json.load(f)

	for fold_class in fold_classes:
		insertFoldClass(db,cursor,fold_class)
  '''
    with open('resources.json') as f:
        resources = json.load(f)

    # Taxonomy should be last as it uses assignment table
    # initList = ["gene3d","supfam","pfam","clan","clanpfam","taxonomy"]
    # initList = ["pfam32","clan32","clanpfam32","taxonomy"]
    # initList = ["gene3d","supfam","pfam","clan","clanpfam","pfam32","clan32","clanpfam32"]
    # initList = ["gene3d","supfam"]
    # initList = ["pfam","clan","pfam32","clan32"]
    # initList = ["clan","clan32"]
    initList = ["taxonomy"]
    for resource in initList:
        if (resource == "taxonomy"):
            print("insertTaxonomy")
            insertTaxonomy(db, cursor, resource)
            # pass
        elif (resource == "clanpfam" or resource == "clanpfam32"):
            print("Only building " + str(resource) + " resource")
            # insertResource(db,cursor,resource)
        else:
            print("Building " + str(resource) + " resource")
            # insertResource(db,cursor,resource)
            print("Inserting " + str(resource) + " protein domains")
            # insertProteinDomain(db,cursor,resource)
            print("Inserting " + str(resource) + " distribution")
            # insertSummary(db,cursor,resource)
            print("Inserting " + str(resource) +
                  " assignments (takes several minutes)")
            # insertAssignments(db,cursor,resource)
            if (resource == "pfam" or resource == "pfam32"):
                # insertClanMembership(db,cursor,resource)
                pass

    # print("Adding index to assignment and taxonomy table (takes several minutes)")
    # addIndex(db,cursor,resource)

    # Close the connection
    db.close()
    print("Database connection closed")
    print("Done")
