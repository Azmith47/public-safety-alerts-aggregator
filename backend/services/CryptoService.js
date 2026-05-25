import crypto from "crypto";

function generateToken() {

    return crypto
        .randomBytes(32)
        .toString("hex");
}

export default generateToken;