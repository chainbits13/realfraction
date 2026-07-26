const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    tokenId: { type: Number, required: true, unique: true },
    ownerAddress: { type: String, required: true, lowercase: true },
    tokenURI: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    propertyType: { type: String, default: "" },
    images: [{ type: String }],
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    fractionalTokenAddress: { type: String, default: null },
    smartHomeEnabled: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "verified", "listed"], default: "draft" },
  },
  { timestamps: true }
);

propertySchema.index({ ownerAddress: 1 });
propertySchema.index({ tokenId: 1 });
propertySchema.index({ status: 1 });

module.exports = mongoose.models.Property || mongoose.model("Property", propertySchema);
