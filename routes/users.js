const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usercontroller = require("../controllers/userscontrol.js");


router
    .route("/signup")   
    .get(usercontroller.renderSignupForm)
    .post(wrapAsync(usercontroller.signUp));

  
router
    .route("/login")
    .get(usercontroller.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local" , {failureRedirect : "/login" , failureFlash: true}) , usercontroller.login);


router.get("/logout" , usercontroller.logout);

module.exports  = router;






















//passport.authenticate is a middleware that is used to authenticate
// // the user using the strategy defined in passport.use() method
// . It takes the strategy name as the first argument and an options 
// object as the second argument. The options object can have a 
// successRedirect property that specifies the URL to redirect to
//  on successful authentication, and a failureRedirect property that
//  specifies the URL to redirect to on failed authentication.