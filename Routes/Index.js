import express from 'express';
import { isAuthenticated } from '#Utils/Middlewares.js';
import { getUserAvatarUrlService } from '#Services/UserService.js';
import User from '#Models/UserModel.js';

var router = express.Router();

/* GET home page. */
router.get('/', isAuthenticated, (req, res) => {
    res.send('Games / others');
});

router.get('/userinfo', isAuthenticated, async (req, res) => {
    res.send(req.user);
});

router.get('/cleardb', isAuthenticated, (req, res) => {
    try {
        User.clearDb();
        res.send('cleared db');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

export default router;
