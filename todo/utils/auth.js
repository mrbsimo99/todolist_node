const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

/**
 * Generate password hash
 * @param {string} password 
 * @returns {Promise<string>}
 */
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
}

/**
 * Compare input password with hash on db
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

/**
 * Generate new token for current user
 * @param {object} payload 
 * @returns {Promise<string>|Promise<Error>} Token generated or Error
 */
const generateUserToken = async (payload) => {
    return new Promise((resolve, reject) => {
        try {
            const token = jwt.sign(payload, SECRET_KEY, { issuer: "ToDo", expiresIn: "2d" });
            if (token) return resolve(token);
            return reject(new Error("Error during token generation process"));
        } catch(error) {
            return reject(error);
        }
    });
}

/**
 * Verify user auth token
 * @param {string} token 
 * @returns {Promise<string>|Promise<Error>} Current user payload or Error
 */
const verifyUserToken = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            const is_verified = jwt.verify(token, SECRET_KEY);
            if (is_verified) return resolve(is_verified);
            return reject(new Error("Error during token verification process"));
        } catch(error) {
            return reject(error);
        }
    });
}

module.exports = {
    hashPassword,
    comparePassword,
    generateUserToken,
    verifyUserToken,
}