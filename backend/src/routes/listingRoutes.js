const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createListing, getListings, getListingById, deleteListing } = require("../controllers/listingController");

router.post("/", auth, createListing);
router.get("/", getListings);
router.get("/:id", getListingById);
router.delete("/:id", auth, deleteListing);

module.exports = router;
