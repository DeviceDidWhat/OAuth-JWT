const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed });

        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid Password' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/api/auth/refresh',
            })
            .json({ accessToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'No token' });

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token)
            return res.status(403).json({ message: 'Invalid token' });

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        user.refreshToken = newRefreshToken;
        await user.save();

        res
            .cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/api/auth/refresh',
            })
            .json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
        const token = req.cookies.refreshToken;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
        }
        res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.callback = async (req, res) => {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/api/auth/refresh',
    });

    // Send access token to frontend
    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`);
}

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};