import express from "express";
import {
  callback,
  deployChanges,
  getRule,
  getUserInfo,
  login,
  logout,
  toggleRule,
} from "../controllers/salesforceController.js";

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/user", getUserInfo)
router.get("/get-rule", getRule);
router.post("/toggle-rule", toggleRule);
router.post("/deploy", deployChanges);
router.post("/logout", logout);


export default router;
