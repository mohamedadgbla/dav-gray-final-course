const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user-profile-pictures",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

const upload = multer({
  storage
});

module.exports = upload;


//  this is used without a file upload, but if you want to use cloudinary, you can uncomment the code below and use it instead of the local storage.
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "user-profile-pictures",
//     allowed_formats: ["jpg", "jpeg", "png", "webp"]
//   }
// });

// const upload = multer({
//   storage
// });

// module.exports = upload;

//////////////////   using folder storage for local storage, but you can use cloudinary instead by uncommenting the code above and commenting out the code below.  ///////////////////////

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);

//     cb(
//       null,
//       uniqueName + path.extname(file.originalname)
//     );
//   }
// });

// const upload = multer({
//   storage
// });

// module.exports = upload;