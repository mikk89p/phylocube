# API v1 functionality
### Get all resources
<code>/api/v1/resource</code>
### Get resource by type and version
<code>/api/v1/resource/:type?/version/:version?</code>
### Get taxon by NCBI taxonomy Id
<code>/api/v1/taxonomy/:id?</code>
### Get taxon by NCBI taxonomy Id using SQL LIKE %...% (LIMIT 100)
<code>/api/v1/taxonomy/idlike/:id?</code>
### Get taxon by name using SQL LIKE LIKE %...% (LIMIT 100)
<code>/api/v1/taxonomy/namelike/:name?</code>
### Get taxon by NCBI taxonomy Id or by name using SQL LIKE LIKE %...% (LIMIT 100)
<code>/api/v1/taxonomy/namelikeorid/:query?</code>
### Get taxon by name or id using SQL LIKE LIKE %...% (LIMIT 100)
<code>/api/v1/taxonomy/nameorid/:query?</code>
### Get all protein domains
<code>/api/v1/proteindomain/</code>
### Get protein domain by accession
<code>/api/v1/proteindomain/:acc?/version/:version?</code>
### Get protein domain joined with distribution table by protein domain accession
<code>/api/v1/proteindomain/:acc?/version/:version?/distribution</code>
### Get protein domains by resource type and version
<code>/api/v1/proteindomain/resource/:type?/version/:version?</code>
### Get protein domains by resource type and version with distribution table joined
<code>/api/v1/proteindomain/distribution/resource/:type?/version/:version?</code>
### Get assignment by protein domain accession
<code>/api/v1/assignment/:acc?/resource/:type?/version/:version?</code>
### Get all protein domain's acc by resource type, version and taxonomy id
<code>/api/v1/assignment/proteindomain/resource/:type?/version/:version?/taxonomy/:id?</code>
### Get protein domains by resource type and taxonomy id
<code>/api/v1/assignment/proteindomain/distribution/resource/:type?/version/:version?/taxonomy/:id?</code>
### Get protein domains acc with counts in the taxon by resource type and taxonomy id
<code>/api/v1/assignment/proteindomain/acc/resource/:type?/version/:version?/taxonomy/:id?</code>
### Get clan by pfam and version
<code>/api/v1/clanmembership/:acc_pfam?/version/:version?</code>