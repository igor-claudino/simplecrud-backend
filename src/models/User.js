const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
}, {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    });

User.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

module.exports = mongoose.model('User', User);