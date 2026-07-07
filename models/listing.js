const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")


const ListingSchema = new  Schema({
    title : {
        type : String,
        required : true,
    },

    description : String,
    image : {
        filename :{
            type : String,
            default :"listingimage",
        },
        url : {
            type : String,
            default : "https://plus.unsplash.com/premium_photo-1770699606609-5c5136774d34?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set:(v) =>
                v === "" 
                ? "https://plus.unsplash.com/premium_photo-1770699606609-5c5136774d34?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v,
        },
    },
    price :  Number,
    location : String,
    country : String,
    
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
        },
    },
    
    category: {
        type: String,
        enum: [
            "trending", "rooms", "iconic cities", "mountains", "castles",
            "pools", "camping", "farms", "snow", "beach", "luxurious",
            "treehouses", "lakefront", "islands"
        ],
    },

    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

ListingSchema.post("findOneAndDelete" ,async(listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",ListingSchema);

module.exports = Listing;