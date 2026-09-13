const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");


module.exports.renderNewForm = async(req,res) => {
    const listing  = await Listing.findById(req.params.id);
    res.render('bookings/new.ejs',{listing});
};


module.exports.createBooking = async(req,res) =>{
    const{id} = req.params;
    const{checkIn,checkOut} = req.body.booking;

    const listing = await Listing.findById(id);
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));


    if(nights <= 0){
        req.flash('error','Check-out must be after Check-in.');
        return res.redirect(`/listings/${id}/book`);
    }


    const totalPrice = nights * listing.price;

    const newBooking = new Booking({
        listing : id,
        user : req.user._id,
        checkIn,
        checkOut,
        totalPrice,
        status : 'pending',
    });


    await newBooking.save();
    req.flash('success', `Booking created — ${nights} night(s), total ₹${totalPrice.toLocaleString('en-IN')}.`);
    res.redirect(`/listings/${id}`);
}

