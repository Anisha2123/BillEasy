


const router = require('express').Router();
const auth = require('../middlewares/auth');
const Book = require('../models/Book');
const Review = require('../models/Review');


router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    console.log('Searching for books with query:', query); // ✅ Moved here

    if (!query) {
      return res.status(400).json({ error: 'Missing search query' });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(books);
  } catch (err) {
    console.error('Search API Error:', err); // full error object
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.send('Test OK');
});


// POST /books (create book)
// Assuming: `Book` model is already imported

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;

    const filter = {};
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (genre) filter.genre = { $regex: genre, $options: 'i' };

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('reviews'); // Optional: populate reviews if needed

    const total = await Book.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      books
    });
  } catch (err) {
    console.error('Books fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});




// GET /books (all books with pagination + filter)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  const filter = {};
  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = genre;

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  res.json(books);
});

// GET /books/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const book = await Book.findById(id).lean(); // .lean() returns plain JS object

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Fetch reviews
    const reviews = await Review.find({ book: id })
      .populate('user', 'username') // optional
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Calculate average rating
    const allReviews = await Review.find({ book: id });
    const avgRating =
      allReviews.length > 0
        ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
        : null;

    book.averageRating = avgRating;
    book.reviews = reviews;

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});








module.exports = router;
