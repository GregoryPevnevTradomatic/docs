const { USERS_TABLE, DOCS_TABLE, LOGS_TABLE } = require('./utils/constants'); // eslint-disable-line

exports.up = function(knex) {
  const usersTable = knex.schema.createTable(USERS_TABLE, builder => {
    builder.string('user_id', 25).primary('USERS_PK');
    builder.string('username', 50)
      .notNullable()
      .defaultTo('');
    builder.timestamps(true, true);
  });

  const docsTable = knex.schema.createTable(DOCS_TABLE, builder => {
    builder.increments('doc_id').primary('DOCS_PK');
    builder.string('user_id', 25)
      .references('user_id')
      .inTable(USERS_TABLE)
      .onDelete('SET NULL')
      .index('DOCS_USERS_FK');
    builder.enum('status', ['in-progress', 'aborted', 'completed'])
      .notNullable()
      .defaultTo('in-progress');
    builder.string('template_file', 250).nullable();
    builder.string('result_file', 250).nullable();
    builder.specificType('parameters', 'VARCHAR(250)[]').nullable();
    builder.specificType('values', 'VARCHAR(250)[]').nullable();
    builder.timestamps(true, true);
  });

  const logsTable = knex.schema.createTable(LOGS_TABLE, builder => {
    builder.increments('log_id').primary('LOGS_PK');
    builder.string('user_id', 25)
      .references('user_id')
      .inTable(USERS_TABLE)
      .onDelete('SET NULL')
      .index('LOGS_USERS_FK');
    builder.jsonb('log_message').notNullable();
    builder.timestamps(true, true);
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
