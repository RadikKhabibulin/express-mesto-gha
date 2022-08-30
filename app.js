const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const { USER_ID = '630c7d590dea6ffda226d84c' } = process.env;
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const pageNotFoundRouter = require('./routes/pageNotFound');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: USER_ID,
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/', pageNotFoundRouter);

app.listen(PORT, () => {});
