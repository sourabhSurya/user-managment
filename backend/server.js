const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

// Middleware
app.use(bodyParser.json());

app.use(cors());

// MongoDB connection setup
mongoose
  .connect(
    // "mongodb+srv://rajaryan:odr4DcNpVtCuLLQt@cluster0.ae2nlk1.mongodb.net/"
    "mongodb+srv://sourabhsuryawanshitigerindia:ff8XRG2sIl0VNIpy@cluster0.vbk733u.mongodb.net/"
  )
  .then(() => {
    console.log("DB Connection Made Succcessfully");
  })
  .catch((err) => {
    console.error(err);
  });

// Define User schema and model using Mongoose
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Routes for user authentication
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();

    // Generate a JWT token for the registered user
    const token = jwt.sign({ id: user._id }, "secretkey"); // Change the secret key and expiration as needed

    res.status(201).json({ token }); // Send the token in the response
  } catch (error) {
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).send("Invalid password");
    }
    const token = jwt.sign({ id: user._id }, "secretkey");
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

// Protected route example (requires JWT)
app.get("/users", (req, res) => {
  jwt.verify(req.headers.authorization, "secretkey", async (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    try {
      const users = await User.find().sort({ _id: -1 });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send("Error fetching users");
    }
  });
});

app.post("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    // Find the user by ID and update the name and email
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user details", error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
