
const { response } = require('express');
const express = require('express');
const router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const adminAuth = ((req, res,next) => {
  if (req.session.adminLoggedIn) {
    next();
  }
  else {
    res.render('admin/adminLogin', { loginErr: req.session.loginErr, errMessage: req.session.errMessage });
    req.session.loginErr = false;
  }
})


const adminName = "admin@gmail.com";
const adminPW = 'a';

/* GET home page. */
router.get('/',adminAuth, function (req, res, next) {
    res.redirect('/admin/adminHome');
});

router.post('/adminLogin', (req, res) => {
  if (req.body.userEmail === '' && req.body.userPassword === '') {
    req.session.loginErr = true;
    req.session.errMessage = 'Please enter the required fields';
    res.redirect('/admin');
  } else {
    if (req.body.userEmail === '') {
      req.session.loginErr = true;
      req.session.errMessage = 'Please enter the email';
      res.redirect('/admin');
    }
    else {
      if (req.body.userPassword === '') {
        req.session.loginErr = true;
        req.session.errMessage = 'Please enter the password';
        res.redirect('/admin');
      } else {
        if (req.body.userEmail === adminName && req.body.userPassword === adminPW) {
          req.session.adminLoggedIn = true;
          req.session.admin = req.body;
          res.redirect('/admin/adminHome');
        }
        else {
          req.session.loginErr = true;
          req.session.errMessage = 'Invalid admin name or password';
          res.redirect('/admin');
        }
      }
    }
  }
})

router.get('/adminHome',adminAuth, function (req, res, next) {
  userHelpers.getAllUsers().then((users) => {
    res.render('admin/view-users', { admin: true, users });
  });
});



router.get('/add-user', adminAuth, (req, res) => {
  res.render('admin/add-user', { admin: true });
});


router.post('/add-user',adminAuth, (req, res) => {

  userHelpers.doSignup(req.body).then(() => {
    res.redirect('/admin');
  })
});

router.get('/editUser/:id',adminAuth, (req, res, next) => {
  let userId = req.params.id;
  userHelpers.getUserDetails(userId).then((users) => {
    res.render('admin/edit-user', { users });
  }).catch((err) => {
    next(err)
  })
})

router.post('/edit-user/:id', (req, res) => {
  let user = req.body;
  user._id = req.params.id;
  userHelpers.editUser(user).then((response) => {
    console.log(response);
    res.redirect('/admin');
  })
})

router.get('/deleteUser/:id',adminAuth, (req, res) => {
  let userId = req.params.id;
  userHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin');
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin');
})

module.exports = router;
