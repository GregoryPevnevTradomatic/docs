const config = require('config'); // eslint-disable-line

module.exports = {
  client: 'postgresql',
  connection: config.get('postgresqlConnectionString'),
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
