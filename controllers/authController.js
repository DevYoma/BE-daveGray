const User = require('../model/User'); 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if(!user || !pwd){
        return res.status(400).json({
            "message": "Username and Password are required"
        })
    }

    // FIND USER
    const foundUser = await User.findOne({ username: user }).exec();

    if(!foundUser) {
        return res.sendStatus(401); // Unauthorized
    }

    // evaluating password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){ 
        const roles = Object.values(foundUser.roles);
        // create JWTs(Access and Refresh tokens)
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                "username": foundUser.username,
                "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '30s' }
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        // saving RToken in the DB that allows us make a LOGOUT route that allows us to invalidate the RT when a user logs out

        // saving Refresh Token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, {
            httpOnly: true, 
            maxAge: 24 * 60 * 60 *1000, 
            sameSite: 'None',
            // secure: true, => Needed for chrome
        })
        
        res.json({ accessToken, roles })
    }else{
        res.sendStatus(401); // Unauthorized
    }
}

module.exports = { handleLogin };