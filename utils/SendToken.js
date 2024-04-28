const sendToken = (User, statusCode, res) => {
    try {
        const token = User.getJwtToken();
        console.log(User.getJwtToken); // This should be User.getJwtToken()
        console.log(token);

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly:true,
            sameSite: "none", // Add a value for sameSite
            secure: true,
        };
    
        res.status(statusCode).cookie("token", token, options).json({
            success: true,
            User,
            token,
        });
    } catch (error) {
        console.error("Error in sending token:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = sendToken;
