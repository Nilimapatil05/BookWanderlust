const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    // type: String,
    // default:
    //   "https://cdn.mos.cms.futurecdn.net/wtqqnkYDYi2ifsWZVW2MT4-970-80.jpg.webp",
    // set: (v) =>
    //   v === ""
    //     ? "https://cdn.mos.cms.futurecdn.net/wtqqnkYDYi2ifsWZVW2MT4-970-80.jpg.webp"
    //     : v,

    url: String,
    filename: String,
  },

  // image: {
  //   filename: {
  //     type: String,
  //     // required: true,
  //   },
  //   url: {
  //     default:
  //       "https://media.istockphoto.com/id/1740583164/photo/ocean-sunrise-over-the-tropical-sea-shore-and-exotic-island-beach.jpg?s=2048x2048&w=is&k=20&c=EBoe-CihpDC5LDyBcQYvC5EY_hjNOGikFgSslv7OCDs=",
  //     type: String,
  //     // required: true,
  //   },
  // },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      // required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
