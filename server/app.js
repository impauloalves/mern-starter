require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser(process.env.JWT_SECRET));

// routes
require('./api/auth')(app);
require('./api/posts')(app);

const PORT = process.env.PORT || 3000;
db.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    })
    .catch(() => {
        console.error('Server did not start due database connection');
    });
