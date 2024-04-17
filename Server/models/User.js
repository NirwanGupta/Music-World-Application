const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const validator = require(`validator`);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Provide your name"],
      maxlength: 30,
      minlength: 3,
    },
    password: {
      type: String,
      required: [true, "Enter your passwprd"],
      minlength: 8,
    },
    email: {
      type: String,
      required: [true, "Please provide valid email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
      unique: true,
    },
    phone: {
      type: String,
      required: [true, `Please provide a phone number`],
      validator: {
        validator: function (v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    role: {
      type: String,
      enum: [`user`, `admin`, `artist`],
      default: `user`,
    },
    verificationToken: String,
    image: {
      type: String,
      default: `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713210224/Music-World/Profile-Images/awdbqsqikk5mqxliclws.webp`,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre(`save`, async function () {
    if (!this.isModified(`password`)) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model(`User`, userSchema);
