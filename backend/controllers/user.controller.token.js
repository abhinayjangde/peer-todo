// Alternative token-based login approach (no cookies)
export const loginWithToken = async (req, res) => {
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

        // Return token in response instead of setting cookie
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token, // Include token in response
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
