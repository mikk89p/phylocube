# phyloCube Overview
A PhyloCube is a 3D scatterplot of the concurrence of protein domains in superkingdoms (Archaea, Bacteria, and Eukaryota).

### Fornt end: Angular
Front end is build with Angular framework (version 6) using Plotly library for the 3d scatter plot.

### Back end: Node.js 
Back end application with RESTful API v1
1. server.js - entry script
2. database.env - credentials for database connection

### Database: MariaDB
Phylocube uses custom SQL database combined from different sources (incl. Gene3D, SUPERFAMILY and Pfam).
1. phylocube.sql - sql structure<br>
2. database.env (database_example.env) - credentials for connecting mariadb<br>
3. readme - Download the data and run scripts<br>
4. helper_create_ncbi_full_taxonomy.py - a script for creating a file for taxonomy table<br>
4. helper_add_taxonomy.py - a script for adding taxonomy to a tsv file. It is needed for Pfam data.<br>
5. combine_files.py - a script for creating a file for summary table<br>
6. resources.json - information about Gene3D, SUPERFAMILY, Pfam and NCBI taxonomy resources<br>
7. populate_database.py - a script to populate database tables<br>

# TODO
1. Include Pfam 32.0
2. Include new SUPERFAMILY 2
3. Customize Axes speed
4. Support for new plotly versions
5. Custom Axes supfam (Viridiplantae | Taxonomy ID: 33090; Vertebrata | Taxonomy ID: 7742; Fungi | Taxonomy ID: 4751)
  - The shape of the phlyocube is cuboid not cube   