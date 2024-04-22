import bcryptjs from 'bcryptjs';
import User from '../models/user.module.js';
import { errorhandler } from '../utils/error.js';
export const test = (req, res) => {
    res.json({
        message: 'API is working...'
    });
};

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorhandler(401, "You can update only your account"));
    }
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                fullName: req.body.fullName,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                location: req.body.location,
                profilePicture: req.body.profilePicture,
            },
        }, 
        {new: true}
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    } 
};


export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorhandler(401, "You can delete only your account"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json( "Account has been deleted...");
    } catch (error) {
        next(error);
    }
}