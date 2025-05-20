

const mongoose = require('mongoose');
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB error:", err);
  process.exit(1);
});

module.exports = mongoose;
