const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/userModel')

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
const isValidPassword = async (password,userPassword) => await bcrypt.compare(password,userPassword)
passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
      const user = await User.findOne({ email })
      if (!user) {
          return done(null, false, { message: 'User not found' })
      }

      const validate = await isValidPassword(password,user.password)

      if (!validate) {
          return done(null, false, { message: 'Wrong password' })
      }

      return done(null, user, { message: 'Login successfull' })
  } catch (e) {
      return done(e)
  }
}))
