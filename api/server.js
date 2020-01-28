const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session); // pass it the session

const dbConnection = require('../database/dbConfig');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: 'cookieMonster',
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!', // used for cookie encryption
  cookie: {
    maxAge: 1000 * 60 * 10, // 10 mins in ms
    secure: false, // set to true in production
    httpOnly: true // js can not access cookies on browser
  },
  resave: false,
  saveUninitialized: true, // read about for GDBR compliance
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 60000
  })
};

server.use(helmet());
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
