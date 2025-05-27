const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongodb = require('./db/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');


const port = process.env.PORT || 3000;

app
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use(bodyParser.json())
    .use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 14 * 24 * 60 * 60 // 14 days
        })
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'); 
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE', 'PATCH']}))
    .use(cors({ origin: '*'}))
    .use('/', require('./routes/index'));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ githubId: profile.id });
  if (existingUser) return done(null, existingUser);
  const user = await User.create({ githubId: profile.id, name: profile.displayName });
  done(null, user);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

app.get('/', (req,res) => {res.send(req.session.user !== undefined ? `Logged in as {req.session.user.displayName}` : "Logged out")});

app.get('/github/callback', passport.authenticate('github', { 
    failureRedirect: '/api-docs', session: false}), (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });


mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port,() => {console.log(`Databse is listening and Node Running on port ${port}`)});
    }
});