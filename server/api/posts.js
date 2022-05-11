const { verifyToken, isAdmin } = require('../middlewares/auth');

module.exports = function (app) {
    app.get('/api/posts', [verifyToken], (req, res) => {
        return res.status(200).send('Get Post.');
    });

    app.post('/api/posts', [verifyToken, isAdmin], (req, res) => {
        return res.status(200).send('Added Post.');
    });

    app.delete('/api/posts/:postId', [verifyToken, isAdmin], (req, res) => {
        return res.status(200).send('Deleted Post.');
    });
};
