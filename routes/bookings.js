const express = require('express');
const router = express.Router({mergeParams: true});
const bookingController = require('../controllers/bookings.js');
const {isLoggedIn,isBookingOwner} = require('../middleware.js');

router.route('/listings/:id/book')
    .get(isLoggedIn,bookingController.renderNewForm)
    .post(isLoggedIn,bookingController.createBooking);

router.get('/bookings',isLoggedIn,bookingController.myBookings);

router.post('/bookings/:bookingId/cancel', isLoggedIn, isBookingOwner, bookingController.cancelBooking);
module.exports = router;