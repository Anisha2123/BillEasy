

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
author: String,
genre: String,
reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Book', bookSchema);
