const { LOGS_TABLE, LOG_MESSAGES_VIEW } = require('./utils/constants'); // eslint-disable-line

exports.up = function(knex) {
  return knex.schema.alterTable(LOGS_TABLE, builder => {
    builder.renameColumn('log_message', 'log_data');
  }).then(
    () => knex.schema.raw(
      `
      CREATE VIEW ${LOG_MESSAGES_VIEW} AS
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
      `
    )
  );
};

exports.down = function(knex) {
  return knex.schema.alterTable(LOGS_TABLE, builder => {
    builder.renameColumn('log_data', 'log_message');
  }).then(
    () => knex.schema.raw(`DROP VIEW ${LOG_MESSAGES_VIEW}`)
  );
};
