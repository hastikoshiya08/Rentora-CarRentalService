const carSchema = new mongoose.Schema({
  name: String,
  company: String,
  price: Number,
  image: String,

  isSpecial: {
    type: Boolean,
    default: false
  },

  specialPrice: {
    type: Number,
    default: 0
  }
});