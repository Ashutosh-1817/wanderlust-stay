const express = require('express');
const router = express.Router({mergeParams: true});
const bookingController = require('../controllers/bookings.js');
const {isLoggedIn} = require('../middleware.js');

router.route('/listings/:id/book')
    .get(isLoggedIn,bookingController.renderNewForm)
    .post(isLoggedIn,bookingController.createBooking);

module.exports = router;