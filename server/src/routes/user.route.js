import exress from "express";
import {
  register,
  login,
  google,
  updateUser,
  deleteUser,
  signoutUser,
  getUser,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

const router = exress.Router();

router.route("/signup").post(register);
router.route("/signin").post(login);
router.route("/google").post(google);
router.route("/user/:id").patch(auth, updateUser).delete(auth, deleteUser);
router.route("/user/signout").get(signoutUser);
router.route("/get/:id").get(auth, getUser);

export default router;
