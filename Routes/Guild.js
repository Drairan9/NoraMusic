import express from 'express';
import { isAuthenticated, hasGuilds } from '#Utils/Middlewares.js';
import * as GuildController from '#Controllers/GuildController.js';

let router = express.Router();

router.get('/', isAuthenticated, GuildController.index);

router.get('/:serverid', isAuthenticated, hasGuilds, GuildController.dashboard);

export default router;
