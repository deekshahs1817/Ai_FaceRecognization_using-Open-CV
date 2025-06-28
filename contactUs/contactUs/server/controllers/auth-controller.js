const User = require("../models/user-model");  
const Contact = require("../models/contact-model"); 

//registration
const register = async (req, res) => {
  try {
    const {name,email,password} = (req.body);

    console.log("Request Body:", req.body);

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new user for Postman
    const userCreated = await User.create({ name,email, password });
    console.log(userCreated);
    res.status(201).json({
      message: "Registration successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isValidPassword = await userExists.comparePassword(password);

    if (isValidPassword) {
       res.status(200).json({
         message: "Login successful",
         token: await userExists.generateToken(),
         userId: userExists._id.toString(),
       });
    }
    else {
      return res.status(401).json({ message: 'Invalid email or password' });
      }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  }

// Contact Us
const contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "First you have to login" });
    }

    const contactEntry = await Contact.create({ name, email, message });

    res.status(201).json({
      message: "Contact form submitted successfully",
      token: await contactEntry.generateToken(),
      contactId: contactEntry._id,
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Server error while submitting contact form" });
  }
};

module.exports = {
  register,
  login,
  contactUs,

};
    
