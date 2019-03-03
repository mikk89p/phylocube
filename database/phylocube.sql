CREATE TABLE resource (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  type VARCHAR(30) NOT NULL, /* gene3d, supfam, clan, pfam etc.. */
  name VARCHAR(30) NOT NULL, /* Pfam 31.0 etc.. */
  description VARCHAR(500) NULL, 
  version VARCHAR(10) NOT NULL, /* SUPERFAMILY v1.75, Gene3D  V16.0  etc*/
	url VARCHAR(250) NULL,
  api_url VARCHAR(250) NULL,
  classification_version VARCHAR(100) NOT NULL,  /* SUPERFAMILY v1.75, CATH 4.2, Pfam 31.0 etc*/
  cellular_genomes_version VARCHAR(100) NOT NULL,  /* UniProt proteomes v2017 etc, SUPERFAMILY has assigned cellular and viral differently*/
  viral_genomes_version VARCHAR(100) NOT NULL,
  archaea_genomes SMALLINT UNSIGNED NOT NULL,
  bacteria_genomes SMALLINT UNSIGNED NOT NULL,
  eukaryota_genomes SMALLINT UNSIGNED NOT NULL,
  virus_genomes SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY(id)
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE protein_domain (
  id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
  acc VARCHAR(20) NOT NULL, /* 54427, PF01812, 3.40.150.40,  CL0344 etc.. */
  description VARCHAR(130) DEFAULT 'None', /*100 truncated for supfam*/
  resource_id SMALLINT UNSIGNED NOT NULL,
  classification VARCHAR(20) NULL,
  PRIMARY KEY(id),
  foreign key (resource_id) references resource (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;



CREATE TABLE distribution (
  id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
  protein_domain_id MEDIUMINT UNSIGNED NOT NULL,
  archaea MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Archaea genomes */
  bacteria MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Bacteria genomes*/
  eukaryota MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Eukaryota genomes*/
  virus MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Virus genomes*/
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;

/*To speed up assignment search I had to create multiple tables*/
CREATE TABLE supfam_assignment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  taxonomy_id MEDIUMINT UNSIGNED NOT NULL,
  protein_domain_id MEDIUMINT UNSIGNED NOT NULL,
  frequency SMALLINT UNSIGNED NOT NULL, /* frequency in a genome */
  e_val VARCHAR(150) NULL, /* Lowest e-val */
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;


CREATE TABLE pfam_assignment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  taxonomy_id MEDIUMINT UNSIGNED NOT NULL,
  protein_domain_id MEDIUMINT UNSIGNED NOT NULL,
  frequency SMALLINT UNSIGNED NOT NULL, /* frequency in a genome */
  e_val VARCHAR(150) NULL, /* Lowest e-val */
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE clan_assignment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  taxonomy_id MEDIUMINT UNSIGNED NOT NULL,
  protein_domain_id MEDIUMINT UNSIGNED NOT NULL,
  frequency SMALLINT UNSIGNED NOT NULL, /* frequency in a genome */
  e_val VARCHAR(150) NULL, /* Lowest e-val */
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE gene3d_assignment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  taxonomy_id MEDIUMINT UNSIGNED NOT NULL,
  protein_domain_id MEDIUMINT UNSIGNED NOT NULL,
  frequency SMALLINT UNSIGNED NOT NULL, /* frequency in a genome */
  e_val VARCHAR(150) NULL, /* Lowest e-val */
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;


CREATE TABLE taxonomy (
  id MEDIUMINT UNSIGNED NOT NULL,
	name VARCHAR(200) NOT NULL, /* SELECT  max(length(name)) AS Max_Length_String FROM taxonomy -> 108*/
	rank VARCHAR(50) NULL,  /* SELECT  max(length(rank)) AS Max_Length_String FROM taxonomy -> 16*/
	parent_id MEDIUMINT UNSIGNED NOT NULL,
	full_taxonomy VARCHAR(600) NULL, /*SELECT  max(length(full_taxonomy)) AS Max_Length_String FROM taxonomy -> 450*/
	full_taxonomy_id VARCHAR(600) NULL,
  PRIMARY KEY(id)
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE taxonomy AUTO_INCREMENT = 1


CREATE TABLE clan_membership (
  id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT, 
  clan_acc VARCHAR(6) NOT NULL,
  pfam_acc VARCHAR(7) NOT NULL, 
  version VARCHAR(10) NOT NULL,
  PRIMARY KEY(id)
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE clan_membership AUTO_INCREMENT = 1


/* 
CREATE TABLE fold_class (
  id SMALLINT UNSIGNED NOT NULL,
  description VARCHAR(250) DEFAULT 'None', 
  PRIMARY KEY(id)
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;
*/