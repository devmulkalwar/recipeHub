import bcrypt from 'bcrypt';

const saltRounds = 10;

// Function to hash a password
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

// Function to compare the provided password with the hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
