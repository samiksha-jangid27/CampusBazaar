const { prisma } = require("../config/db");

// ------------------------------
// CREATE LISTING  (POST /api/listings)
// ------------------------------
exports.createListing = async (req, res) => {
  const { title, description, price, category, subcategory, images } = req.body;

  try {
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number(price),
        category,
        subcategory,
        images,
        sellerId: req.user.userId, // from auth middleware
      },
    });

    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------
// GET ALL LISTINGS  (GET /api/listings)
// with search + category filters
// ------------------------------
exports.getListings = async (req, res) => {
  const { search, category, subcategory } = req.query;

  let where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) where.category = category;
  if (subcategory) where.subcategory = subcategory;

  try {
    const listings = await prisma.listing.findMany({
      where,
      include: {
        seller: {
          select: { id: true, name: true, email: true, profilePicture: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------
// GET LISTING BY ID (GET /api/listings/:id)
// ------------------------------
exports.getListingById = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        seller: {
          select: { id: true, name: true, email: true, profilePicture: true },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------
// DELETE LISTING (DELETE /api/listings/:id)
// ------------------------------
exports.deleteListing = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.sellerId !== req.user.userId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await prisma.listing.delete({
      where: { id },
    });

    res.json({ message: "Listing removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};