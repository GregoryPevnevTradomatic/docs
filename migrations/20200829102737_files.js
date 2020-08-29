const { DOCS_TABLE, FILES_TABLE } = require('./utils/constants'); // eslint-disable-line

exports.up = function(knex) {
  const documentTableChanges = knex.schema.alterTable(DOCS_TABLE, builder => {
    builder.dropColumns(['template_file', 'result_file']);
  });

  const filesTable = knex.schema.createTable(FILES_TABLE, builder => {
    builder.string('file_id', 36).primary('FILES_PK');
    builder.integer('doc_id').notNullable();
    builder.string('file_name', 250).notNullable();
    builder.enum('file_type', ['template', 'result']).notNullable();
    builder.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    builder.foreign('doc_id', 'FILES_DOCS_FK')
      .references('doc_id')
      .inTable(DOCS_TABLE)
      .onDelete('RESTRICT');

    builder.unique(['doc_id', 'file_type'], 'FILES_SEARCH_INDEX');
  });

  return Promise.all([
    documentTableChanges,
    filesTable,
  ]);
};

exports.down = async function(knex) {
  return knex.schema.dropTable(FILES_TABLE).then(
    () => knex.schema.alterTable(DOCS_TABLE, builder => {
      builder.string('template_file', 250).nullable();
      builder.string('result_file', 250).nullable();
    })
  );
};
