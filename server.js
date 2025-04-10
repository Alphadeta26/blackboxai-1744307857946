const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const path = require('path');
const { dbConfig, port } = require('./config');
const errorHandler = require('./errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Initialize Oracle connection pool
async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
    logger.info('Connected to Oracle Database');
  } catch (err) {
    logger.error('Failed to create connection pool:', err);
    process.exit(1);
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/members', require('./routes/members'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Error handling
app.use(errorHandler);

// Start server
initialize().then(() => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
});
