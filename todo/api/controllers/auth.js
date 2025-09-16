const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");

const SECRET = process.env.SECRET_KEY;

const outErrors = (res, error) => {
  const code = error.code || 500;
  const message = error.message || "Server Error";
  return res.status(code).json({ success: false, error: message });
};

const registerUser = async (req, res) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    const data = await schema.validateAsync(req.body);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email già registrata" });
    }

    data.password = await bcrypt.hash(data.password, 10);

    const user = (await new User(data).save()).toObject();
    delete user.password;
    delete user.emailVerifyToken;

    return res.status(201).json({
      success: true,
      message: "Nuovo utente registrato",
      data: { userId: user._id, email: user.email },
    });
  } catch (error) {
    return outErrors(res, error);
  }
};

const loginUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    const { email, password } = await schema.validateAsync(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: "Utente non trovato" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, error: "Password errata" });

    const token = jwt.sign({ _id: user._id, email: user.email }, SECRET, { expiresIn: "2d" });

    return res.status(200).json({
      success: true,
      message: "Login effettuato",
      data: { token },
    });
  } catch (error) {
    return outErrors(res, error);
  }
};

const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ success: false, error: "Token mancante" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, error: "Token mancante" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: "Token non valido" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUserToken,
  outErrors,
};
