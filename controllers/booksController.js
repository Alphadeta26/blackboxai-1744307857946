const oracledb = require('oracledb');
const logger = require('../utils/logger');

const booksController = {
  getAllBooks: async (req, res, next) => {
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `SELECT * FROM BOOKS ORDER BY TITLE`,
          [],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        res.json({
          status: 'success',
          data: result.rows
        });
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            logger.error('Error closing connection:', err);
          }
        }
      }
    } catch (err) {
      logger.error('Error fetching books:', err);
      next(err);
    }
  },

  getBookById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `SELECT * FROM BOOKS WHERE ID = :id`,
          [id],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
          res.json({
            status: 'success',
            data: result.rows[0]
          });
        } else {
          res.status(404).json({
            status: 'error',
            message: 'Book not found'
          });
        }
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            logger.error('Error closing connection:', err);
          }
        }
      }
    } catch (err) {
      logger.error('Error fetching book:', err);
      next(err);
    }
  },

  addBook: async (req, res, next) => {
    const { title, author, isbn, quantity, category } = req.body;
    
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `INSERT INTO BOOKS (TITLE, AUTHOR, ISBN, QUANTITY, CATEGORY) 
           VALUES (:title, :author, :isbn, :quantity, :category)
           RETURNING ID INTO :id`,
          {
            title,
            author,
            isbn,
            quantity,
            category,
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          },
          { autoCommit: true }
        );

        res.status(201).json({
          status: 'success',
          message: 'Book added successfully',
          data: {
            id: result.outBinds.id[0],
            title,
            author,
            isbn,
            quantity,
            category
          }
        });
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            logger.error('Error closing connection:', err);
          }
        }
      }
    } catch (err) {
      logger.error('Error adding book:', err);
      next(err);
    }
  },

  updateBook: async (req, res, next) => {
    const { id } = req.params;
    const { title, author, isbn, quantity, category } = req.body;
    
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `UPDATE BOOKS 
           SET TITLE = :title, 
               AUTHOR = :author, 
               ISBN = :isbn, 
               QUANTITY = :quantity, 
               CATEGORY = :category 
           WHERE ID = :id`,
          {
            title,
            author,
            isbn,
            quantity,
            category,
            id
          },
          { autoCommit: true }
        );

        if (result.rowsAffected > 0) {
          res.json({
            status: 'success',
            message: 'Book updated successfully'
          });
        } else {
          res.status(404).json({
            status: 'error',
            message: 'Book not found'
          });
        }
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            logger.error('Error closing connection:', err);
          }
        }
      }
    } catch (err) {
      logger.error('Error updating book:', err);
      next(err);
    }
  },

  deleteBook: async (req, res, next) => {
    const { id } = req.params;
    
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `DELETE FROM BOOKS WHERE ID = :id`,
          [id],
          { autoCommit: true }
        );

        if (result.rowsAffected > 0) {
          res.json({
            status: 'success',
            message: 'Book deleted successfully'
          });
        } else {
          res.status(404).json({
            status: 'error',
            message: 'Book not found'
          });
        }
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            logger.error('Error closing connection:', err);
          }
        }
      }
    } catch (err) {
      logger.error('Error deleting book:', err);
      next(err);
    }
  }
};

module.exports = booksController;
