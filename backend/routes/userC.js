const docModel = require("../models/docModel");

const docController = async (req, res) => {
  try {
    console.log("📥 Received doctor data:", req.body); // Log request body

    // Create new doctor document
    const newDoctor = new docModel({
      userId: req.body.userId,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      specialization: req.body.specialization,
      experience: req.body.experience,
      fees: req.body.fees,
      status: 'pending',
      timings: req.body.timings,
    });

    // Save to database
    await newDoctor.save();

    res.status(201).send({
      success: true,
      message: "Doctor registration request sent successfully!",
    });
  } catch (error) {
    console.error("❌ Error in docController:", error);

    res.status(500).send({
      success: false,
      message: "Doctor registration failed",
      error: error.message || error,
    });
  }
};

module.exports = {
  // other exports...
  docController,
};
