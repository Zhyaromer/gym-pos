const verify = async (req, res) => {
    try {
        // The user information is already attached to req by the auth middleware
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        res.status(200).json({
            authenticated: true,
            employee: req.user
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = verify; 