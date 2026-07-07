const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});


const listingcontroller = require("../controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(
        isLoggedIn ,
        upload.single("listing[image]") , 
        validateListing ,
        wrapAsync (listingcontroller.createListing)
    );
  



//new route
router.get("/new",isLoggedIn, listingcontroller.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingcontroller.showListing))
    .put(
        isLoggedIn ,
        isOwner, 
        upload.single("listing[image]"),
        validateListing ,
        wrapAsync(listingcontroller.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.destroyListing));




//Edit route
router.get("/:id/edit" ,isLoggedIn , isOwner,wrapAsync(listingcontroller.renderEditForm));

module.exports = router;



             
