class AuthError extends Error {
    constructor(message = "Not Authorized", code = 403) {
        super(message);
        this.name = "AuthError"
        this.code = code;
    }
}

class RouteError extends Error {
    constructor(message = "Request error", code = 400) {
        super(message);
        this.name = "RequestError"
        this.code = code;
    }
}

module.exports = {
    AuthError,
    RouteError,
}