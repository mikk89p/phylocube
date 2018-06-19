# Gene3D (CATH) assignments
### Create folder
<code>mkdir gene3d</code><br>
<code>cd gene3d</code><br>

### Download descriptions:
<code>wget ftp://orengoftp.biochem.ucl.ac.uk/cath/releases/daily-release/newest/cath-b-newest-names.gz</code><br>
<code>gunzip cath-b-newest-names.gz</code><br>

### Description to format: domain \t	description:
<code>sed 's/ /'$'\t''/' cath-b-newest-names>cath-b-newest-names.tsv</code><br>

### Download protein domain assignments: 
<code>wget http://download.cathdb.info/gene3d/CURRENT_RELEASE/representative_uniprot_genome_assignments.csv.gz</code><br>
<code>gunzip representative_uniprot_genome_assignments.csv.gz</code><br>

### Replace commas inside regions column:
<code>awk -F'"' -v OFS='' '{ for (i=2; i<=NF; i+=2) gsub(",", ";", $i) } 1' representative_uniprot_genome_assignments.csv > representative_uniprot_genome_assignments_fixed.csv </code>

### Select necessary columns:
<code>cut -d "," -f3,4,6,8 representative_uniprot_genome_assignments_fixed.csv > gene3d_data_raw.csv</code><br>

### Remove dublicate rows by taxon_id and domain accession:
<code>awk -F"," '!seen[$1, $3]++' gene3d_data_raw.csv > gene3d_data.csv</code><br>


### Protein domains and assignment counts in A,B,E and V:
```
awk -F ',' '$2 ~ /(Archaea)/ {print $3;}' gene3d_data.csv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_A.tsv
awk -F ',' '$2 ~ /(Bacteria)/ {print $3;}' gene3d_data.csv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_B.tsv
awk -F ',' '$2 ~ /(Eukaryota)/ {print $3;}' gene3d_data.csv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_E.tsv
awk -F ',' '$2 ~ /(Viruses)/ {print $3;}' gene3d_data.csv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_V.tsv

python combine_files.py -a gene3d_domain_count_A.tsv -b gene3d_domain_count_B.tsv -e gene3d_domain_count_E.tsv -v gene3d_domain_count_V.tsv > gene3d_cath_ABEV.tsv

```
### Protein domain assignments in format: taxid domain p-value (gene3d_data_raw.csv => taxid,kingdom,domain,p-value):
<code>awk -F  ',' '{print $1"\t"$3"\t"$4}'  gene3d_data.csv > gene3d_assignments.tsv</code><br>


# SUPERFAMILY assignments
### Download descriptions form mysql database in format  domain \t	description :
<code>mkdir supfam</code><br>
<code>cd supfam</code><br>
<code>mysql superfamily -e "SELECT id,description from des WHERE level='sf';" > supfam_description.tsv</code>
<br>


### Download protein domain assignments form mysql database:
<code>mysql superfamily -e" SELECT taxon_id, comb, genome.domain FROM len_supra JOIN comb_index ON comb_index.id = supra_id JOIN genome USING (genome) WHERE genome.include = 'y' AND supra_id !=1 AND length = 1 AND prot_number !=0; "> supfam_cellular_mysql_result.tsv</code>
<br>
<code>mysql superfamily -e " SELECT taxon_id, comb, subgenome.domain FROM sublen_supra JOIN comb_index ON comb_index.id = supra_id JOIN subgenome USING (subgenome)  WHERE  sublen_supra.genome = 'vl' AND  subgenome.genome = 'vl' AND subgenome.domain = 'V' AND subgenome.complete = 'yes' AND sublen_supra.supra_id !=1 AND length = 1 AND prot_number !=0 AND subgenome.subgenome NOT IN (2146 ,3248, 67); "  > supfam_viruses_mysql_result.tsv</code>
<br>

### Remove headings:
<code>sed -e '1d' supfam_cellular_mysql_result.tsv >  supfam_cellular_data_raw.tsv</code>
<br>
<code>sed -e '1d' supfam_viruses_mysql_result.tsv >  supfam_viral_data_raw.tsv</code>
<br>

### Combine files:
<code>cat supfam_cellular_data_raw.tsv supfam_viral_data_raw.tsv > supfam_data_raw.tsv</code>
<br>

### Remove dublicates:
<code>awk '!seen[$0]++' supfam_data_raw.tsv > supfam_data.tsv</code>
<br>

### Protein domains and assignment counts in A,B,E and V:
```
awk '$3 ~ /A/ {print $2;}' supfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > supfam_domain_count_A.tsv
awk '$3 ~ /B/ {print $2;}' supfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > supfam_domain_count_B.tsv
awk '$3 ~ /E/ {print $2;}' supfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > supfam_domain_count_E.tsv
awk '$3 ~ /V/ {print $2;}' supfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > supfam_domain_count_V.tsv

python combine_files.py -a supfam_domain_count_A.tsv -b supfam_domain_count_B.tsv -e supfam_domain_count_E.tsv -v supfam_domain_count_V.tsv > supfam_ABEV.tsv
```

### Protein domain assignments in format: taxid domain p-value (supfam_data.tsv => taxid,domain,kingdom):
<code>awk '{print $1"\t"$2}'  supfam_data_raw.tsv > supfam_assignments.tsv</code><br>

# Pfam 31.0 assignments
### Create folder
<code>mkdir pfam</code><br>
<code>cd pfam</code><br>

### Download protein domain assignments:
<code>wget --recursive --no-parent ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/proteomes/</code><br>
<code>gunzip /proteomes/ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/proteomes*.gz</code><br>

<code>for file in proteomes/ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/proteomes/*.tsv; do NAME=$(basename $file | cut -f 1 -d '.');  awk -F '\t' '($6 != "") {print "'"$NAME"'""\t"$6"\t"$14"\t"$7"}' "$file"; done > pfam_data_raw.tsv</code><br>


### Download descriptions:
<code>wget ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/Pfam-A.clans.tsv.gz</code>
<code>gunzip Pfam-A.clans.tsv.gz</code><br>

### Pfam descriptions:

### Clan descriptions:

### clan_membership (output tsv file row = CL0001 \t PF00008 )
<code> awk -F '\t'  '{if ($2 != None) print $2"\t"$1}' Pfam-A.clans.tsv | sort > clan_membership.tsv</code><br>





# Populate database
<code>python populate_database.py</code>
