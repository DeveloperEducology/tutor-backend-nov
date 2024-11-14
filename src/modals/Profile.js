const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
});

const classSchema = new Schema({
  name: String,
});

const subjectSchema = new Schema({
  name: String,
});

const locationSchema = new Schema({
  name: String,
  cityId: { type: Schema.Types.ObjectId, ref: "City" },
});
const pincodeSchema = new Schema({
  name: String,
  pincode: Number,
  cityId: { type: Schema.Types.ObjectId, ref: "City" },
});

const citySchema = new Schema({
  name: String,
});

const boardSchema = new Schema({
  name: String,
});

const daySchema = new Schema({
  name: String,
});

// Address schema definition
const AddressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
});

// Media schema definition
const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
});

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profileId: Number,
  userName: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    default: null,
  },
  availability: {
    days: [String],
    time: String,
    salary: Number,
    tutoringStyles: [String],
  },
  otherInfo: {
    preferredCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],
    preferredClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    preferredSubjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    ],
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    pincode: { type: mongoose.Schema.Types.ObjectId, ref: "Pincode" },
    preferredPincodes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Pincode" },
    ],
    preferredDays: [{ type: mongoose.Schema.Types.ObjectId, ref: "Day" }],
    tutoringMethod: [String],
  },
  experience: {
    totalExperience: String,
    experienceDetails: String,
  },
  education: [
    {
      examDegreeTitle: String,
      idCard: String,
      yearOfPassing: String,
      result: String,
      fromDate: String,
      toDate: String,
      currentInstitute: String,
    },
  ],
  personalInformation: {
    additionalNumber: String,
    address: String,
    gender: String,
    dateOfBirth: Date,
    religion: String,
    identityType: String,
    nationality: String,
    fathersName: String,
    fathersNumber: String,
    mothersName: String,
    mothersNumber: String,
    overview: String,
  },
  emergencyInformation: {
    name: String,
    number: String,
    relation: String,
    address: String,
  },
  basicInfo: {
    firstName: String,
    lastName: String,
    gender: String,
    whatsAppNumber: String,
    dateOfBirth: String,
  },
  address: AddressSchema, // Adding address schema
  profileImage: String,
  media: [mediaSchema],
  rating: {
    rating: Number,
    review: String,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
const Category = mongoose.model("Category", categorySchema);
const Class = mongoose.model("Class", classSchema);
const Subject = mongoose.model("Subject", subjectSchema);
const Location = mongoose.model("Location", locationSchema);
const City = mongoose.model("City", citySchema);
const Day = mongoose.model("Day", daySchema);
const Pincode = mongoose.model("Pincode", pincodeSchema);
const Board = mongoose.model("Board", boardSchema);
