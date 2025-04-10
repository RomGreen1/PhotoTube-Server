import User from '../models/userSchema.js'


const createUser = async (username, password,displayname,email, gender, profileImg) => {

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        throw new Error('Username already taken');
    }
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail) {
        throw new Error('Email already taken');
    }
  
    const user = new User({ username, password, displayname,email ,gender, profileImg });
    await user.save();
    return user;
};
const updateUser = async (userId, updateData) => {
    // Fetch the current user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
        throw new Error('User not found');
    }

    // Check if the email is being updated and it's different from the current email
    if (updateData.email && updateData.email !== currentUser.email) {
        const existingEmail = await User.findOne({ email: updateData.email });

        if (existingEmail) {
            throw new Error('Email already taken');
        }
    }

    // Update the user
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return user;
};


const getUser = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        throw error;
    }
}


const deleteUser = async (userId) => {
    const result = await User.findByIdAndDelete(userId);
    return result;
};

async function login(username, password) {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return null; // No user found with this username
        }

        // Directly compare the provided password with the stored password
        const isPasswordMatch = (password === user.password);
        if (isPasswordMatch) {
            return user;
        }
        else {
            return null;
        }

    } catch (error) {
        console.error('Error checking username and password:', error);
        return null; 
    }
}

const isExist = async (username) => {
   
    const userExists = await User.findOne({ username }).exec();
    return userExists; 
};

export default { createUser, getUser, login, isExist, updateUser, deleteUser }