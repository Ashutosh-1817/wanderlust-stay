const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review  = require("../models/review.js");
const {validateReview , isLoggedIn ,isReviewAuthor} = require("../middleware.js");
 
const reviewcontroller = require("../controllers/reviewcontrol.js");
const review = require("../models/review.js");





//Reviews Route

router.post("/" , isLoggedIn, validateReview ,wrapAsync (reviewcontroller.createReview));

//Delete review Route
router.delete("/:reviewId" ,isLoggedIn, isReviewAuthor, wrapAsync(reviewcontroller.destroyReview));


module.exports = router;