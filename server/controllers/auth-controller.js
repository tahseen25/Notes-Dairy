const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const https = require('https');
const querystring = require('querystring');

// Constants for TypingDNA
const API_KEY = '8c4b32bcc6c3f2d2fe94910dce94fd77';
const API_SECRET = '7a47ee39b705693b8701bd9a9a13af35';
const BASE_URL = 'api.typingdna.com';

// Helper function to send typing data to TypingDNA
const sendTypingData = (userId, pattern) => {
  return new Promise((resolve, reject) => {
    // Prepare the POST data. 'tp' is used as the key for the typing pattern.
    const postData = querystring.stringify({ tp: pattern });

    // Set up the HTTPS request options
    const options = {
      hostname: BASE_URL,
      port: 443,
      path: '/auto/' + userId,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        'Authorization': 'Basic ' + Buffer.from(API_KEY + ':' + API_SECRET).toString('base64'),
      },
    };

    let responseData = '';

    // Create the HTTPS request
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    // Write the POST data and end the request
    req.write(postData);
    req.end();
  });
};


// *-------------------
// Home Logic
// *-------------------
const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    console.log(error);
  }
};

// *-------------------------------
//* User Registration Logic 📝
// *-------------------------------
// 1. Get Registration Data: 📤 Retrieve user data (username, email, password).
// 2. Check Email Existence: 📋 Check if the email is already registered.
// 3. Hash Password: 🔒 Securely hash the password.
// 4. Create User: 📝 Create a new user with hashed password.
// 5. Save to DB: 💾 Save user data to the database.
// 6. Respond: ✅ Respond with "Registration Successful" or handle errors.

const register = async (req, res) => {
  try {
    // const data = req.body;
    console.log(req.body);
    const { username, email, password } = req.body;

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({ msg: "email already exists" });
    }

    const userCreated = await User.create({ username, email, password });

    // res.status(201).json({ message: "User registered successfully" });
    res.status(201).json({
      msg: "Registration Successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });

  } catch (error) {
    //res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

// *-------------------------------
//* User Login Logic 📝
// *-------------------------------

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const user = await bcrypt.compare(password, userExist.password);
    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      res.status(200).json({
        message: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or passord " });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// *-------------------------------
//* User typingpattern Logic 📝
// *-------------------------------
const typingpattern = async (req, res) => {
  try {
    const { pattern, user_id } = req.body;
    const typingdnaResponse = await sendTypingData(user_id, pattern);
    res.status(200).json(typingdnaResponse);
  } catch (error) {
    console.error("Error processing typing pattern:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// *-------------------------------
//* User Logic 📝
// *-------------------------------

const user = async (req, res) => {
  try {
    // const userData = await User.find({});
    const userData = req.user;
    console.log(userData);
    return res.status(200).json({ msg: userData });
  } catch (error) {
    console.log(` error from user route ${error}`);
  }
};
module.exports = { home, register, login ,user, typingpattern};
