const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
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
        // Blocca l'accesso per l'utente
        isActive: {
            type: Boolean,
            default: true,
        },
        // Rappresenta la verifica dell'email da parte dell'utente
        isVerified: {
            type: Boolean,
            default: true,
        },

        emailVerifyToken: {
            type: String,
            default: null,
        },
    },
    { timestamps: true, versionKey: false }
);

const User = model("User", UserSchema);

module.exports = User;
