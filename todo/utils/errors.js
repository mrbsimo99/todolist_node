/**
 * Handle error output in standard way
 * @param {Response} res 
 * @param {Error} error 
 * @param {number} code 
 * @param {string} message
 */
const outErrors = (res, error, code = 500, message = "Internal Server Error") => {
    if (process.env.SERVER_ENV !== "production") console.log(error);
    return res.status(code).json({ success: false, message });
}

module.exports = {
    outErrors,
}