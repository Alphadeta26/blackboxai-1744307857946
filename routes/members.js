const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');

router.get('/', membersController.getAllMembers);
router.get('/:id', membersController.getMemberById);
router.post('/', membersController.addMember);
router.put('/:id', membersController.updateMember);
router.delete('/:id', membersController.deleteMember);

module.exports = router;
