const mongoose = require('mongoose');
const RoleModel = require('./models/role');
const { USER, ADMIN } = require('./utils/roles');

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;
exports.connect = () => {
    mongoose.connection.on('connected', () => {
        console.log('Connected to mongodb database');
        initial();
    });

    mongoose.connection.on('error', (err) => {
        console.error(`An error occurred with mongodb database ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.error('Disconnected from mongodb database');
    });

    return mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
};

function initial() {
    RoleModel.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new RoleModel({
                name: USER,
            }).save((err) => {
                if (err) console.log('error', err);
                console.log("Added 'user' to roles collection");
            });

            new RoleModel({
                name: ADMIN,
            }).save((err) => {
                if (err) console.log('error', err);
                console.log("Added 'admin' to roles collection");
            });
        }
    });
}
