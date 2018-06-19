# Gene3D (CATH) assignments
### Protein domain assignments: 
Download data:<br>
<code>wget http://download.cathdb.info/gene3d/CURRENT_RELEASE/representative_uniprot_genome_assignments.csv.gz</code><br>
<code>gunzip representative_uniprot_genome_assignments.csv.gz</code><br>

Download descriptions:<br>
<code>wget ftp://orengoftp.biochem.ucl.ac.uk/cath/releases/daily-release/newest/cath-b-newest-names.gz</code><br>
<code>gunzip cath-b-newest-names.gz</code><br>
<code>sed 's/ /'$'\t''/' cath-b-newest-names>cath-b-newest-names.tsv</code><br>

<br>Replace commas inside regions column:<br>
<code>awk -F'"' -v OFS='' '{ for (i=2; i<=NF; i+=2) gsub(",", ";", $i) } 1' representative_uniprot_genome_assignments.csv > representative_uniprot_genome_assignments_fixed.csv </code>
<br>Select necessary columns:<br>
<code>cut -d "," -f3,4,6,8 representative_uniprot_genome_assignments_fixed.csv > gene3d_data_raw.csv</code><br>
<br>Remove dublicate rows by taxon_id and domain accession:<br>
<code>awk -F"," '!seen[$1, $3]++' gene3d_data_raw.csv > gene3d_data.csv</code><br>


<br>Protein domains and assignment counts in A,B,E and V:<br>
```
awk -F ',' '$2 ~ /(Archaea)/ {print $3;}' gene3d_data.csv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_A.tsv
awk -F ',' '$2 ~ /(Bacteria)/ {print $3;}' gene3d_data.csv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_B.tsv
awk -F ',' '$2 ~ /(Eukaryota)/ {print $3;}' gene3d_data.csv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_E.tsv
awk -F ',' '$2 ~ /(Viruses)/ {print $3;}' gene3d_data.csv | sort | uniq -c -i | awk '{print $2"\t"$1}' | sort > gene3d_domain_count_V.tsv

python combine_files.py -a gene3d_domain_count_A.tsv -b gene3d_domain_count_B.tsv -e gene3d_domain_count_E.tsv -v gene3d_domain_count_V.tsv > gene3d_cath_ABEV.tsv

```
<br>Protein domain assignments:<br>
<code>awk -F  ',' '{print $1"\t"$3"\t"$4}'  gene3d_data_raw.csv > gene3d_assignments.tsv</code><br>

### Populate database:
<code>python populate_database.py</code>

 

