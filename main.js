require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const userRouter = require('./routes/routes');

const app = express();

const PORT = process.env.PORT || 8081;
mongoose.connect(process.env.DB_URI);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next();
})

// template engine

app.set('view engine', 'ejs');

app.use(userRouter);
app.use(express.static('images'))


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
