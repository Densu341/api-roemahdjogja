import express from "express";
import {
  getRoomTypes,
  getRoomType,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../controllers/RoomTypes.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/room-types", verifyUser, getRoomTypes);
router.get("/room-types/:id", verifyUser, getRoomType);
router.post("/room-types", verifyUser, adminOnly, createRoomType);
router.patch("/room-types/:id", verifyUser, adminOnly, updateRoomType);
router.delete("/room-types/:id", verifyUser, adminOnly, deleteRoomType);

export default router;
