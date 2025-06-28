const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//bcrypt
userSchema.pre("save", async function (next) {
  // console.log(this)
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  try { 
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, salt);
    user.password = hash_password;
    next();
  } catch (error) {
    console.error("Hashing Error:", error);
    return next(error);
    }
});

//comparePassword
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
}

//json web token
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign({
      userId: this._id.toString(),
      name:this.name,
      email: this.email,
      isAdmin: this.isAdmin
    }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d"
    });

  } catch (error) {
    console.error(error);
    return error;
  }
}

  
//model or collection name
const User = new mongoose.model("User", userSchema);

module.exports = User;
  
