require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || "system",
  password: process.env.DB_PASSWORD || "oracle",
  connectString: process.env.DB_CONNECT_STRING || "localhost:1521/XE",
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0
};

module.exports = {
  dbConfig,
  port: process.env.PORT || 8000
};
