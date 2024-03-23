import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    regularPrice: {
      type: Number,
      required: [true, "Regular price is required"],
    },
    discountPrice: {
      type: Number,
      required: [true, "Discount price is required"],
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    sell: {
      type: Boolean,
      default: false,
    },
    rent: {
      type: Boolean,
      default: true,
    },
    offer: {
      type: Boolean,
      default: false,
    },
    imageUrls: {
      type: Array,
      required: [true, "Atleast one image is required!"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);
