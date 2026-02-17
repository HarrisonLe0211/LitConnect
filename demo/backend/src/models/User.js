const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // Optional fields for "LinkedIn + Canvas" direction:
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    headline: { type: String, trim: true, maxlength: 120 },
    school: { type: String, trim: true, maxlength: 120 }
  },
  { timestamps: true }
);

// Hide passwordHash by default when converting to JSON
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);