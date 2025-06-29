import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpiry:{
        type: Date
    }
}, { timestamps: true })

// middleware (hook)
userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

/* 
## Compare method (we had immplemented it in our controller)

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(this.password, password)
}
*/

const User = mongoose.model("User", userSchema)

export default User;