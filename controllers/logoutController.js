const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On Client, also delete the accessToken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204) // No Content to send back
    const refreshToken = cookies.jwt;

    // is refreshToken in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None'})
        return res.sendStatus(204);
    }

    // deleting cookie
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) // secure true, only serves on https

    res.sendStatus(204) // all is well buh no content to send back
}

module.exports = { handleLogout };