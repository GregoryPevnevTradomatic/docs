const { USERS_TABLE } = require('./utils/constants'); // eslint-disable-line

exports.up = function(knex) {
  return knex.schema.alterTable(USERS_TABLE, builder => {
    builder.dropColumn('created_at');
  }).then(() => knex.schema.alterTable(USERS_TABLE, builder => {
    builder.timestamps(true, true);
  }));
};

exports.down = function(knex) {
  return knex.schema.alterTable(USERS_TABLE, builder => {
    builder.dropTimestamps();
  }).then(() => knex.schema.alterTable(USERS_TABLE, builder => {
    builder.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  }));
};
