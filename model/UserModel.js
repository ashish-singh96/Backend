import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "First name is required"], 
        trim: true,
        minlength: [2, "First name must be at least 2 characters long"], 
        maxlength: [50, "First name cannot exceed 50 characters"]
    },
    lname: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, 
        lowercase: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"] 
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Phone number must be 10 digits"] 
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    cpassword: {
        type: String,
        required: [true, "Confirm password is required"],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords do not match"
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"], 
        default: "user"
    }
});


const User = mongoose.model("User", userSchema);
export default User;
