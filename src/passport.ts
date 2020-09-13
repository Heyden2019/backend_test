import * as PassportStrategy from "passport-local"
import argon2 from "argon2"
import User from "./models/User"
import passport from "passport"

const localStrategy = PassportStrategy.Strategy 

export default (passport: passport.PassportStatic) => {
    passport.use(
        new localStrategy({usernameField: "email"}, (email, password, done) => {
            User.findOne({email})
            .then(async (user: any) => {
                if (!user) {
                    return done (null, false, { message: 'That email is not registered' })
                }
                const valid = await argon2.verify(user.password, password)
                if (!valid) {
                    return done(null, false, {message: "Password incorrect"})
                } else {
                    return done(null, user)
                }
            })
        })
    )

    passport.serializeUser(function(user: any, done) {
        done(null, user.id);
      });
    
    passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
    });
}
