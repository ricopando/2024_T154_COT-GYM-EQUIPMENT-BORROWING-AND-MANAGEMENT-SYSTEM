import users from '../model/user.js'; // Import the user data

// Get all users
const getUsers = (req, res) => {
    try {
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single user by ID
const getUser = (req, res) => {
    try {
        const user = users.find(u => u.id === req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new user
const createUser = (req, res) => {
    const newUser = { id: (users.length + 1).toString(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
    users.push(newUser); // Add new user to the array
    res.status(201).json(newUser);
};

// Update an existing user by ID
const updateUser = (req, res) => {
    try {
        const index = users.findIndex(u => u.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: "User not found" });
        }
        users[index] = { ...users[index], ...req.body, updatedAt: new Date() }; // Update user details
        res.status(200).json(users[index]);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error updating user" });
    }
};

// Delete a user by ID
const deleteUser = (req, res) => {
    try {
        const index = users.findIndex(u => u.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: "User not found" });
        }
        users.splice(index, 1); // Remove user from the array
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getUsers, getUser, createUser, updateUser, deleteUser };
