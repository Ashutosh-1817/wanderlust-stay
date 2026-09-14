const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");


module.exports.renderNewForm = async(req,res) => {
    const listing  = await Listing.findById(req.params.id);
    res.render('bookings/new.ejs',{listing});
};


async function hasConflict(listingId,checkIn,checkOut){
    const conflictingBooking = await Booking.findOne({
        listing: listingId,
        status: {$ne: 'cancelled'},
        checkIn: {$lt: checkOut},
        checkOut: {$gt: checkIn},
    });
    return conflictingBooking !== null;
}

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body.booking;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(checkIn) < today) {
        req.flash('error', 'Check-in date cannot be in the past.');
        return req.session.save(() => res.redirect(`/listings/${id}/book`));
    }

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
        req.flash('error', 'Check-out must be after Check-in.');
        return req.session.save(() => res.redirect(`/listings/${id}/book`));
    }

    const conflict = await hasConflict(id, new Date(checkIn), new Date(checkOut));
    if (conflict) {
        req.flash('error', 'These dates are already booked. Please choose different dates.');
        return req.session.save(() => res.redirect(`/listings/${id}/book`));
    }

    const listing = await Listing.findById(id);
    const totalPrice = nights * listing.price;

    const newBooking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn,
        checkOut,
        totalPrice,
        status: 'pending',
    });

    await newBooking.save();
    req.flash('success', `Booking created — ${nights} night(s), total ₹${totalPrice.toLocaleString('en-IN')}.`);
    req.session.save(() => res.redirect('/bookings'));
};


module.exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.bookingId);
    booking.status = 'cancelled';
    await booking.save();
    req.flash('success', 'Booking cancelled.');
    req.session.save(() => res.redirect('/bookings')); // using the session.save() fix, same reasoning as before
};

module.exports.myBookings = async(req,res) =>{
    const bookings = await Booking.find({user: req.user._id})
    .populate('listing')
    .sort({createdAt: -1});

    res.render('bookings/index.ejs',{bookings});
};
