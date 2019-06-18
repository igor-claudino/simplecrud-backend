const User = require('../models/User');
const authConfig = require('../config/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class UserService {
    async store(req, res) {
        const { username, cpf } = req.body;
        try {
            if (await User.findOne({ username }))
                return res.status(400).send({ error: 'User already exists' });

            if (cpf.length !== 11 || !/\d+/.test(cpf))
                return res.status(400).send({ error: 'Invalid CPF' });
            const user = await User.create(req.body);
            user.password = undefined;

            return res.send(
                {
                    user,
                    token: jwt.sign({ id: user.id }, authConfig.secret, {
                        expiresIn: 86400,
                    }),
                });
        } catch (err) {
            return res.status(400).send({ error: 'Registration failed: ' + err });
        }
    }

    async getAll(req, res) {
        const users = await User.find();
        return res.send(users);
    }

    async update(req, res) {
        const id = req.params.id;
        const { name, email, password, username, cpf } = req.body;
        try {
            let user = await User.findOne({ _id: id });
            if (!user)
                return res.status(400).send({ error: 'User not found' });

            if (cpf.length !== 11 || !/\d+/.test(cpf))
                return res.status(400).send({ error: 'Invalid CPF' });
            user.name = name;
            user.email = email;
            user.username = username;
            user.cpf = cpf;
            if (password && password !== '')
                user.password = password;
            user.save();
            return res.send(
                {
                    user
                });
        } catch (err) {
            return res.status(400).send({ error: 'Update failed: ' + err });
        }
    }

    async delete(req, res) {
        const id = req.params.id;
        try {
            const user = await User.findOne({ _id: id });
            if (!user)
                return res.status(400).send({ error: 'User not found' });

            await User.deleteOne({ _id: id });
            return res.sendStatus(200);
        } catch (err) {
            return res.status(400).send({ error: 'Delete failed: ' + err });
        }
    }

    async authenticate(req, res) {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).select('+password');

        if (!user)
            return res.status(400).send({ error: 'User not found' });

        if (!await bcrypt.compare(password, user.password))
            return res.status(401).send({ error: 'Invalid password' });

        user.password = undefined;

        res.send(
            {
                user,
                token: jwt.sign({ id: user.id }, authConfig.secret, {
                    expiresIn: 86400,
                }),
            });
    }
}

module.exports = new UserService();
