const User = require(`../models/User`);
const Token = require(`../models/Token`);
const {StatusCodes} = require(`http-status-codes`);
const customErrors = require(`../errors`);
const {sendVerificationEmail, sendSingerRequestEmail} = require(`../utils`);
const crypto = require(`crypto`);
const cloudinary = require("cloudinary").v2;
const fs = require(`fs`);
// const {upload} = require(`../utils/multerConfig`);

const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.status(StatusCodes.OK).json({users});
};

const getSingleUser = async (req, res) => {
    const {id} = req.params;
    // if(req.users.role !== `admin`) {
    //     throw new customErrors.UnauthenticatedError("You are not allowed to access this route");
    // }
    if(!id) {
        throw new customErrors.BadRequestError("Please provide id");
    }
    const user = await User.findOne({_id: id});
    if(!user) {
        throw new customErrors.notFoundError("No user registered with the given id");
    }
    res.status(StatusCodes.OK).json({user});
};

const updateUser = async (req, res) => {
    const userId = req.user.userId;
    const {name, email, phone, image} = req.body;
    if(!name && !email && !phone && !image) {
        throw new customErrors.BadRequestError("Please provide at least one credential");
    }
    const user = await User.findOne({_id: userId});
    if(!user) {
        throw new customErrors.notFoundError("No user found");
    }
    if(name) {
        user.name = name;
    }
    if(phone) {
        user.phone = phone;
    }
    if(image) {
        if(user.image !== `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713210224/Music-World/Profile-Images/awdbqsqikk5mqxliclws.webp`) {
            function getImagePublicId(cloudinaryUrl) {
                const parts = cloudinaryUrl.split("/");
                const publicIdPart = parts[parts.length - 1].split(".")[0];
                return publicIdPart;
            }

            const cloudinaryUrl = user.image;
            const imagePublicId = getImagePublicId(cloudinaryUrl);

            console.log(imagePublicId);

            await cloudinary.api
            .delete_resources([`Music-World/Profile-Images/${imagePublicId}`], {
                type: "upload",
                resource_type: "image",
            })
            .then((result) => {
                // console.log("Deleted resources:", result);
            })
            .catch((error) => {
                console.error("Error deleting resources:", error);
            });
        }
        user.image = image;
    }
    await user.save();
    if(email) {
        const user = await User.findOne({_id: userId});
        user.email = email;
        user.isVerified = false;
        const verificationToken = crypto.randomBytes(40).toString(`hex`);
        user.verificationToken = verificationToken;
        const origin = `http://localhost:5000`;
        await sendVerificationEmail({
            email: user.email,
            name: user.name,
            verificationToken: verificationToken,
            origin,
        });
        await user.save();

        // logout the user
        await Token.findOneAndDelete({ user: req.user.userId });
        res.cookie(`accessToken`, `AccessTokenLogout`, {
            httpOnly: true,
            expiresIn: new Date(Date.now()),
        });
        res.cookie(`refershToken`, `RefreshTokenDelete`, {
            httpOnly: true,
            expiresIn: new Date(Date.now()),
        });
        return res.status(StatusCodes.OK).json({msg: "Please verify your email id"});
    }
    res.status(StatusCodes.OK).json({msg: "Profile updated successfully"});
};

const updatePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) {
        throw new customErrors.BadRequestError("Please provide old password and new passwords");
    }
    const userId = req.user.userId;
    const user = await User.findOne({_id: userId});
    if(!user) {
        throw new customErrors.notFoundError("No user found");
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect) {
        throw new customErrors.UnauthenticatedError("Wrong password");
    }
    
    console.log(user.password, newPassword);
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg: "Password updatedsuccessfully"});
}

const deleteUser = async (req, res) => {
    const userId = req.user.userId;
    let user = await User.findOne({ _id: userId });
    if (!user) {
        throw new customErrors.NotFoundError("No user found");
    }
    const userImage = user.image;

    user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
        throw new customErrors.NotFoundError("No user found");
    }

    if(userImage !== `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713210224/Music-World/Profile-Images/awdbqsqikk5mqxliclws.webp`) {
      // console.log("Inside deleting");

      function getImagePublicId(cloudinaryUrl) {
        const parts = cloudinaryUrl.split("/");
        const publicIdPart = parts[parts.length - 1].split(".")[0];
        return publicIdPart;
      }

      const cloudinaryUrl = user.image;
      const imagePublicId = getImagePublicId(cloudinaryUrl);

      console.log(imagePublicId);

      await cloudinary.api
        .delete_resources([`Music-World/Profile-Images/${imagePublicId}`], {
          type: "upload",
          resource_type: "image",
        })
        .then((result) => {
          // console.log("Deleted resources:", result);
        })
        .catch((error) => {
          console.error("Error deleting resources:", error);
        });
    }

  res.status(StatusCodes.OK).json({ msg: "User deleted successfully" });
};

const imageUpload = async (req, res) => {
    if (!req.files || !req.files.image || !req.files.image.tempFilePath) {
        throw new customErrors.BadRequestError("Invalid file upload request");
    }
    const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath, {
        use_filename: true,
        folder: "Music-World/Profile-Images",
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
}

const becomeSinger = async (req, res) => {
    const {bio} = req.body;
    console.log(bio);
    const { audioFiles } = req.files;
    console.log(audioFiles);
    if(!bio) {
        throw new customErrors.BadRequestError(`Please provide all credentials`);
    }
    const user = await User.findOne({_id: req.user.userId});
    const name = req.body.name || user.name;
    const subject = "Request To Join as Singer";
    const origin = "http://localhost:5000";
    const verificationToken = crypto.randomBytes(40).toString(`hex`);
    user.verificationToken = verificationToken;
    await sendSingerRequestEmail({ email: user.email, subject: subject, name: user.name, verificationToken: user.verificationToken, audioFiles, origin });
    res.status(StatusCodes.OK).json({msg: 'Email sent successfully'});
}

const favoriteGenres = async (req, res) => {
    const user = await User.findOne({_id: req.user.userId});
    if(!user) {
        throw new customErrors.notFoundError("No user found");
    }
    const { genre } = req.body;
    if(genre.length === 0) {
        throw new customErrors.BadRequestError("Please choose at least one genre");
    }
    let mySet = new Set([...(user.favoriteGenres || []), ...genre]);
    user.favoriteGenres = [...mySet];
    await user.save();
    return res.status(StatusCodes.OK).json({message: "Favorite genres updated successfully"});
}

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    updatePassword,
    imageUpload,
    becomeSinger,
    favoriteGenres,
};