const oracledb = require('oracledb');
const logger = require('../utils/logger');

const membersController = {
  getAllMembers: async (req, res, next) => {
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `SELECT * FROM LIBRARY_MEMBERS ORDER BY LAST_NAME`,
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
      logger.error('Error fetching members:', err);
      next(err);
    }
  },

  getMemberById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `SELECT * FROM LIBRARY_MEMBERS WHERE ID = :id`,
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
            message: 'Member not found'
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
      logger.error('Error fetching member:', err);
      next(err);
    }
  },

  addMember: async (req, res, next) => {
    const { firstName, lastName, email, phone, address } = req.body;
    
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `INSERT INTO LIBRARY_MEMBERS 
           (FIRST_NAME, LAST_NAME, EMAIL, PHONE, ADDRESS, JOIN_DATE) 
           VALUES 
           (:firstName, :lastName, :email, :phone, :address, CURRENT_DATE)
           RETURNING ID INTO :id`,
          {
            firstName,
            lastName,
            email,
            phone,
            address,
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          },
          { autoCommit: true }
        );

        res.status(201).json({
          status: 'success',
          message: 'Member added successfully',
          data: {
            id: result.outBinds.id[0],
            firstName,
            lastName,
            email,
            phone,
            address
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
      logger.error('Error adding member:', err);
      next(err);
    }
  },

  updateMember: async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address } = req.body;
    
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `UPDATE LIBRARY_MEMBERS 
           SET FIRST_NAME = :firstName,
               LAST_NAME = :lastName,
               EMAIL = :email,
               PHONE = :phone,
               ADDRESS = :address
           WHERE ID = :id`,
          {
            firstName,
            lastName,
            email,
            phone,
            address,
            id
          },
          { autoCommit: true }
        );

        if (result.rowsAffected > 0) {
          res.json({
            status: 'success',
            message: 'Member updated successfully'
          });
        } else {
          res.status(404).json({
            status: 'error',
            message: 'Member not found'
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
      logger.error('Error updating member:', err);
      next(err);
    }
  },

  deleteMember: async (req, res, next) => {
    const { id } = req.params;
    
    try {
      const connection = await oracledb.getConnection();
      try {
        const result = await connection.execute(
          `DELETE FROM LIBRARY_MEMBERS WHERE ID = :id`,
          [id],
          { autoCommit: true }
        );

        if (result.rowsAffected > 0) {
          res.json({
            status: 'success',
            message: 'Member deleted successfully'
          });
        } else {
          res.status(404).json({
            status: 'error',
            message: 'Member not found'
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
      logger.error('Error deleting member:', err);
      next(err);
    }
  }
};

module.exports = membersController;
