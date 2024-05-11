const express = require("express");
const {
  getCars,
  createCar,
  getCar,
  updateCar,
  deleteCar,
} = require("../controllers/car");
const verifyToken = require('../middleware/tokenHandler');

const router = express.Router();

router.get("/", verifyToken, getCars);
router.post("/", verifyToken, createCar);
router.get("/:id/", verifyToken, getCar);
router.put("/:id/", verifyToken, updateCar);
router.delete("/:id/", verifyToken, deleteCar);

module.exports = router;
