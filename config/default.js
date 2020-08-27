const DEFAULT_POSTGRES = 'postgresql://postgres:1234@localhost:5432/docs-bot';

module.exports = {
  postgresql: String(process.env.POSTGRESQL || DEFAULT_POSTGRES),
};
