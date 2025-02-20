const mongoose = require("mongoose");


const genericSchema = new mongoose.Schema(
  {
    data: { type: Object, required: true }, 
    category: { type: String, default: "uncategorized" }, 
    sentiment_score: { type: Number, min: -1, max: 1 }, 
    metadata: {
      source: { type: String, default: "unknown" }, 
      date: { type: String }, 
      time: { type: String }, 
    },
    timestamp: { type: Date, default: Date.now }, 
  },
  {
    strict: false, 
    timestamps: true,
  }
);

module.exports = mongoose.model("GenericData", genericSchema);
