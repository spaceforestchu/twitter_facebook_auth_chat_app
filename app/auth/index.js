'use strict';
const passport = require('passport');
const config = require('../config');
const helper = require('../helpers/helpers');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    helper.findById(id)
      .then( user => done(null, user))
      .catch(error => console.log('Error when deserializing the user'));
  });


  let authProcessor = (accessToken, refreshToken, profile, done) => {
    helper.findOne(profile.id)
      .then(result => {
        if(result){
          done(null, result);
        } else {
          helper.createNewUser(profile)
            .then(newChatUser => done(null, newChatUser))
            .catch(error => console.log('Erro when creating new user'))
        }
      });
  }

  passport.use(new FacebookStrategy(config.fb, authProcessor));
  passport.use(new TwitterStrategy(config.twitter, authProcessor));
}
