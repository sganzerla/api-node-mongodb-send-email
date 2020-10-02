import User from './../models/user.js';

export async function store(req, res) {
    try {
        const user = await User.create(req.body);
        return res.send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
}