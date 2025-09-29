/*const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String,
            required: true,
     },
    email: { type: String,
             required: true,
             unique: true,
     },
    password: { type: String,
                required: true 
     },
    role: { type: String,
            enum: ['user', 'admin'],
            default: 'user'
     },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); */
//////////////////////////////////////////////////////////
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
      isActive: {
        type: Boolean,
        default: true
    },
    // author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
/*
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
*/