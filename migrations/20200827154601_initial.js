const { USERS_TABLE, DOCS_TABLE, LOGS_TABLE } = require('./utils/constants'); // eslint-disable-line

exports.up = function(knex) {
  const usersTable = knex.schema.createTable(USERS_TABLE, builder => {
    builder.string('user_id', 25).primary('USERS_PK');
    builder.string('username', 50)
      .notNullable()
      .defaultTo('');
      builder.timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
  });

  const docsTable = knex.schema.createTable(DOCS_TABLE, builder => {
    builder.increments('doc_id').primary('DOCS_PK');
    builder.string('user_id', 25).notNullable();
    builder.enum('status', ['in-progress', 'aborted', 'completed'])
      .notNullable()
      .defaultTo('in-progress');
    builder.string('template_file', 250).nullable();
    builder.string('result_file', 250).nullable();
    builder.specificType('parameters', 'VARCHAR(250)[]').nullable();
    builder.specificType('values', 'VARCHAR(250)[]').nullable();
    builder.timestamps(true, true);

    builder.foreign('user_id', 'DOCS_USERS_FK')
      .references('user_id')
      .inTable(USERS_TABLE)
      .onDelete('RESTRICT');

    builder.index(['user_id', 'status'], 'DOCS_SEARCH_INDEX');
  });

  const logsTable = knex.schema.createTable(LOGS_TABLE, builder => {
    builder.increments('log_id').primary('LOGS_PK');
    builder.string('user_id', 25).notNullable();
    builder.jsonb('log_message').notNullable();
    builder.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  return Promise.all([usersTable, docsTable, logsTable]);
};

exports.down = function(knex) {
  // Dropping dependents before dropping the users table
  return Promise.all([
    knex.schema.dropTable(DOCS_TABLE),
    knex.schema.dropTable(LOGS_TABLE),
  ]).then(() => knex.schema.dropTable(USERS_TABLE));
};
