import express from "express";
import {
  createListing,
  getUserListing,
  updateUserListing,
  deleteUserListing,
  getSingleList,
  getListing,
} from "../controllers/listing.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(auth, createListing).get(getListing);
router
  .route("/:id")
  .get(auth, getUserListing)
  .delete(auth, deleteUserListing)
  .patch(auth, updateUserListing);
router.route("/list/:id").get(getSingleList);

export default router;
