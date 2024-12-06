import { GenericCodes } from "../enum";
import ResponseHelper from "../helpers/response.helper";
import { verifyToken } from "../services/jwt.service";

// Maintain a blacklist of revoked tokens
const tokenBlacklist = new Set();

// authorization for any route
export async function authorize(req, reply) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            reply.code(GenericCodes.UNAUTHORIZED).send({ error: 'Authorization header is missing' });
            return;
        }
  
        const token = authHeader.split(' ')[1];
        
        // Check if token is in blacklist
        if (tokenBlacklist.has(token)) {
            reply.code(GenericCodes.UNAUTHORIZED).send({ error: 'Unauthorized: Token has been revoked.' });
            return;
        }
        
        req.user = await verifyToken(token);
    } catch (err) {
        reply.code(GenericCodes.UNAUTHORIZED).send({ error: 'Authorization failed. Invalid or expired token' });
    }
}

// information user connected
export function authUser(req) {
    try {
        const data = req.user.data.data;
        return data;
    } catch (error) {
        return ResponseHelper.sendError(
            'Unauthorized: Access is denied due to invalid credentials.',
            GenericCodes.UNAUTHORIZED
        );
    }
}

// Route to handle user logout and token invalidation
export async function logout(req, reply) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            reply.code(GenericCodes.BAD_REQUEST).send({ error: 'Authorization header is missing' });
            return;
        }
  
        const token = authHeader.split(' ')[1];
        
        // Add token to blacklist
        tokenBlacklist.add(token);
        
        reply.send({ message: 'Logout successful.' });
    } catch (error) {
        return ResponseHelper.sendError(
            'Unauthorized',
            GenericCodes.UNAUTHORIZED
        );
    }
}