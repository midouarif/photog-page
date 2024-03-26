import User from "../models/user.module.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';


export const signup = async (req, res,next) => {
   const { username, email, password } = req.body;
   const hashedPassword = bcryptjs.hashSync(password, 10);
   const newUser = new User({username, email, password: hashedPassword});
   try {
    await newUser.save();
    res.status(201).json({message: "User created successfully!"});
   } catch (error) {
    next(error);
   }
}
export const signin = async (req, res, next) => {
   const { email, password } = req.body;
   try {
      const validUser = await User.findOne({email});
      if (!validUser) {
         return res.status(404).json({message: "User not found!"});
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
         return res.status(401).json({message: "Invalid password!"});
      }
      // generate token
      const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
      // to exclude password from the response
      const {password: hashedPassword, ...rest} = validUser._doc;
      // send token as cookie
      res.cookie('token', token, {httpOnly: true}).status(200).json({rest});
   } catch (error) {
      next(error);
   }
}
export default signup;

