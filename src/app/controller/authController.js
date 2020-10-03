import User from './../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authConfig from './../../config/auth.js';

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

export async function store(req, res) {

    const { email } = req.body;


    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' });

        const user = await User.create(req.body);

        user.password = undefined;
        return res.send(
            {
                user,
                token: generateToken({ id: user.id }),
            });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
}

export async function login(req, res) {

    const { email, password } = req.body;

    const user = await User.findOne({ email })
        .select('+password'); // inclui prop password no obj retornado

    if (!user)
        return res.status(400).send({ error: 'User not found' });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' })

    // retorna password vazio para o usuário
    user.password = undefined;

    return res.send({
        user,
        token: generateToken({ id: user.id })
    });
}