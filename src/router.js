import pkg from 'express';
const { Router } = pkg;
import { store } from './controller/authController.js';

const router = Router();

router.post('/auth/register', store);

export default router;