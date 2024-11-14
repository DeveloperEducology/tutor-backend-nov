const ProfileModel = require("../../modals/Profile");
const BookingModel = require("../../modals/Booking");
const UserModel = require("../../modals/user");
const Parent = require("../../modals/parentModel");

const fileUpload = async (req, res) => {
  if (!req?.file) {
    res.status(403).json({ status: false, error: "please upload a file" });
    return;
  }
  let data = {};
  if (!!req?.file) {
    data = {
      url: req.file.location,
      type: req.file.mimetype,
    };
  }
  try {
    res.send({
      data: data,
    });

    console.log("fileupload in user api", data);
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};

// Get all profile profiles
const getAll = async (req, res) => {
  try {
    const profiles = await ProfileModel.find(); // Updated from profile.find() to ProfileModel.find()
    res.send(profiles);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving profiles.",
    });
  }
};

// Get a single profile profile by ID
const getById = async (req, res) => {
  const id = req.params.id;

  try {
    const profile = await ProfileModel.findById(id);
    if (!profile) {
      return res.status(404).send({
        message: `profile profile with id=${id} not found.`,
      });
    }
    res.send(profile);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving profile profile with id=" + id,
    });
  }
};

// Get user info by user ID from profile profile

const getByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await ProfileModel.findOne({ userId });
    if (!result) {
      return res.status(404).send({
        message: `profile profile with userId=${userId} not found.`,
      });
    }
    res.send(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserInfoByProfileId = async (req, res) => {
  const userId = req.params.id; // Assuming userId is passed as a URL parameter

  try {
    // Populate the user field in the profile document with specific fields
    const profile = await ProfileModel.findOne({ userId }).populate({
      path: "userId",
      select: "userName email", // Select specific fields from the userId object
    });

    if (!profile) {
      return res.status(404).send({
        message: `Profile with userId=${userId} not found.`,
      });
    }

    console.log("profile", profile);
    res.send(profile);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving user information with userId=" + userId,
    });
  }
};

const getInfoByProfileId1 = async (req, res) => {
  const userId = req.params.id; // Assuming userId is passed as a URL parameter

  try {
    // Populate the user field in the profile document with specific fields
    const profile = await ProfileModel.findOne({ userId })
      .populate({
        path: "userId",
        select: "userName email", // Select specific fields from the userId object
      })
      .populate("otherInfo.preferredCategories")
      .populate("otherInfo.preferredSubjects")
      .populate("otherInfo.preferredClasses")
      .populate("otherInfo.preferredPincodes")
      .populate("otherInfo.city")
      .populate("otherInfo.pincode")
      .exec();

    if (!profile) {
      return res.status(404).send({
        message: `Profile with userId=${userId} not found.`,
      });
    }

    console.log("profile", profile);
    res.send(profile);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving user information with userId=" + userId,
    });
  }
};

// Create and Save a new profile profile for the logged-in user
const create = async (req, res) => {
  const {
    userId,
    userName,
    availability,
    otherInfo,
    experience,
    education,
    basicInfo,
    personalInformation,
    emergencyInformation,
    address,
  } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ status: false, message: "userId is required" });
  }

  try {
    // Debugging info
    console.log("req.files:", req.files);
    console.log("req.body before update:", req.body);

    // Handle file uploads
    let media = [];
    if (req.files && req.files.length > 0) {
      media = req.files.map((val) => {
        return {
          type: val.mimetype == "video/mp4" ? "video" : "image",
          url: val.location, // Assuming the file path is stored in `location`
        };
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const existingProfile = await ProfileModel.findOne({ userId });
    if (existingProfile) {
      return res
        .status(400)
        .json({ status: false, message: "User already has a profile" });
    }

    const newProfile = new ProfileModel({
      userId,
      userName,
      availability,
      otherInfo,
      experience,
      education,
      basicInfo,
      personalInformation,
      emergencyInformation,
      address,
      media,
      profileId: Date.now(),
    });

    const savedProfile = await newProfile.save();
    await UserModel.findByIdAndUpdate(userId, {
      isNewUser: false,
      // isProfileVerified: false,
    });

    res.send({
      data: savedProfile,
      message: "Profile created successfully",
      status: true,
    });
  } catch (error) {
    console.log("Error creating profile", error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  try {
    // Debugging info
    console.log("req.files:", req.files);
    console.log("req.body before update:", req.body);

    // Handle file uploads
    let media = [];
    if (req.files && req.files.length > 0) {
      media = req.files.map((val) => {
        return {
          type: val.mimetype == "video/mp4" ? "video" : "image",
          url: val.location, // Assuming the file path is stored in `location`
        };
      });
      req.body.media = media;
    }

    const updatedProfile = await ProfileModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).send({
        message: `Cannot update profile with id=${id}. Maybe profile was not found!`,
      });
    }

    res.send(updatedProfile);
  } catch (err) {
    res.status(500).send({
      message: "Error updating profile with id=" + id,
    });
  }
};

const update1 = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const id = req.params.id;

  try {
    // Debugging info
    console.log("req.files:", req.files);
    console.log("req.body before update:", req.body);

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const media = req.files.map((val) => {
        return {
          type: val.mimetype == "video/mp4" ? "video" : "image",
          url: val.location, // Assuming the file path is stored in location
        };
      });

      // Ensure media field is in the profile object
      if (!req.body.profile) {
        req.body.profile = {};
      }
      req.body.profile.media = media;
    }

    // Log the modified req.body
    console.log("req.body after file handling:", req.body);

    const updatedSection = req.body;

    // Update the user
    const updatedUser = await ProfileModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("updateduser", updatedUser);

    // Check if user was found and updated
    if (!updatedUser) {
      return res.status(404).send({
        message: `Cannot update user profile with id=${id}. Maybe user was not found!`,
      });
    }

    // Assuming you need to update the user's availability within the profile
    if (updatedUser.profile && updatedUser.profile.availability) {
      updatedUser.profile.availability = updatedSection;
    }
    // if (updatedUser.profile && updatedUser.profile.experience) {
    //   updatedUser.profile.experience = updatedSection;
    // }
    // if (updatedUser.profile && updatedUser.profile.education) {
    //   updatedUser.profile.education = updatedSection;
    // }
    // if (updatedUser.profile && updatedUser.profile.personalInformation) {
    //   updatedUser.profile.personalInformation = updatedSection;
    // }

    // Save the updated user
    await updatedUser.save();

    // Send updated user info
    res.send(updatedUser);
    console.log("saved user", updatedUser.profile);
  } catch (err) {
    // Log error and send response
    console.error("Error updating user profile:", err);
    res.status(500).send({
      message: "Error updating user profile with id=" + id,
    });
  }
};

const profileCategories = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Validate the categoryId
    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }

    // Fetch profiles where the specified category is in the preferredCategories array
    const profiles = await ProfileModel.find({
      "otherInfo.preferredCategories": categoryId,
    })
      .populate({
        path: "userId",
        select: "userName email", // Select specific fields from the userId object
      })
      .populate("otherInfo.preferredCategories")
      .populate("otherInfo.preferredSubjects")
      .populate("otherInfo.preferredClasses")
      .populate("otherInfo.location"); // Populate location if needed

    res.status(200).json({ success: true, profiles, count: profiles.length });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const searchProfiles = async (req, res) => {
  try {
    const { id: subjectId } = req.params;

    console.log("Searching for subjectId:", subjectId);

    const profiles = await ProfileModel.find({
      "otherInfo.preferredSubjects": subjectId,
    })
      .populate({ path: "userId", select: "userName email profileImage" })
      .populate("otherInfo.preferredCategories") // Example of populating another related field
      .populate("otherInfo.preferredClasses") // Add more as needed
      .populate("otherInfo.preferredSubjects"); // Add more as needed

    console.log("Profiles found:", profiles);

    if (profiles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No profiles found" });
    }

    res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const submitParentForm = async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    whatsAppNumber,
    email,
    date,
    gender,
    city,
    pinCode,
    schoolName,
    board,
    medium,
    guardianName,
    guardianContact,
    guardianRelation,
  } = req.body;

  try {
    // Check if the user already exists based on userId, email, or WhatsApp number
    const existingParent = await Parent.findOne({
      $or: [
        { userId }, // Check by userId
        { whatsAppNumber }, // Or by WhatsApp number
      ],
    });

    // If the parent already exists, send a conflict response
    if (existingParent) {
      return res.status(409).json({
        message:
          "User already exists with the provided userId, email, or WhatsApp number.",
      });
    }

    // Create a new Parent entry if no user exists
    const parent = new Parent({
      userId,
      firstName,
      lastName,
      whatsAppNumber,
      email,
      date,
      gender,
      city,
      pinCode,
      schoolName,
      board,
      medium,
      guardianName,
      guardianContact,
      guardianRelation,
    });



    await UserModel.findByIdAndUpdate(userId, {
      isNewUser: false,
      // isProfileVerified: false,
    });

    // Save the new parent entry
    await parent.save();

    // Send success response
    res.status(201).json({
      message: "Parent form submitted successfully",
      parent,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Server Error. Try again later." });
  }
};

const getParentProfileId = async (req, res) => {
  const userId = req.query.userId;
  try {
    const profiles = await Parent.findOne({ userId }); // Updated from profile.find() to ProfileModel.find()
    res.send({ data: profiles });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving profiles.",
    });
  }
};

const getTutorProfileId = async (req, res) => {
  const userId = req.query.userId;
  try {
    const profiles = await ProfileModel.findOne({ userId }); // Updated from profile.find() to ProfileModel.find()
    res.send({ data: profiles });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving profiles.",
    });
  }
};

module.exports = {
  create,
  update,
  getAll,
  getById,
  getUserInfoByProfileId,
  getByUserId,
  fileUpload,
  getInfoByProfileId1,
  profileCategories,
  searchProfiles,
  submitParentForm,
  getParentProfileId,
  getTutorProfileId,
};
