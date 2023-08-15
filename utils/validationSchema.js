const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

exports.signBodyValidation = (body) => {
  const schema = joi.object({
    userName: joi.string().required().label("User Name"),
    email: joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(body);
};

exports.loginBodyValidation = (body) => {
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  });
  return schema.validate(body);
};

exports.refreshTokenBodyValidation = (body) => {
  const schema = joi.object({
    refreshToken: joi.string().required().label("Refresh Token"),
  });
  return schema.validate(body);
};
