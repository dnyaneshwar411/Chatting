import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupUser = async (req, res) => {
  try {
    const { fullName, userName, password, confirmedPassword, gender } = req.body;
    if (password !== confirmedPassword) return res.status(400).json({ error: "Passwords don't match" });

    const user = await User.findOne({ userName });
    if (user) return res.status(400).json({ error: "Username already exists" });

    // Hashed Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const profilePic = `https://avatar.iran.liara.run/public/${gender === "male" ? "boy" : "girl"}?username=${userName}`;
    const newUser = new User({ fullName, userName, password: hashedPassword, gender, profilePic });

    if (newUser) {
      // generate JWT token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic
      })
    } else {
      res.send(400).json({ error: "Invalid User Data" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePic: user.profilePic
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "logged out successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal server error" });
  }
}