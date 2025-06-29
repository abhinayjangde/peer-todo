import crypto from "crypto"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendMail.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validating input
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    // 2. Validating password
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be greater than or equal to 6 characters"
        })
    }

    try {
        // 3. Check if user already exists
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // 4. Verification token 
        const token = crypto.randomBytes(32).toString("hex")
        const tokenExpiry = Date.now() + 10 * 60 * 60 * 1000; // 10 Minutes

        // 5. creating user
        const user = await User.create({
            name,
            email,
            password,
            verificationToken: token,
            verificationTokenExpiry: tokenExpiry
        })

        // 6. If user not created
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not created"
            })
        }
        
        const verificationUrl = `${process.env.BASE_URL}/api/v1/user/verify/${token}`
        // 7. Send verification email
        const message = `
            Thank you for registering! Please verify your eamil to complete your registration.
            
            ${verificationUrl}

            This veification link will expire in 10 minutes.
            If you did not create an account, please ignore this email.
            `
        await sendEmail(user.email, token, "Please verify your email", message)
        return res.status(201).json({
            success: true,
            message: "User created successfully. Please verify your email.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error("Error registering user: ", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }


}

export const verifyEmail = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired verification token"
        });
    }
    try {
        // 1. Find user by verification token
        const user = await User.findOne({ verificationToken: token, verificationTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }

        // 2. Verify user
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error("Error verifying email: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while verifying user email",
            error: error.message
        });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    // 1. Validate email and password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    try {
        // 2. find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            })
        }
        // 3. Checking that user is verified or not
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email"
            })
        }
        // 4. Match password
        const isMatched = await bcrypt.compare(password, user.password)

        if (!isMatched) {
            console.log("Password match status:", isMatched);
            return res.status(200).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        // 5. Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "2d"
        })

        const cookieOptions = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: "strict" // CSRF protection
        };

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error while login :", error);
        return res.status(500).json({
            success: false,
            message: "Error while login user",
            error: error.message
        });
    }
}

export const me = async (req, res) => {
    const user = req.user;

    try {

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile data fetched successfully",
            user
        })
    } catch (error) {
        console.log("Error in loggedin middleware ", error)
        return res.status(401).json({
            success: false,
            message: "Error while checking logged in",
            error: error.message
        })
    }
}

export const logout = async (req,res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Error while logging out user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while logging out user",
            error: error.message
        });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // 2. Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = resetToken;
        user.verificationTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // 3. Send reset email
        const resetUrl = `${process.env.BASE_URL}/api/v1/user/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`;

        await sendEmail(user.email, resetToken, "Reset Password", message);
        return res.status(200).json({
            success: true,
            message: "Reset password email sent successfully"
        });

    } catch (error) {
        console.error("Error in forgot password: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
        return res.status(400).json({
            success: false,
            message: "Token and password are required"
        });
    }

    // 2. Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be greater than or equal to 6 characters"
        });
    }

    try {
        // 1. Find user by reset token
        const user = await User.findOne({ verificationToken: token, verificationTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // 2. Update user's password (will be automatically hashed by pre-save hook)
        user.password = password;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Error in resetting password: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}