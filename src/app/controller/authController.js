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
            html: `<strong>Para recuperar seu login utilize o token "${token}" na requisição API criando uma nova senha. Esse token tem validade até ${now}<strong>`,
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