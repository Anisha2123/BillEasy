

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
rating: Number,
comment: String,
createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
