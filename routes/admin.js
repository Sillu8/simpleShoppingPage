
const express = require('express');
const router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const adminHelpers = require('../helpers/admin-helpers');
const adminAuth = ((req, res,next) => {
  if (req.session.adminLoggedIn) {
    next();
  }
  else {
    res.render('admin/adminLogin', { loginErr: req.session.loginErr, errMessage: req.session.errMessage });
    req.session.loginErr = false;
  }
})


/* GET home page. */
router.get('/',adminAuth, function (req, res, next) {
    res.redirect('/admin/adminHome');
});

router.post('/adminLogin', (req, res) => {
  adminHelpers.doAdminLogin(req.body).then((result)=>{
      if(result.status){
        req.session.adminLoggedIn = true;
        res.redirect('/admin/adminHome');
      }
      else{
        console.log("admin login failed ")
        req.session.loginErr = true;
        req.session.errMessage = 'Invalid admin email or password!';
        res.redirect('/admin');
      }  
    })
})

router.get('/adminHome',adminAuth, function (req, res, next) {
  userHelpers.getAllUsers().then((users) => {
    res.render('admin/view-users', { admin: true, users });
  });
});



router.get('/add-user', adminAuth, (req, res) => {
  res.render('admin/add-user', { admin: true, userExists: req.session.userExists, userExistsMsg: req.session.userExistsMsg});
  req.session.userExists = false;
});


router.post('/add-user',adminAuth, (req, res) => {

  userHelpers.doSignup(req.body).then(() => {
    res.redirect('/admin');
  }).catch(()=>{
    req.session.userExists = true;
    req.session.userExistsMsg = 'User already exists. Please choose a different email.'
    res.redirect('/admin/add-user');
  })
});

router.get('/editUser/:id', (req, res, next) => {
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
  userHelpers.editUser(user).then(() => {
    res.redirect('/admin');
  })
})

router.get('/deleteUser/:id', (req, res) => {
  let userId = req.params.id;
  userHelpers.deleteUser(userId).then(() => {
    res.redirect('/admin');
  })
})

router.get('/logout', (req, res) => {
  req.session.admin = null;
  req.session.adminLoggedIn = false;
  res.redirect('/admin');
})

module.exports = router;
