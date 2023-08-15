const validationSchema = require("../utils/validationSchema");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const jwt = require("jsonwebtoken");
const UserToken = require("../models/UserToken");

exports.refreshToken = async (req, res) => {
  const { error } = validationSchema.refreshTokenBodyValidation(req.body);

  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }

  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "14m" },
      );
      res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(400).json(err));
};

exports.logout = async (req, res) => {
  try {
    const { error } = validationSchema.refreshTokenBodyValidation(req.body);

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const userToken = await UserToken.findOne({ token: req.body.refreshToken });

    if (!userToken) {
      return res.status(200).json({
        error: false,
        message: "Logged Out Successfully",
      });
    }

    await userToken.remove();
    res.status(200).json({ error: false, message: "Logged Out Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};
