# NCBI taxonomy
### Create folder
<code>mkdir taxonomy</code><br>
<code>cd taxonomy</code><br>

### Download taxonomy:
<code>wget ftp://ftp.ncbi.nlm.nih.gov/pub/taxonomy/taxdump.tar.gz</code><br>
<code>tar -xvzf taxdump.tar.gz</code><br>

### Create a tsv file with taxonid and scientific name:
<code>tr -d "\t" <names.dmp>  names_trimmed.dmp</code><br>
<code>awk -F "|" '$4 ~ /scientific/ {print $1"\t"$2}' names_trimmed.dmp > latest_ncbi_taxonomy.tsv</code><br>

### Create a tsv file with merged taxons:
Some of the datasets do not use latest NCBI taxonomy. Thus, older/merged taxonid-s should be added.<br>
<code>tr -d "\t" <merged.dmp>  merged_trimmed.dmp</code><br>
<code>awk -F "|" '{print $1"\t"$2}' merged_trimmed.dmp > merged.tsv</code><br>

### Some viruses are at subtype rank and these are not included in NCBI taxonomy
<code>wget -O uniprot_taxonomy_viruses.tab.gz 'http://www.uniprot.org/taxonomy/?query=ancestor%3A10239&format=tab&compress=yes'</code><br>
<code>gunzip uniprot_taxonomy_viruses.tab.gz</code><br>
<code>awk -F "\t" '{print $1"\t"$3"\t"$8"\t"$9"\t"$10}' uniprot_taxonomy_viruses.tab > uniprot_taxonomy_viruses.tsv</code><br>
<code>sed -i -e "1d" uniprot_taxonomy_viruses.tsv</code><br>

### Create NCBI full taxonomy by combining NCBI latest taxonomy, merged and isolates/subtypes from uniProt
<code>python ../helper_create_ncbi_full_taxonomy.py -i nodes.dmp -t latest_ncbi_taxonomy.tsv -m merged.tsv -u uniprot_taxonomy_viruses.tsv > ncbi_taxonomy_full.tsv</code><br>

# Gene3D (CATH) assignments
### Create folder
<code>mkdir gene3d</code><br>
<code>cd gene3d</code><br>

### Download descriptions:
<code>wget ftp://orengoftp.biochem.ucl.ac.uk/cath/releases/daily-release/newest/cath-b-newest-names.gz</code><br>
<code>gunzip cath-b-newest-names.gz</code><br>

### Change to tsv:
<code>sed 's/ /'$'\t''/' cath-b-newest-names>cath-b-newest-names.tsv</code><br>

### Download protein domain assignments: 
<code>wget http://download.cathdb.info/gene3d/CURRENT_RELEASE/representative_uniprot_genome_assignments.csv.gz</code><br>
<code>gunzip representative_uniprot_genome_assignments.csv.gz</code><br>

### Replace commas inside regions column:
<code>awk -F'"' -v OFS='' '{ for (i=2; i<=NF; i+=2) gsub(",", ";", $i) } 1' representative_uniprot_genome_assignments.csv > representative_uniprot_genome_assignments_fixed.csv </code>

### Select necessary columns:
<code>cut -d "," -f3,4,6,8 representative_uniprot_genome_assignments_fixed.csv > gene3d_data_raw.csv</code><br>

### Change to tsv format (taxid,acc,e-value,domain)
<code>awk -F  ',' '{print $1"\t"$3"\t"$4"\t"$2}'  gene3d_data_raw.csv > gene3d_data_raw.tsv</code><br>

### Default e-value cut-off is 0.001 in the dataset (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5753370/)
<code> awk -F'\t'  '{if ($3 <= 0.001) print $0}' gene3d_data_raw.tsv > gene3d_data_cutoff_applied.tsv</code><br>

### Remove dublicate rows by taxon_id and domain accession:
<code>awk -F'\t' '!seen[$1, $2]++' gene3d_data_raw.tsv > gene3d_data_without_duplicates.tsv</code><br>



### Genome counts in A,B,E and V:
Add these values to the resources.json file

```
echo -n > genome_counts.tsv
awk -F '\t' '$4 ~ /(Archaea)/ {print $1;}' gene3d_data_without_duplicates.tsv | sort | uniq -c -i | wc -l | awk '{print "Archaea\t"$0;}' >> genome_counts.tsv &
awk -F '\t' '$4 ~ /(Bacteria)/ {print $1;}' gene3d_data_without_duplicates.tsv | sort | uniq -c -i | wc -l | awk '{print "Bacteria\t"$0;}' >> genome_counts.tsv &
awk -F '\t' '$4 ~ /(Eukaryota)/ {print $1;}' gene3d_data_without_duplicates.tsv | sort | uniq -c -i | wc -l | awk '{print "Eukaryota\t"$0;}' >> genome_counts.tsv &
awk -F '\t' '$4 ~ /(Viruses)/ {print $1;}' gene3d_data_without_duplicates.tsv | sort | uniq -c -i | wc -l | awk '{print "Viruses\t"$0;}' >> genome_counts.tsv &
```

### Protein domains and assignment counts in A,B,E and V:
```
awk -F '\t' '$4 ~ /(Archaea)/ {print $3;}' gene3d_data_without_duplicates.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_A.tsv
awk -F '\t' '$4 ~ /(Bacteria)/ {print $3;}' gene3d_data_without_duplicates.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_B.tsv
awk -F '\t' '$4 ~ /(Eukaryota)/ {print $3;}' gene3d_data_without_duplicates.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_E.tsv
awk -F '\t' '$4 ~ /(Viruses)/ {print $3;}' gene3d_data_without_duplicates.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_V.tsv

python ../combine_files.py -a gene3d_domain_count_A.tsv -b gene3d_domain_count_B.tsv -e gene3d_domain_count_E.tsv -v gene3d_domain_count_V.tsv > gene3d_cath_ABEV.tsv

```
### Protein domain assignments (taxid, acc, frequency, lowest E-value):
<code>awk -F '\t' '{print $1"\t"$2"\t"$3}'  gene3d_data_raw.tsv > gene3d_assignments_raw.tsv</code><br>
<code>python ../helper_create_assignment_file.py -i gene3d_assignments_raw.tsv > gene3d_assignments.tsv</code>

# SUPERFAMILY assignments
### Download descriptions form mysql database in format  domain \t	description :
<code>mkdir supfam</code><br>
<code>cd supfam</code><br>
<code>mysql superfamily -e "SELECT id,description,classification FROM des WHERE level='sf';" > supfam_description.tsv</code>
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

### Genome counts in A,B,E and V:
Add these values to the resources.json file

```
echo -n > genome_counts.tsv
awk '$3 ~ /A/ {print $1;}' supfam_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Archaea\t"$0;}' >> genome_counts.tsv &
awk '$3 ~ /B/ {print $1;}' supfam_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Bacteria\t"$0;}' >> genome_counts.tsv &
awk '$3 ~ /E/ {print $1;}' supfam_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Eukaryota\t"$0;}' >> genome_counts.tsv &
awk '$3 ~ /V/ {print $1;}' supfam_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Viruses\t"$0;}' >> genome_counts.tsv &

```

### Protein domains and assignment counts in A,B,E and V:
```
awk '$3 ~ /A/ {print $2;}' supfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > supfam_domain_count_A.tsv
awk '$3 ~ /B/ {print $2;}' supfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > supfam_domain_count_B.tsv
awk '$3 ~ /E/ {print $2;}' supfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > supfam_domain_count_E.tsv
awk '$3 ~ /V/ {print $2;}' supfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > supfam_domain_count_V.tsv

python combine_files.py -a supfam_domain_count_A.tsv -b supfam_domain_count_B.tsv -e supfam_domain_count_E.tsv -v supfam_domain_count_V.tsv > supfam_ABEV.tsv
```

### Protein domain assignments (taxid, acc, frequency, lowest E-value):
<code>awk -F '\t' '{print $1"\t"$2}'  supfam_data_raw.tsv > supfam_assignments_raw.tsv</code><br>
<code>python ../helper_create_assignment_file.py -i supfam_assignments_raw.tsv > supfam_assignments.tsv</code>

# Pfam 31.0 and 32.0 assignments
Info about seq coverage res coverage and Source ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam32.0/relnotes.txt<br>
It may take several minutes to run some of the following commands!<br>
### Create folder
<code>mkdir pfam</code> or <code>mkdir pfam32</code><br>
<code>cd pfam</code><br>

### Download descriptions:
<code>wget ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/Pfam-A.clans.tsv.gz</code><br>
<code>wget ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam32.0/Pfam-A.clans.tsv.gz</code><br>
<code>gunzip Pfam-A.clans.tsv.gz</code><br>
### Clan descriptions:
<code>awk -F '\t' '{if ($2 != "") print $2"\t"$3}' Pfam-A.clans.tsv > clan_description.tsv</code><br>

### Pfam descriptions:
<code>awk -F '\t' '{if ($1 != "") print $1"\t"$5}' Pfam-A.clans.tsv > pfam_description.tsv</code><br>

### clan_membership (output tsv file row = CL0001 \t PF00008 )
<code> awk -F '\t'  '{if ($2 != None) print $2"\t"$1}' Pfam-A.clans.tsv | sort > clan_membership.tsv</code><br>

### Download protein domain assignments:
<code>wget --recursive --no-parent ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/proteomes/</code><br>
<code>gunzip ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/proteomes/*.gz</code><br>
<code>rm ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/proteomes/0.tsv</code><br><br>

<code>wget --recursive --no-parent ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam32.0/proteomes/</code><br>
<code>gunzip ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam32.0/proteomes/*.gz</code><br>
<code>rm ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam32.0/proteomes/0.tsv</code><br><br>

### Select necessary columns (taxid, pfam_acc, clan_acc, E-value):
<code>for file in ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam31.0/proteomes/*.tsv; do NAME=$(basename $file | cut -f 1 -d '.');  awk -F '\t' '($6 != "") {print "'"$NAME"'""\t"$6"\t"$14"\t"$13}' "$file"; done > pfam_clan_data_raw.tsv</code><br>

<code>for file in ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam32.0/proteomes/*.tsv; do NAME=$(basename $file | cut -f 1 -d '.');  awk -F '\t' '($6 != "") {print "'"$NAME"'""\t"$6"\t"$14"\t"$13}' "$file"; done > pfam_clan_data_raw.tsv</code><br>

### Set cut-off e-value (By default, same as gene3d 0.001):
<code> awk -F '\t'  '{if ($4 <= 0.001) print $0}' pfam_clan_data_raw.tsv > pfam_clan_data_cutoff_applied.tsv</code><br>

### Add domain (Archaea, Bacteria, Eukaryota or Virus to data):
<code>python ../helper_add_taxonomy.py -i pfam_clan_data_cutoff_applied.tsv  -t ../taxonomy/ncbi_taxonomy_full.tsv --domain_only > pfam_clan_data_cutoff_applied_with_taxonomy.tsv</code><br>

### Separate Pfam and Clan data (taxid, acc, E-value, domain)::
<code> awk -F '\t'  '{if ($2 != "") print $1"\t"$2"\t"$4"\t"$5}'  pfam_clan_data_cutoff_applied_with_taxonomy.tsv > pfam_data_cutoff_applied_with_taxonomy.tsv</code><br>
<code> awk -F '\t'  '{if ($3 != "No_clan") print $1"\t"$3"\t"$4"\t"$5}'  pfam_clan_data_cutoff_applied_with_taxonomy.tsv > clan_data_cutoff_applied_with_taxonomy.tsv</code><br>


### Remove dublicate rows by taxon_id and protein domain accession:
<code>awk -F '\t' '!seen[$1, $2]++' pfam_data_cutoff_applied_with_taxonomy.tsv > pfam_data.tsv</code><br>
<code>awk -F '\t' '!seen[$1, $2]++' clan_data_cutoff_applied_with_taxonomy.tsv > clan_data.tsv</code><br>


### Genome counts in A,B,E and V:
Add these values to the resources.json file

```
echo -n > genome_counts.tsv
awk -F '\t' '$4 ~ /Archaea/ {print $1;}' pfam_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Archaea\t"$0;}' >> genome_counts.tsv &
awk -F '\t' '$4 ~ /Bacteria/ {print $1;}' pfam_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Bacteria\t"$0;}' >> genome_counts.tsv &
awk -F '\t' '$4 ~ /Eukaryota/ {print $1;}' pfam_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Eukaryota\t"$0;}' >> genome_counts.tsv &
awk -F '\t' '$4 ~ /Viruses/ {print $1;}' pfam_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Viruses\t"$0;}' >> genome_counts.tsv &

echo -n > genome_counts_clan.tsv
awk -F '\t' '$4 ~ /Archaea/ {print $1;}' clan_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Archaea\t"$0;}' >> genome_counts_clan.tsv &
awk -F '\t' '$4 ~ /Bacteria/ {print $1;}' clan_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Bacteria\t"$0;}' >> genome_counts_clan.tsv &
awk -F '\t' '$4 ~ /Eukaryota/ {print $1;}' clan_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Eukaryota\t"$0;}' >> genome_counts_clan.tsv &
awk -F '\t' '$4 ~ /Viruses/ {print $1;}' clan_data.tsv | sort | uniq -c -i | wc -l | awk '{print "Viruses\t"$0;}' >> genome_counts_clan.tsv &
```


### Pfam data summary:
```
awk -F '\t' '$4 ~ /Archaea/ {print $2;}' pfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > pfam_domain_count_A.tsv &
awk -F '\t' '$4 ~ /Bacteria/ {print $2;}' pfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > pfam_domain_count_B.tsv &
awk -F '\t' '$4 ~ /Eukaryota/ {print $2;}' pfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > pfam_domain_count_E.tsv &
awk -F '\t' '$4 ~ /Viruses/ {print $2;}' pfam_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > pfam_domain_count_V.tsv &

python ../phylocube/combine_files.py -a pfam_domain_count_A.tsv -b pfam_domain_count_B.tsv -e pfam_domain_count_E.tsv -v pfam_domain_count_V.tsv > pfam_ABEV.tsv
```


### Clan data summary:
```
awk -F '\t' '$4 ~ /Archaea/ {print $2;}' clan_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > clan_domain_count_A.tsv &
awk -F '\t' '$4 ~ /Bacteria/ {print $2;}' clan_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > clan_domain_count_B.tsv &
awk -F '\t' '$4 ~ /Eukaryota/ {print $2;}' clan_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > clan_domain_count_E.tsv &
awk -F '\t' '$4 ~ /Viruses/ {print $2;}' clan_data.tsv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > clan_domain_count_V.tsv &

python ../phylocube/combine_files.py -a clan_domain_count_A.tsv -b clan_domain_count_B.tsv -e clan_domain_count_E.tsv -v clan_domain_count_V.tsv > clan_ABEV.tsv
```


### Protein domain assignments (taxid, acc, frequency, lowest E-value):
<code>awk -F '\t' '{print $1"\t"$2"\t"$3}'  pfam_data_cutoff_applied_with_taxonomy.tsv > pfam_assignments_raw.tsv</code><br>
<code>python ../helper_create_assignment_file.py -i pfam_assignments_raw.tsv > pfam_assignments.tsv</code><br>
<code>awk -F '\t' '{print $1"\t"$2"\t"$3}'  clan_data_cutoff_applied_with_taxonomy.tsv > clan_assignments_raw.tsv</code><br>
<code>python ../helper_create_assignment_file.py -i clan_assignments_raw.tsv > clan_assignments.tsv</code><br>


# Populate database
<code>python populate_database.py</code>
