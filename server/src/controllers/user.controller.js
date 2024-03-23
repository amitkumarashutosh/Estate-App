import { User } from "../models/user.model.js";
import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";

const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json({ message: "User created successfully!" });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "User does not exist!");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentials!");
  }

  const token = await user.createJWT();
  const { password: pass, ...rest } = user._doc;
  res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200)
    .json(rest);
});

const google = asyncHandler(async (req, res) => {
  const { username, email, avatar } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const token = await user.createJWT();
    const { password, ...rest } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } else {
    const generatePassword = Math.random().toString().slice(-8);

    const currentUser = await User.create({
      username,
      email,
      avatar,
      password: generatePassword,
    });
    const token = await currentUser.createJWT();
    const { password: pass, ...rest } = currentUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    throw new ApiError(401, "You can only update your own account!");
  }
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { ...req.body },
    },
    { new: true }
  );

  const { password: pass, ...rest } = user._doc;
  res.status(200).json(rest);
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    throw new ApiError(401, "You can only delete your own account!");
  }
  const user = await User.findByIdAndDelete(req.user.id);
  res.status(200).json("User deleted successfully");
});

const signoutUser = (req, res) => {
  res.clearCookie("access_token").status(200).json("User signout successfully");
};

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { password, ...rest } = user._doc;
  res.status(200).json(rest);
});

export {
  register,
  login,
  google,
  updateUser,
  deleteUser,
  signoutUser,
  getUser,
};
