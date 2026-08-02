import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'نام کاربر required است'],
        trim: true,
        minlength: [2, 'نام کاربر باید حداقل 2 کاراکتر باشد'],
        maxlength: [50, 'نام کاربر نمی‌تواند بیش از 50 کاراکتر باشد']
    },
    email: {
        type: String,
        required: [true, 'ایمیل required است'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'لطفا یک ایمیل معتبر وارد کنید']
    },
    password: {
        type: String,
        required: [true, 'رمز عبور required است'],
        minlength: [6, 'رمز عبور باید حداقل 6 کاراکتر باشد']
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    preferences: {
        language: {
            type: String,
            default: 'fa'
        },
        currency: {
            type: String,
            default: 'IRT'
        },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true }
        }
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// ایندکس برای جستجوی بهتر
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// متدهای instance
userSchema.methods.toSafeJSON = function() {
    const user = this.toJSON();
    delete user.password;
    return user;
};

userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

// متدهای static
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.getAdmins = function() {
    return this.find({ role: 'admin', isActive: true });
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
