const authService = require('../services/auth.service');

async function register(req, res) {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await authService.register(email, password, name);
        res.status(201).json(result);
    } catch (err) {
        if (err.message === 'User already exists') {
            return res.status(409).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await authService.login(email, password);
        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
}

async function googleLogin(req, res) {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Google token is required' });
    }

    try {
        const result = await authService.googleLogin(token);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Google authentication failed' });
    }
}

module.exports = {
    register,
    login,
    googleLogin,
};
