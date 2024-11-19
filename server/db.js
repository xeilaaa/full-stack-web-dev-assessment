const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "0615221121",
  host: "localhost",
  port: 5432,
  database: "apptodo"
});

module.exports = pool;