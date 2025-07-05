const mongoose = require("mongoose");

const docModel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      set: value => value.charAt(0).toUpperCase() + value.slice(1),
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"], // ✅ Fixed typo
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    fees: {
      type: Number,
      required: [true, "Fees is required"],
    },
    status: {
      type: String,
      default: 'pending'
    },
    timings: {
      type: [String], // ✅ Changed from Object to Array of Strings
      required: [true, "Work time required"],
    },
  },
  {
    timestamps: true,
  }
);

const docSchema = mongoose.model("doctor", docModel);

module.exports = docSchema;

