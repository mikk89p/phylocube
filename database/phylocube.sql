CREATE TABLE resource (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  type VARCHAR(30) NOT NULL UNIQUE, /* gene3d, supfam, clan, pfam etc.. */
  name VARCHAR(30) NOT NULL, /* Pfam 31.0 etc.. */
  description VARCHAR(250) NULL, 
  version VARCHAR(100) NOT NULL, /* SUPERFAMILY v1.75, Gene3D  V16.0  etc*/
  classification_version VARCHAR(100) NOT NULL,  /* SUPERFAMILY v1.75, CATH 4.2, Pfam 31.0 etc*/
  cellular_genomes VARCHAR(100) NOT NULL,  /* UniProt proteomes v2017 etc, SUPERFAMILY has assigned cellular and viral differently*/
  viral_genomes VARCHAR(100) NOT NULL,
  PRIMARY KEY(id)
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE protein_domain (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  acc VARCHAR(30) NOT NULL UNIQUE, /* 54427, PF01812, 3.40.150.40,  CL0344 etc.. */
  name VARCHAR(250) DEFAULT 'None',  /* NTP_transferase etc. Not all domains have names, especially in CATH */
  description VARCHAR(250) DEFAULT 'None',
  resource_id SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY(id),
  foreign key (resource_id) references resource (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;

/*ALTER TABLE protein_domain AUTO_INCREMENT = 1*/

CREATE TABLE summary (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  protein_domain_id INT UNSIGNED NOT NULL,
  archaea MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Archaea genomes */
  bacteria MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Bacteria genomes*/
  eukaryota MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Eukaryota genomes*/
  virus MEDIUMINT UNSIGNED DEFAULT 0, /* occurrence of a protein domain in Virus genomes*/
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE summary AUTO_INCREMENT = 1

/* TODO assignmentsq table*/
CREATE TABLE assignments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  taxid SMALLINT UNSIGNED NOT NULL,
  protein_domain_id INT UNSIGNED NOT NULL,
  significance VARCHAR(150) NULL,
  PRIMARY KEY(id),
  foreign key (protein_domain_id) references protein_domain (id) on delete cascade on update cascade
)engine InnoDB CHARACTER SET=utf8 COLLATE=utf8_unicode_ci;

/*ALTER TABLE assignments AUTO_INCREMENT = 1*/

/* TODO taxonomy table*/

/* TODO Pfam to clan table*/