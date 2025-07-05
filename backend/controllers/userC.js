const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const userSchema = require("../schemas/userModel");
const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");

// Register Controller
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res.status(200).send({ message: "User already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();
    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    user.password = undefined;
    return res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};

// Auth Controller
const authController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Auth error", success: false, error });
  }
};

// Doctor Registration
const docController = async (req, res) => {
  try {
    const { doctor, userId } = req.body;

    const newDoctor = new docSchema({
      ...doctor,
      userId: userId.toString(),
      status: "pending",
    });
    await newDoctor.save();

    const adminUser = await userSchema.findOne({ type: "admin" });
    if (!adminUser) {
      return res.status(404).send({ success: false, message: "Admin user not found" });
    }

    const notification = adminUser.notification || [];
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.fullName} has applied for doctor registration`,
      data: {
        userId: newDoctor._id,
        fullName: newDoctor.fullName,
        onClickPath: "/admin/doctors",
      },
    });

    await userSchema.findByIdAndUpdate(adminUser._id, { notification });

    return res.status(201).send({
      success: true,
      message: "Doctor Registration request sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Error while applying", error: error.message });
  }
};

// Get All Notifications
const getallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();
    return res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Unable to fetch", success: false, error });
  }
};

// Delete All Notifications
const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    await user.save();
    user.password = undefined;
    return res.status(200).send({
      success: true,
      message: "Notifications deleted",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Unable to delete", success: false, error });
  }
};

// Get Approved Doctors
const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({ status: "approved" });
    return res.status(200).send({
      message: "Doctor list fetched",
      success: true,
      data: docUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong", success: false, error });
  }
};

// Book Appointment
const appointmentController = async (req, res) => {
  try {
    let { userInfo, doctorInfo } = req.body;
    userInfo = JSON.parse(userInfo);
    doctorInfo = JSON.parse(doctorInfo);

    let documentData = null;
    if (req.file) {
      documentData = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      };
    }

    const newAppointment = new appointmentSchema({
      userId: req.body.userId,
      doctorId: req.body.doctorId,
      userInfo,
      doctorInfo,
      date: req.body.date,
      document: documentData,
      status: "pending",
    });

    await newAppointment.save();

    const doctorUser = await userSchema.findOne({ _id: doctorInfo.userId });
    if (doctorUser) {
      doctorUser.notification.push({
        type: "New Appointment",
        message: `New Appointment request from ${userInfo.fullName}`,
      });
      await doctorUser.save();
    }

    return res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong", success: false, error });
  }
};

// Get All Appointments for a User
const getAllUserAppointments = async (req, res) => {
  try {
    const allAppointments = await appointmentSchema.find({ userId: req.body.userId });
    const doctorIds = allAppointments.map(app => app.doctorId);

    const doctors = await docSchema.find({ _id: { $in: doctorIds } });

    const appointmentsWithDoctor = allAppointments.map(app => {
      const doctor = doctors.find(doc => doc._id.toString() === app.doctorId.toString());
      return { ...app.toObject(), docName: doctor ? doctor.fullName : "" };
    });

    return res.status(200).send({
      message: "Appointments listed below",
      success: true,
      data: appointmentsWithDoctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong", success: false, error });
  }
};

// Get Documents
const getDocsController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    const allDocs = user.documents;
    if (!allDocs || allDocs.length === 0) {
      return res.status(200).send({ message: "No documents", success: true });
    }
    return res.status(200).send({
      message: "Documents fetched successfully",
      success: true,
      data: allDocs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong", success: false, error });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
};


