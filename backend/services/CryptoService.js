<<<<<<< Updated upstream
const crypto = require("crypto");

function generateToken() {

    return crypto
        .randomBytes(32)
        .toString("hex");
}
=======
import crypto from "crypto";

function generateToken() {
	return crypto.randomBytes(32).toString("hex");
}

export default generateToken;
>>>>>>> Stashed changes
