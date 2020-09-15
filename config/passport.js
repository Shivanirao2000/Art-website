const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
// passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(error) {
        done(error, null);
    }
});

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
}, async (email, password, done) => {
    try {
        // 1) Check if the email already exists
        const user = await User.findOne({ 'email': email });
        if (!user) {
            return done(null, false, { message: 'Unknown User' });
        }

        //2) Check if the password is correct
        // const isValid = User.comparePasswords(password, user.password);
        const isValid = user.password == password;
        
        if (!isValid) {
            return done(null, false, { message: 'Unknown Password' });
        }

        // if (!User.authenticate(password)) {
        //     return done(null, false, {
        //         message: 'Invalid Password'
        //     });
        // }

        // 3) Check if email has been verified
        if (!user.active) {
            return done(null, false, { message: 'Sorry, you must verify email first' });
        }

        return done(null, user);
    } catch(error) {
        return done(error, false);
    }
}));