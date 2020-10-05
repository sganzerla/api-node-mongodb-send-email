import User from './../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import authConfig from './../../config/auth.js';
import sgMail from '@sendgrid/mail';

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

export async function forgout(req, res) {
    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).send({ error: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: 'alisson.sganzerla@gmail.com', // Change to your verified sender
            subject: 'Recuperação login',
            html: `Para recuperar seu login utilize retorne o token <strong>"${token}"</strong>, o seu email e uma nova senha na requisição API auth/reset_password para recriar uma nova senha. Mas atenção, esse token tem validade até ${now}.`,
        }
        sgMail
            .send(msg)
            .then(() => {
                return res.status(200).send('Email sent');
            })
            .catch((error) => {
                return res.status(200).send(error);
            })


    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error on forgout password, try again' });
    }
}

export async function reset(req, res) {
    const { email, token, password } = req.body;


    try {

        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user)
            return res.status(400).send({ error: 'User not found' });


        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' });

        const now = new Date();

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new' });

        user.password = password;

        await user.save();

        res.send();

    } catch (error) {

    }
}