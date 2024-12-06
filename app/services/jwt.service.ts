import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// Load environment variables from .env file
config();

// Set the JWT_SECRET_KEY environment variable
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY environment variable is not set');
}

// Set the REFRESH_TOKEN environment variable
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
if (!JWT_REFRESH_TOKEN) {
    throw new Error('JWT_REFRESH_TOKEN environment variable is not set');
}

// Define the payload for the JWT
interface JWTPayload {
    data: string; // The subject of the JWT (e.g. the user ID)
    exp: number; // The expiration time of the JWT
}

/**
 * Generate a new JSON Web Token (JWT).
 *
 * @param user The subject of the JWT (e.g. the user ID)
 * @returns A new JWT as a string
 */
function generateToken(data: any) {
    const payload: JWTPayload = {
        data, // The subject of the JWT
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1, // The JWT will expire in 1 days
    };

    /**
     * Generate a new JWT using the HS256 algorithm and the JWT_SECRET_KEY.
     * The JWT will have a payload with the given sub and expiration time.
     */
    return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: 'HS512' });
}

/**
 * Refresh a JSON Web Token (JWT)
 *
 * @param oldToken The old JWT that needs to be refreshed
 * @returns A new JWT as a string
 * @throws {Error} Failed to refresh JWT if the old token is invalid or expired
 */
function refreshToken(oldToken: string): string {
    // Verify the old token and extract the subject from the decoded payload
    try {
        const decoded = jwt.verify(oldToken, JWT_SECRET_KEY) as JWTPayload;

        // Generate a new JWT with the same subject
        const newToken = generateToken(decoded.data);

        return newToken;

    // Catch any errors and throw a new error if the old token is invalid or expired
    } catch (err) {
        throw new Error('Failed to refresh JWT');
    }
}


/**
 * Verify a JSON Web Token (JWT)
 *
 * @param {string} token The token to verify
 * @returns {Promise<any>} A promise that resolves to the decoded token
 * or rejects with an error if the token is invalid
 */
const verifyToken = async (token: string) => {
    // Set the secret key for verifying the JWT
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key not set');
    }

    // Verify the JWT and return a Promise
    return new Promise((resolve, reject) => {
        // Promisify the verify() method to avoid callbacks
        const verifyPromise = promisify(jwt.verify);
    
        // Verify the token and handle the result
        verifyPromise(token, secretKey)
        .then((decoded: any) => {
            // The token is valid, so resolve with the decoded token
            resolve(decoded);
        })
        .catch((err: any) => {
            // The token is invalid, so reject with an error
            reject(err);
        });
    });
};

export { generateToken, refreshToken, verifyToken };