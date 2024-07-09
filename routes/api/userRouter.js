const express = require('express');

const {
    createUser,
    logInUser,
} = require('../../controllers/api/userController');

const router = express.Router();

// POST localhost:3000/api/user/createUser
router.post('/createUser', createUser);
router.post('/logInUser', logInUser);


module.exports = router;