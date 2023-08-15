const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const validationSchema = require("../utils/validationSchema");

exports.signUp = async (req, res) => {
  try {
    const { error } = validationSchema.signBodyValidation(req.body);

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        error: true,
        message: "User with given email already exits",
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();

    res.status(201).json({
      error: false,
      message: "Account created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: true,
      message: "Internal server Error",
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { error } = validationSchema.loginBodyValidation(req.body);

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!verifiedPassword) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = await generateToken(user);

    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: "logged in successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: true,
      message: "Internal server Error in login",
    });
  }
};
