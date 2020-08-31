"use strict";

var _require = require('./utils/constants'),
    USERS_TABLE = _require.USERS_TABLE; // eslint-disable-line


exports.up = function (knex) {
  return knex.schema.alterTable(USERS_TABLE, function (builder) {
    builder.dropColumn('created_at');
  }).then(function () {
    return knex.schema.alterTable(USERS_TABLE, function (builder) {
      builder.timestamps(true, true);
    });
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(USERS_TABLE, function (builder) {
    builder.dropTimestamps();
  }).then(function () {
    return knex.schema.alterTable(USERS_TABLE, function (builder) {
      builder.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
  });
};