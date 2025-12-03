const Listing = require("../models/Listing");

// @route   POST api/listings
// @desc    Create a listing
// @access  Private
exports.createListing = async (req, res) => {
  const { title, description, price, category, subcategory, images } = req.body;

  try {
    const newListing = new Listing({
      title,
      description,
      price,
      category,
      subcategory,
      images,
      seller: req.user.id,
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/listings
// @desc    Get all listings (with search & filter)
// @access  Public
exports.getListings = async (req, res) => {
  const { search, category, subcategory } = req.query;
  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (subcategory) {
    query.subcategory = subcategory;
  }

  try {
    const listings = await Listing.find(query).populate("seller", "name email profilePicture").sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/listings/:id
// @desc    Get listing by ID
// @access  Public
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("seller", "name email profilePicture");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   DELETE api/listings/:id
// @desc    Delete a listing
// @access  Private
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check user
    if (listing.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(500).send("Server Error");
  }
};
