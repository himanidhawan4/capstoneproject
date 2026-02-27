import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Handle "Bearer <token>" or raw token format
        const token = authHeader.startsWith("Bearer ") 
            ? authHeader.split(" ")[1] 
            : authHeader;

        if (!token) {
            return res.status(401).json({ message: "Authentication token missing!" });
        }

        // Verify the token against the environment secret
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
            if (err) {
                // Log error for server-side monitoring (optional)
                console.error("JWT Verification Error:", err.message);
                return res.status(403).json({ message: "Token is invalid or has expired." });
            }
            
            // Attach the decoded data (e.g., user id) to req.user for use in controllers
            req.user = decodedPayload; 
            next();
        });
    } else {
        // No Authorization header present
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
};