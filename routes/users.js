const express = require('express');
const router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const userAuth = ((req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.render('users/login', { loginErr: req.session.loginErr, errMessage: req.session.errMessage });
    req.session.loginErr = false;
  }
})

/* GET users listing. */
router.get('/', userAuth, function (req, res, next) {
  res.redirect('/home');
});

router.get('/signup', (req, res) => {
  res.render('users/signup')
});


router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then(() => {
    res.redirect('/');
  })
});

router.post('/login', (req, res) => {

  if (req.body.userEmail === '' && req.body.userPassword === '') {
    req.session.loginErr = true;
    req.session.errMessage = 'Please enter the required fields';
    res.redirect('/');
  }
  else {
    if (req.body.userEmail === '') {
      req.session.loginErr = true;
      req.session.errMessage = 'Please enter the username';
      res.redirect('/');
    }
    else {
      if (req.body.userPassword === '') {
        req.session.loginaddUser(req.body, () => {
          res.redirect('/admin');
        });
      }
      else {
        userHelpers.doLogin(req.body).then((response) => {
          if (response.status) {
            req.session.loggedIn = true;
            req.session.user = response.user;
            res.redirect('/home');
          } else {
            req.session.loginErr = true;
            req.session.errMessage = "Invalid username or password";
            res.redirect('/');
          }
        });
      }
    }
  }
});


router.get('/home', userAuth, (req, res) => {
  let user = req.session.user;
  productHelpers.getAllProducts().then((products) => {
    res.render('users/userHomePage', { products, user });
  })
});


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
