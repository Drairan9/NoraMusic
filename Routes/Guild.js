import express from 'express';
import { isAuthenticated } from '#Utils/Middlewares.js';
import * as GuildController from '#Controllers/GuildController.js';

var router = express.Router();

router.get('/', isAuthenticated, GuildController.mainController);

router.get('/:serverid', isAuthenticated, (req, res) => {
    res.send(`Guild ${req.params.serverid}`);
});

export default router;
