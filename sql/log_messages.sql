SELECT
  log_id,
  user_id,
  created_at,
  (
    CASE
      WHEN jsonb_extract_path(log_data, 'document') IS NOT NULL
        THEN CAST(log_data->'document'->'file_name' AS TEXT)
      WHEN jsonb_extract_path(log_data, 'text') IS NOT NULL
        THEN CAST(log_data->'text' AS TEXT)
      ELSE '-'
    END
  ) AS log_message
FROM logs;