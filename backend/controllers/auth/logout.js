const logout = async (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = logout; 