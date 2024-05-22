const {createTokenUser, attachCookiesToResponse, sendVerificationEmail, sendResetPasswordEmail, createHash} = require(`../utils`);
const crypto = require(`crypto`);
const {StatusCodes} = require(`http-status-codes`);
const Token = require(`../models/Token`);
const User = require(`../models/User`);
const customErrors = require(`../errors`);

const register = async (req, res) => {
  //  unique email check if done in controller, not to be done if not in UserSchema
  const { email, name, password, phone } = req.body; //  we want the role not to be sent rest all to be sent here, so extract
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new customErrors.BadRequestError(`Email is already registered`);
  }

  //  one way can be to make First user as admin
//   const isFirstAccount = (await User.countDocuments({})) === 0;
//   const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, phone });
  const tokenUser = createTokenUser(user);

  // console.log(tokenUser);
  attachCookiesToResponse({ res, user: tokenUser });
  
  return res.status(StatusCodes.CREATED).json({ user: tokenUser /*token*/ });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customErrors.BadRequestError(`Please provide email and password`);
  }

  // console.log(password);

  const user = await User.findOne({ email });
  if (!user) {
    throw new customErrors.UnauthenticatedError(
      `No user registered with email ${email}`
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);
  // console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new customErrors.UnauthenticatedError(`Wrong password`);
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie(`token`, "logout", {
    httpOnly: true,
    expires: new Date(Date.now() /*+ 5*1000*/),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

// const register = async (req, res) => {
//     const {name, email, password, phone} = req.body;
//     if(!name || !email || !password || !phone) {
//         throw new customErrors.BadRequestError(`Please fill out all the credentials`);
//     }

//     const verificationToken = crypto.randomBytes(40).toString(`hex`);
//     const user = await User.create({ name, email, password, phone, verificationToken });
//     const origin = `http://localhost:5000`;

//     await sendVerificationEmail({ email: user.email,  name: user.name, verificationToken: user.verificationToken, origin });
//     res.status(StatusCodes.CREATED).json({ msg: `Success!! Please verify your email account` });
// };

// const login = async (req, res) => {
//     const { email, password } = req.body;
//     if(!email || !password) {
//         throw new customErrors.BadRequestError(`Please provide all the credentials`);
//     }
//     const user = await User.findOne({ email: email });
//     if(!user) {
//         throw new customErrors.UnauthenticatedError(
//             `No user registered with email ${email}`
//         );
//     }
//     const isPasswordCorrect = await user.comparePassword(password);
//     if(!isPasswordCorrect) {
//         throw new customErrors.UnauthenticatedError("Wrong password");
//     }
//     if(!user.isVerified) {
//         throw new customErrors.UnauthenticatedError(`Your email has not been verified yet`);
//     }

//     const tokenUser = createTokenUser(user);
//     let refreshToken = ``;

//     const existingToken = await Token.findOne({ user: user._id });
//     if(existingToken) {
//         console.log("existing token is present");
//         const { isValid } = existingToken;
//         if (!isValid) {
//         throw new customErrors.UnauthenticatedError(
//             "Your account has been banned"
//         );
//         }
//         refreshToken = existingToken.refreshToken;
//         attachCookiesToResponse({ res, user: tokenUser, refreshToken });
//         res.status(StatusCodes.OK).json({ user: tokenUser });
//         return;
//     }

//     refreshToken = crypto.randomBytes(40).toString(`hex`);
//     const userAgent = req.headers['user-agent'];
//     const ip = req.ip;
//     const userToken = {refreshToken, ip, userAgent, user: user._id};

//     await Token.create(userToken);
//     attachCookiesToResponse({res, user: tokenUser, refreshToken});
//     res.status(StatusCodes.OK).json({ user: tokenUser });
// };

// const verifyEmail = async (req, res) => {
//     console.log("in verify email");
//     const { token: verificationToken, email } = req.query;
//     console.log(verificationToken);
//     const user = await User.findOne({ email });
//     if (!user) {
//         throw new customErrors.UnauthenticatedError(`Verification Failed`);
//     }
//     if(user.verificationToken !== verificationToken) {
//         throw new customErrors.UnauthenticatedError(
//             `Verification Failed -> user.verificationToken !== verificationToken`
//         );
//     }
//     user.isVerified = true;
//     user.verified = Date.now();
//     user.verificationToken = ``;

//     await user.save();
//     res.status(StatusCodes.OK).json({ msg: `Email Verified` });
// };

const verifyEmail = async (req, res) => {
    const { token: verificationToken, email } = req.query;
    const user = await User.findOne({ email });
    // console.log(verificationToken, email);
    if (!user) {
    throw new customErrors.UnauthenticatedError("Verification Failed");
    }
    if (user.verificationToken !== verificationToken) {
    throw new customErrors.UnauthenticatedError(
        "Verification Failed -> user.verificationToken !== verificationToken"
    );
    }
    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = "";

    await user.save();
    res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new customErrors.BadRequestError("Please provide email ID");
  }
  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const origin = "http://localhost:5000";

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;

    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `Please check your email for reset password link` });
};

const resetPassword = async (req, res) => {
  const { email, token } = req.query;
  const { password } = req.body;
  if (!email || !token || !password) {
    throw new customErrors.BadRequestError(`Please provide all the values`);
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({ msg: "Password changed successfully" });
};

// const logout = async (req, res) => {
//     await Token.findOneAndDelete({ user: req.user.userId });
//     res.cookie(`accessToken`, `AccessTokenLogout`, {
//         httpOnly: true,
//         expiresIn: new Date(Date.now()),
//     });
//     res.cookie(`refershToken`, `RefreshTokenDelete`, {
//         httpOnly: true,
//         expiresIn: new Date(Date.now()),
//     });
//     res.status(StatusCodes.OK).json({ msg: `user logged out` });
// };

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  logout,
  verifyEmail,
};