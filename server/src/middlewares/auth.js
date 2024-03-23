import { ApiError } from "../utils/error.js";
import asyncHandler from "../utils/async.js";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new ApiError(404, "Unauthorized token!");
  }
  const user = await jwt.verify(token, process.env.JWT_SECRET);

  req.user = user;
  next();
});

export default auth;
