import pkg from 'express';
const { Router } = pkg;
import { forgout, login, store } from './app/controller/authController.js';
import { index } from './app/controller/projectController.js';
import  authMidleware  from './app/midleware/auth.js';


const router = Router();

router.post('/auth/register', store);
router.post('/auth/authenticate', login);
router.post('/auth/forgout_password', forgout);

router.use(authMidleware).get('/project', index);

export default router;