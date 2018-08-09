CREATE TABLE resource (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  type VARCHAR(30) NOT NULL UNIQUE, /* gene3d, supfam, clan, pfam etc.. */
  name VARCHAR(30) NOT NULL, /* Pfam 31.0 etc.. */
  description VARCHAR(500) NULL, 
  version VARCHAR(100) NOT NULL, /* SUPERFAMILY v1.75, Gene3D  V16.0  etc*/
	url VARCHAR(250) NULL,
  api_url VARCHAR(250) NULL,
  classification_version VARCHAR(100) NOT NULL,  /* SUPERFAMILY v1.75, CATH 4.2, Pfam 31.0 etc*/
  cellular_genomes_version VARCHAR(100) NOT NULL,  /* UniProt proteomes v2017 etc, SUPERFAMILY has assigned cellular and viral differently*/
  viral_genomes_version VARCHAR(100) NOT NULL,
  archaea_genomes MEDIUMINT UNSIGNED NOT NULL,
  bacteria_genomes MEDIUMINT UNSIGNED NOT NULL,
  eukaryota_genomes MEDIUMINT UNSIGNED NOT NULL,
  virus_genomes MEDIUMINT UNSIGNED NOT NULL,
  PRIMARY KEY(id)
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE protein_domain (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  acc VARCHAR(30) NOT NULL UNIQUE, /* 54427, PF01812, 3.40.150.40,  CL0344 etc.. */
  description VARCHAR(250) DEFAULT 'None',
  resource_id SMALLINT UNSIGNED NOT NULL,
  classification VARCHAR(20) NULL,
  PRIMARY KEY(id),
  foreign key (resource_id) references resource (id) on delete cascade on update cascade,
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE protein_domain AUTO_INCREMENT = 1


CREATE TABLE distribution (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  protein_domain_id INT UNSIGNED NOT NULL,
  archaea MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Archaea genomes */
  bacteria MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Bacteria genomes*/
  eukaryota MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Eukaryota genomes*/
  virus MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Virus genomes*/
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE distribution AUTO_INCREMENT = 1


CREATE TABLE assignment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  taxonomy_id MEDIUMINT UNSIGNED NOT NULL,
  protein_domain_id INT UNSIGNED NOT NULL,
  frequency SMALLINT UNSIGNED NOT NULL, /* frequency in a genome */
  e_val VARCHAR(150) NULL, /* Lowest e-val */
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE assignment AUTO_INCREMENT = 1


CREATE TABLE taxonomy (
  id INT UNSIGNED NOT NULL,
	name VARCHAR(500) NOT NULL, 
	rank VARCHAR(250) NULL, 
	parent_id INT UNSIGNED NOT NULL,
	full_taxonomy VARCHAR(1000) NULL,
	full_taxonomy_id VARCHAR(1000) NULL,
  PRIMARY KEY(id)
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE taxonomy AUTO_INCREMENT = 1


CREATE TABLE clan_membership (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  clan_acc VARCHAR(6) NOT NULL,
  pfam_acc VARCHAR(7) NOT NULL, 
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