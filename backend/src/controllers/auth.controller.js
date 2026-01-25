const authService = require('../services/auth.service');

async function register(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await authService.register(email, password);
        res.status(201).json(user);
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

module.exports = {
    register,
    login,
};
