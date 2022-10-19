import logger from '#Logger';

export async function index(req, res) {
    try {
        res.render('Index/Index');
    } catch (err) {
        logger.error(err);
        res.status(400).send('Error'); // TODO: Error page
    }
}
