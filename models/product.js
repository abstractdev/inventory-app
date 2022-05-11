const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true, maxLength: 256 },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  flavor: { type: String, maxLength: 50 },
  description: { type: String, required: true, maxLength: 1000 },
  form: { type: String, required: true, maxLength: 50 },
  servings: { type: Number, required: true, max: 1000 },
  serving_size: { type: String, required: true, maxLength: 50 },
  weight: { type: Number, required: true, max: 10000 },
  quantity: { type: Number, required: true, max: 10000 },
  strength: { type: String, maxLength: 50 },
  price: { type: Number, required: true, max: 10000 },
});

// Virtual for product's URL
ProductSchema.virtual("url").get(function () {
  return "/product/" + this._id;
});

//Export model
module.exports = mongoose.model("Product", ProductSchema);
