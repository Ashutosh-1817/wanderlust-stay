const Listing = require("./models/listing");
const Review = require("./models/review");   
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} =require("./schema.js")
const Booking = require('./models/booking.js');


module.exports.isLoggedIn = (req,res,next) =>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" ," you must be signed in to create a listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not authorized to edit this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
      let {error} = listingSchema.validate(req.body);
        // console.log(result);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,error);
        }else {
            next();
        }
};

module.exports.validateReview = (req,res,next) => {
      let {error} = reviewSchema.validate(req.body);
        // console.log(result);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,error);
        }else {
            next();
        }
};


module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not authorized to edit this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isBookingOwner = async (req, res, next) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        req.flash('error', 'Booking not found');
        return res.redirect('/bookings');
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect('/bookings');
    }
    next();
};


  // module.exports.isReviwerAuthor =  async(req , res , next) =>{
        //let { id , reviewId} = req.params;
        //  let review = await Review.findById(reviewId);
        //if(!review.author.equals(Res.local.currUser._id)){
            //req.flash(""error" , "You are not th author of this review !!");
            //return res.redirect(`/listings/${id}`);
        //}
        //next();
    //}