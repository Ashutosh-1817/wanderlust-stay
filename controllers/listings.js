const Listing = require("../models/listing")

const axios = require("axios");

async function geocodeLocation(locationString) {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        locationString
    )}&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    try {
        const response = await axios.get(url);
        const features = response.data.features;

        if (!features || features.length === 0) {
            return { type: "Point", coordinates: [0, 0] };
        }

        const [lng, lat] = features[0].geometry.coordinates;
        return { type: "Point", coordinates: [lng, lat] };
    } catch (err) {
        console.log("Geocoding failed:", err.message);
        return { type: "Point", coordinates: [0, 0] };
    }
}


module.exports.index = async(req,res) => {
    let filter = {};

    // Category filter (exact match, since category is a closed enum)
    if (req.query.category) {
        filter.category = req.query.category;
    }

    // Search filter (partial, case-insensitive match on title or location)
    if (req.query.search) {
        filter.$or = [
            { title: { $regex: req.query.search, $options: "i" } },
            { location: { $regex: req.query.search, $options: "i" } },
            {country: { $regex: req.query.search, $options: "i" } },
        ];
    }

    const allListings = await Listing.find(filter);

    const mapListings = allListings
        .filter(l => l.geometry && l.geometry.coordinates && (l.geometry.coordinates[0] !== 0 || l.geometry.coordinates[1] !== 0))
        .map(l => ({
            id: l._id,
            title: l.title,
            price: l.price,
            coordinates: l.geometry.coordinates,
    }));

    res.render("listings/index.ejs", {
        allListings,
        mapListings,
        currentCategory: req.query.category || null,
        currentSearch: req.query.search || "",
    });
}

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested was not found!");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next) =>{
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};

        
        const locationString = `${req.body.listing.location}, ${req.body.listing.country}`;
        newListing.geometry = await geocodeLocation(locationString);
        

        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");   
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested was not found!");
        return res.redirect("/listings");
    }

    let originalImageUrl =  listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    // 👇 ADDED: re-geocode since location/country may have changed
    const locationString = `${req.body.listing.location}, ${req.body.listing.country}`;
    listing.geometry = await geocodeLocation(locationString);
    // 👆 END ADDED

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
    }
    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};