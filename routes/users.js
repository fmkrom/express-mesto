const router = require('express').Router();
const { createUser, getUsers, getUserById, updateUserProfile } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.post('/', createUser);
router.patch('/me', updateUserProfile);

module.exports = router; 