const oracledb = require('oracledb');
const logger = require('../utils/logger');

const authController = {
  login: async (req, res, next) => {
    const { username, password } = req.body;
    
    try {
      // Get connection from pool
      const connection = await oracledb.getConnection();
      
      try {
        // Query to check user credentials
        const result = await connection.execute(
          `SELECT * FROM LIBRARY_USERS 
           WHERE USERNAME = :username 
           AND PASSWORD = :password`,
          [username, password],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
          logger.info(`User ${username} logged in successfully`);
          res.json({
            status: 'success',
            message: 'Login successful',
            user: {
              id: result.rows[0].ID,
              username: result.rows[0].USERNAME,
              role: result.rows[0].ROLE
            }
          });
        } else {
          logger.warn(`Failed login attempt for user ${username}`);
          res.status(401).json({
            status: 'error',
            message: 'Invalid username or password'
          });
        }
      } finally {
        // Release connection back to the pool
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            logger.error('Error closing connection:', err);
          }
        }
      }
    } catch (err) {
      logger.error('Database error during login:', err);
      next(err);
    }
  },

  logout: async (req, res) => {
    try {
      // In a real application, you might want to invalidate tokens or clear sessions
      res.json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (err) {
      logger.error('Error during logout:', err);
      next(err);
    }
  }
};

module.exports = authController;
