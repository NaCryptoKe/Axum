const sendResetNotification = async (userEmail, token) => {
    const resetLink = `https://app.com/reset?token=${token}`;
    console.log(`[DEV] Password reset link for ${userEmail}: ${resetLink}`);
};

module.exports = { sendResetNotification };