import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {

    const { _id: loggedInUserId } = req.user

    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(201).json(allUsers);

  } catch (error) {
    console.log("This is an error in the get users controller in getUsersForSidebar -", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
} 