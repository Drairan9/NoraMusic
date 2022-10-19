import express from 'express';
import { isAuthenticated } from '#Utils/Middlewares.js';
import * as IndexController from '#Controllers/IndexController.js';

let router = express.Router();

router.get('/', isAuthenticated, IndexController.index);

export default router;
