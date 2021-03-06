const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const fs = require("fs")
const bcrypt = require('bcryptjs');
const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        minLength: [3, "invalid firstName"]

    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required'],
        minLength: [3, "invalid lastName"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        minlength: [8, 'invalid password'],
        validate: {
            validator: function(v) {
                const reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                return reg.test(v);
            },
            message: '{VALUE} is not a valid password!'
        },
    },
    username: {
        type: String,
        trim: true,
        minlength: [5, 'invalid phone'],
        required: [true, 'Username is required'],
        unique: true
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'none'],
            message: '{VALUE} is not supported'
        },
        default: 'none',
        trim: true
    },
    avatar: {
        type: String,
        default: '/images/avatar/avatar.jpg'
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return validator.isMobilePhone(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    block: {
        default: false
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }]

}, { timestamps: true });
UserSchema.plugin(uniqueValidator, { message: 'this is already taken.' });

UserSchema.pre('save', function async(next) {
    const user = this._doc;
    if (this.isModified('password')) {
        const salt = bcrypt.genSalt(10);
        salt.then(salt => { return bcrypt.hash(user.password, salt); })
            .then(hash => { user.password = hash; return next(); })
            .catch(err => next(err));
    }
});
// UserSchema.pre(/^Delete/, function(next) {
//         fs.unlinkSync(path.join(__dirname, `../public`, this.avatar));
//     })
// UserSchema.pre('findOneAndUpdate', function async(next) {
//     const user = this._doc;
//     if (this.isNew || this.isModified('password')) {
//         const salt = bcrypt.genSalt(10);
//         salt.then(salt => { return bcrypt.hash(user.password, salt); })
//             .then(hash => { user.password = hash; return next(); })
//             .catch(err => next(err));
//     }
// });
// UserSchema.post('findOneAndUpdate', function async(next))

module.exports = mongoose.model('User', UserSchema);