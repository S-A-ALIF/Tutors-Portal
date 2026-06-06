import {createUserService, getAllUsersService, 
        getUserByIdService, updateUserService, 
        deleteUserService } from "../models/userModel";

const handleResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        data
    });
};

export const createUser = async (req, res, next) => {
    const {name, email} = req.body;
    try {
        const newUser = await createUserService({name, email});
        handleResponse(res, 201, 'User created successfully', newUser);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await getUserByIdService(id);
        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, "User retrieved successfully", user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const { name, email } = req.body; 
    const updatedUser = await updateUserService(req.params.id, name, email);
    if (!updatedUser) {
        return handleResponse(res, 404, 'User not found');
    }
    handleResponse(res, 200, "User updated successfully", updatedUser);
};

export const deleteUser = async (req, res, next) => {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) {
        return handleResponse(res, 404, 'User not found');
    }
    handleResponse(res, 200, "User deleted successfully", deletedUser);
};
