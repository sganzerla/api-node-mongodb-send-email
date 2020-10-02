const { Router }  = require('express');

const AuthController = require('./controller/authController');

const router = Router();

router.post('/auth/register', AuthController.store);

module.exports = router;