const express = require("express");
const {
    getOwners,
    createOwner,
    getOwner,
    updateOwner,
    partialUpdateOwner,
    deleteOwner,
    loginOwner,
} = require("../controllers/owner");
const verifyToken = require('../middleware/tokenHandler');


const router = express.Router();

router.get("/", getOwners);
router.post("/", createOwner);
router.get("/detial/", verifyToken, getOwner);
router.put("/", verifyToken, updateOwner);
router.patch("/parital/", verifyToken, partialUpdateOwner);
router.delete("/", verifyToken, deleteOwner);
router.post("/login/", loginOwner);


module.exports = router;
