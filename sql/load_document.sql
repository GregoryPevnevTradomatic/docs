-- Single row result (More convinient)
EXPLAIN ANALYZE
SELECT
	docs.doc_id,
	docs.status,
	docs.parameters, 
	docs.values,
	templates.file_id,
	templates.file_name,
	results.file_id,
	results.file_name
FROM docs
LEFT JOIN (
	SELECT file_id, doc_id, file_name FROM files
	WHERE file_type = 'template'
) AS templates ON docs.doc_id = templates.doc_id
LEFT JOIN (
	SELECT file_id, doc_id, file_name FROM files
	WHERE file_type = 'result'
) AS results ON docs.doc_id = results.doc_id
-- Applies to ALL Indexes of tables being joined
--  -> Filtering using Index-Scan instead of Sequential-Scan from 3 Tables
--     1) Docs Primaryt key
--     2) Files Compound Search-Index - Using BOTH Doc-Id and File-Type ("template")
--     3) Files Compound Search-Index - Using BOTH Doc-Id and File-Type ("result")
WHERE docs.doc_id = 1;

-- Shorter version of the first query
EXPLAIN ANALYZE
SELECT
	docs.doc_id,
	docs.status,
	docs.parameters, 
	docs.values,
	templates.file_id AS template_id,
	templates.file_name AS template_filename,
	results.file_id AS result_id,
	results.file_name AS result_filename
FROM docs
LEFT JOIN files AS templates ON docs.doc_id = templates.doc_id AND templates.file_type = 'template'
LEFT JOIN files AS results ON docs.doc_id = results.doc_id AND results.file_type = 'result'
WHERE docs.doc_id = 1;

-- Single row result (More performant)
EXPLAIN ANALYZE
SELECT
	docs.doc_id,
	docs.status,
	docs.parameters, 
	docs.values,
	files.file_id,
	files.file_name
FROM docs
LEFT JOIN files ON docs.doc_id = files.doc_id
-- Applies to Indexes of BOTH files and documents tables
--  -> Filtering using Index-Scan instead of Sequential-Scan on BOTH sides
WHERE docs.doc_id = 1;

-- Check which one of these is better with lots of data (How much do indexes matter)
