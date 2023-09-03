const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd){
        return res.status(400).json({ 
            "message": "Username and password are required"
        })
    }

    // check for duplicate usernames in the DB
    // const duplicate = usersDB.users.find(person => person.username === user);
    const duplicate = await User.findOne({ username: user }).exec();
    if(duplicate){
        return res.sendStatus(409); // Conflict
    }
    try {
        // Create new user and use Bcrypt to encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // create and store the new user all at once
        const result = await User.create({
            "username": user, 
            // default role will be added automatically in the DB
            "password": hashedPwd, 
        })

        // OR
        // const newUser = new User();
        // newUser.username = user
        // const result = await newUser.save()

        console.log(result);
        
        res.status(201).json({
            "success": `New user ${user} created`
        })
    } catch (error) {
        res.status(500).json({
            "message": error.message
        })
    }
}

module.exports = { handleNewUser }

// check Dave's bcrypt link