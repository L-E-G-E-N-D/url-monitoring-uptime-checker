const db = require('../db');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

async function register(email, password, name) {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
        [email, hashedPassword, name]
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '1h',
    });

    return { user, token };
}

async function login(email, password) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return null;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
    });

    return { user: { id: user.id, email: user.email }, token };
}

async function googleLogin(accessToken) {
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const { email, name, sub: googleId } = response.data;

    if (!email) {
        throw new Error('Could not retrieve email from Google');
    }

    let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userResult.rows[0];

    if (!user) {
        // Create user if they don't exist
        const result = await db.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, 'GOOGLE_AUTH', name]
        );
        user = result.rows[0];
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '1h',
    });

    return { user, token };
}

module.exports = {
    register,
    login,
    googleLogin,
};
