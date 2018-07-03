# API v1 functionality
### Get all resources
<code>/v1/resource</code>
### Get resource by type
<code>/v1/resource/:type?</code>
### Get taxon by NCBI taxonomy Id
<code>/v1/taxonomy/:id?</code>
### Get taxon by NCBI taxonomy Id using SQL LIKE %...% (LIMIT 100)
<code>/v1/taxonomy/idlike/:id?</code>
### Get taxon by name using SQL LIKE LIKE %...% (LIMIT 100)
<code>/v1/taxonomy/namelike/:name?</code>
### Get taxon by name or id using SQL LIKE LIKE %...% (LIMIT 100)
<code>/v1/taxonomy/nameorid/:query?</code>
### Get all protein domains
<code>/v1/proteindomain/</code>
### Get protein domain by accession
<code>/v1/proteindomain/:acc?</code>
### Get protein domain joined with distribution table by protein domain accession
<code>/v1/proteindomain/:acc?/distribution</code>
### Get protein domains by resource type
<code>/v1/proteindomain/resource/:type?</code>
### Get protein domains by resource type with distribution table joined
<code>/v1/proteindomain/distribution/resource/:type?</code>
### Get assignment by protein domain accession
<code>/v1/assignment/:acc?</code>
### Get protein domains by resource type and taxonomy id
<code>v1/assignment/proteindomain/distribution/resource/:type?/taxonomy/:taxid?</code>
