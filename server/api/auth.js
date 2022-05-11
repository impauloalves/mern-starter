const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const RoleModel = require('../models/role');
const UserModel = require('../models/user');
const { checkDuplicateUsernameOrEmail } = require('../middlewares/auth');

// just define your wanted config
const cookieConfig = {
    sameSite: true,
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 60000, // ttl in ms (remove this option and cookie will die when browser is closed)
    signed: true, // if you use the secret with cookieParser
};

module.exports = function (app) {
    app.post(
        '/api/auth/signup',
        [
            checkDuplicateUsernameOrEmail,
        ],
        (req, res) => {
            const user = new UserModel({
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
            });

            user.save((err, user) => {
                if (err) return res.status(500).send({ message: err });

                RoleModel.findOne({ name: 'user' }, (err, role) => {
                    if (err) return res.status(500).send({ message: err });

                    user.roles = [role._id];
                    user.save((err) => {
                        if (err) return res.status(500).send({ message: err });
                        return res.send({
                            message: 'User was registered successfully!',
                        });
                    });
                });
            });
        }
    );

    app.post('/api/auth/signin', (req, res) => {
        UserModel.findOne({
            username: req.body.username,
        })
            .populate('roles', '-__v')
            .exec((err, user) => {
                if (err) return res.status(500).send({ message: err });

                if (!user)
                    return res.status(404).send({ message: 'User Not found.' });

                const isPasswordValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: 'Invalid Password!',
                    });
                }

                const token = jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: 86400,
                    }
                );

                const authorities = [];

                for (let i = 0; i < user.roles.length; i++) {
                    authorities.push(
                        'ROLE_' + user.roles[i].name.toUpperCase()
                    );
                }
                res.cookie('jwt', token, cookieConfig);
                return res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                });
            });
    });
};
