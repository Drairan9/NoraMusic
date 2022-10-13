import express from 'express';
import { isAuthenticated } from '#Utils/Middlewares.js';
import * as GuildController from '#Controllers/GuildController.js';

var router = express.Router();

router.get('/', isAuthenticated, GuildController.mainController);

export default router;
