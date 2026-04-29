const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization
   


        // // check token exist
        if (!header) {
            return res.status(401).json({
                status: false,
                message: "No token provided"
            });
        }

        // Extract Token

        const token = header.split(" ")[1];
         

        // verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user data
        req.user = decoded;
        next()   // got to controller
    }
    catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware