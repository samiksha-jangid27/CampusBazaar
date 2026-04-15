const { prisma } = require('../config/db');

exports.createListing = async (req, res) => {
  const { title, description, price, category, subcategory, images } = req.body;
  const userId = req.user.id;

  if (!title || !description || !price || !category || !subcategory) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price,
        category,
        subcategory,   // <- FIXED
        images: images || [],
        sellerId: userId,
      },
    });

    res.json(listing);
  } catch (error) {
    console.log("createListing error", error);
    res.status(500).json({ message: "Failed to create listing" });
  }
};


exports.getListings = async (req, res) => {
  const { search, category } = req.query;
  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category) where.category = category;

  try {
    const listings = await prisma.listing.findMany({
      where,
      include: { seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(listings);
  } catch (err) {
    console.error('getListings error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(req.params.id) },
      include: { seller: { select: { id: true, name: true, email: true } } },
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    console.error('getListingById error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.sellerId !== req.user.userId) return res.status(403).json({ message: 'Not authorized' });

    await prisma.listing.delete({ where: { id } });
    res.json({ message: 'Listing removed' });
  } catch (err) {
    console.error('deleteListing error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
