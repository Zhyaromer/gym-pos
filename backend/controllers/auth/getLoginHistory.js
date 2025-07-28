const LoginTrack = require("./login_track");

const getLoginHistory = async (req, res) => {
    try {
        const { limit = 100 } = req.query;

        let loginHistory;

        loginHistory = await LoginTrack.getLoginHistory(parseInt(limit));

        res.status(200).json({
            success: true,
            data: loginHistory
        });

    } catch (error) {
        console.error('Error getting login history:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = getLoginHistory; 