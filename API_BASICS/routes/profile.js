const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path"); //used to extract the path of the uploaded file;

//import prisma
const prisma = require("../lib/prisma");

//get auth middleware
const authProtect = require("../middleware/auth");
const { profile } = require("console");

//Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatar"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Use a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Append extension;
  },
});
const upload = multer({ storage: storage });

// Endpoint for handling file uploads
router.post(
  "/upload",
  [authProtect],
  upload.single("image"), // Specify the field name for the uploaded file and it should be same as key in postman or frontend input in form
  async (req, res, next) => {
    console.log("running");
    console.log(req.file);
    try {
      const { destination, filename } = req.file;
      const profile = await prisma.profile.update({
        where: {
          userId: Number(req.user.sub),
        },
        data: {
          avatar: `${destination}/${filename}`,
        },
      });
      // Store full URL instead of local path
      const profileImage = `${req.protocol}://${req.get("host")}/${
        profile.avatar
      }`;

      return res.status(200).json({
        message: "profile fetched successfully",
        profile: {
          ...profile,
          avatar: profileImage,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

//get all profile
router.get("/", authProtect, async (req, res) => {
  try {
    const { sub } = req.user;

    const profiles = await prisma.profile.findFirst({
      where: {
        userId: Number(sub),
      },
    });
    if (!profiles) {
      return res.status(400).json({
        message: "profile not found",
      });
    }
    
    return res.status(200).json({
      message: "profile fetched successfully",
     profiles,
    });
  } catch (error) {
    console.log(error);
  }
});
// //get one profile
// router.get("/getOne/:profileId", async (req, res) => {
//      try {
//     const { profileId } = req.params;

//     const profile = await prisma.profile.findFirst({
//       where: {
//         id: Number(profileId),
//       },
//     });

//     return res.status(200).json({
//       message: "profile fetched successfully",
//       profile,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

//update a profile
router.put("/update", authProtect, async (req, res, next) => {
  const { bio } = req.body;
  const profiles = await prisma.profile.findUnique({
    where: {
      userId: Number(req.user.sub),
    },
  });
  if (!profiles) {
    return res.status(400).json({
      message: "profile not found",
    });
  }

  const updatedProfile = await prisma.profile.update({
    where: {
      id: Number(profiles.id),
      userId: Number(req.user.sub),
    },
    data: {
      bio: bio,
    },
  });
  if (!updatedProfile) {
    return res.status(400).json({
      message: "profile not updated",
    });
  }

  console.log("got here");
  return res.status(200).json({
    message: "profile updated successfully",
    updatedProfile,
  });
});

//delete a profile
// router.delete("/delete/:profileId",authProtect, async (req, res, next) => {
//   const { profileId } = req.params;
//   const profiles = await prisma.profile.delete({
//     where: {
//       id: Number(profileId),
//     },
//   });
//   return res.status(200).json({
//     message: "profile deleted successfully",
//     profiles,
//   });
// })

module.exports = router;
