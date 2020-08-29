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
WHERE docs.user_id = 'ID1' AND docs.status = 'in-progress';
-- Performance improves drastically after indexing "status" -> (user_id, status)
