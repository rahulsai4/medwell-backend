const User = require("../models/User");

const updateUser = async (req, res) => {
    const userId = req.params.id;
    
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      });

    if(!updatedUser){
      res.status(404).json({err: "user not found."})
    }
      
    res.status(200).json({message: 'User updated successfully', updatedUser});

}

module.exports = {updateUser};