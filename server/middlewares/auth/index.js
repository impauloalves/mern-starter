const jwt = require('jsonwebtoken');
const UserModel = require('../../models/user');
const Role = require('../../models/role');
const { ADMIN } = require('../../utils/roles');

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) return res.status(403).send({ message: 'No token provided!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Unauthorized!' });
        req.userId = decoded.id;
        return next();
    });
};

isAdmin = (req, res, next) => {
    UserModel.findById(req.userId).exec((err, user) => {
        if (err) return res.status(500).send({ message: err });

        Role.find({ _id: { $in: user.roles } }, (err, roles) => {
            if (err) return res.status(500).send({ message: err });

            const isAdmin = roles.some((r) => r.name === ADMIN);
            if (isAdmin) return next();

            return res.status(403).send({ message: 'Require Admin Role!' });
        });
    });
};

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    UserModel.findOne({
        username: req.body.username,
    }).exec((err, user) => {
        if (err) return res.status(500).send({ message: err });
        if (user) {
            return res.status(400).send({
                message: 'Failed! Username is already in use!',
            });
        }

        // Email
        UserModel.findOne({
            email: req.body.email,
        }).exec((err, user) => {
            if (err) return res.status(500).send({ message: err });
            if (user) {
                return res.status(400).send({
                    message: 'Failed! Email is already in use!',
                });
            }

            return next();
        });
    });
};

module.exports = {
    verifyToken,
    isAdmin,
    checkDuplicateUsernameOrEmail,
};
