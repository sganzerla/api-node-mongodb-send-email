import pkg from 'express';
const { Router } = pkg;
import { login, store } from './controller/authController.js';

const router = Router();

router.post('/auth/register', store);
router.post('/auth/authenticate', login );

export default router;