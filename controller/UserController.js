import User from "../model/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {

    static insert_user = async (req, res) => {
        try {
            const { fname, lname, email, password, cpassword, phone, role } = req.body;
    
            // Check if all required fields are provided
            if (!fname || !lname || !email || !password || !cpassword || !phone) {
                return res.status(400).json({ message: "All fields are required", success: false });
            }
    
            // Validate password and confirm password match
            if (password !== cpassword) {
                return res.status(400).json({ message: "Passwords do not match", success: false });
            }
    
            // Check if the email is already registered
            const user = await User.findOne({ email });
            if (user) {
                return res.status(409).json({ message: "This email ID already exists", success: false });
            }
    
          
            const hashPassword = await bcrypt.hash(password, 10);
    
            
           const newuser = new User({
                fname: fname.trim(),
                lname: lname.trim(),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                role:  role || 'user',
                password: hashPassword,  
                cpassword: hashPassword,
            });
    
            await newuser.save(); 
            res.status(201).json({ message: "User registered successfully", success: true });
    
        } catch (error) {
            console.log(error)
            if (error.name === 'ValidationError') {
                const errors = {};
                Object.keys(error.errors).forEach((field) => {
                    errors[field] = error.errors[field].message; 
                });
                return res.status(400).json({ message: "Validation failed", errors });
            }

            if (error.code === 11000) { 
                return res.status(409).json({ message: 'Email already exists' });
            }
    
            res.status(500).json({ message: 'Server error' });
        }
    };

    static login_user = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate that both email and password are provided
            if (!email || !password) {
                return res.status(400).json({ message: 'All fields are required', success: false });
            }

            // Find the user by email
            let user = await User.findOne({ email: email.trim() });

            // Check if the user exists
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password", success: false });
            }

            // Check if the provided password matches the stored password
            const matchPassword = await bcrypt.compare(password.trim(), user.password);
            if (!matchPassword) {
                return res.status(401).json({ message: "Invalid email or password", success: false });
            }

            //Json Web token
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_TOKEN, { expiresIn: '1h' });

            // Login success
            res.status(200).json({ message: "User logged in successfully", success: true, user, token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error", success: false });
        }
    }

    static logout_user = async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: "Logout Successfully!", success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

};

export default UserController;
