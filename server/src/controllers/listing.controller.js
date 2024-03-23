import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";
import { Listing } from "../models/listing.model.js";

const createListing = asyncHandler(async (req, res) => {
  req.body.owner = req.user.id;
  const listing = await Listing.create(req.body);
  res.status(201).json(listing);
});

const getUserListing = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    throw new ApiError(401, "Unauthorized user");
  }
  const listing = await Listing.find({ owner: req.params.id });
  res.status(200).json(listing);
});

const deleteUserListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  if (req.user.id !== listing.owner.toString()) {
    throw new ApiError(401, "Not authenticated");
  }

  await Listing.findByIdAndDelete(req.params.id);
  res.status(200).json("List deleted successfully");
});

const updateUserListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  if (req.user.id !== listing.owner.toString()) {
    throw new ApiError(401, "Not authenticated");
  }

  const list = await Listing.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...req.body,
      },
    },
    { new: true }
  );
  res.status(200).json(list);
});

const getSingleList = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  const list = await Listing.findById(req.params.id);
  res.status(200).json(list);
});

const getListing = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;

  let parking = req.query.parking;
  if (parking === undefined || parking === false) {
    parking = { $in: [false, true] };
  }

  let furnished = req.query.furnished;
  if (furnished === undefined || furnished === false) {
    furnished = { $in: [true, false] };
  }

  let offer = req.query.offer;
  if (offer === undefined || offer === false) {
    offer = { $in: [true, false] };
  }

  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  const listing = await Listing.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  return res.status(200).json(listing);
});

export {
  createListing,
  getUserListing,
  deleteUserListing,
  updateUserListing,
  getSingleList,
  getListing,
};
