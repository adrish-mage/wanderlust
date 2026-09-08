const { doubleCsrf } = require("csrf-csrf");

module.exports = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || process.env.SESSION_SECRET,
    getSessionIdentifier: (req) => req.session.id,
    cookieName: "csrf-token",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true
    },
    getCsrfTokenFromRequest: (req) => req.body?._csrf
});
