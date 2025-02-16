const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
  typing_id: {
    type: String,
    default: uuidv4, // Generates a new UUID for each user by default
  }
});


userSchema.pre('save',async function(next){
  //console.log("pre method", this);
  const user = this;

  if(!user.isModified("password")){
    next();
  }

  try{
    const saltRound= await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password=hash_password;
  }catch(error){
    next(error);
  }
});

userSchema.methods.generateToken = function(){
  try{
    return jwt.sign(
    {
      userId: this._id.toString(),
      email:this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "30d"
    }
  );
  }catch(error){
    console.error(error);
  }
};

// comparePassword
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// define the model or the collection name
const User = new mongoose.model("User", userSchema);
module.exports = User;
