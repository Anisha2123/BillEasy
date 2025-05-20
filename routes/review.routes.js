



const router = require('express').Router();
const auth = require('../middlewares/auth');
const Review = require('../models/Review');

// POST /books/:id/reviews
router.post('/book/:id', auth, async (req, res) => {
  const exists = await Review.findOne({ user: req.user.id, book: req.params.id });
  if (exists) return res.status(400).json({ msg: 'You already reviewed this book' });

  const review = new Review({ ...req.body, user: req.user.id, book: req.params.id });
  await review.save();
  res.status(201).json(review);
});

// PUT /reviews/:id
router.put('/:id', auth, async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user.id });
  if (!review) return res.status(404).json({ msg: 'Review not found' });

  Object.assign(review, req.body);
  await review.save();
  res.json(review);
});

// DELETE /reviews/:id
router.delete('/:id', auth, async (req, res) => {
  const deleted = await Review.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!deleted) return res.status(404).json({ msg: 'Review not found or unauthorized' });

  res.json({ msg: 'Review deleted' });
});

module.exports = router;
