const express = require("express");
const router = express.Router();

//import prisma
const prisma = require("../lib/prisma");

//import auth middleware
const authProtect = require("../middleware/auth");

//import authAdmin middleware
const authAdmin = require("../middleware/authAdmin");

//import joi
const userSchema = require("../joiSchema/userSchema");

//import argon2
const argon2 = require("argon2");

//get users
router.get("/", [authProtect,authAdmin], async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({
      message: "users sent successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
});

//get one user
router.get("/getOne", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    return res.status(200).json({
      message: "user sent successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

//create a user account
router.post("/register", async (req, res) => {
  try {
    //user validation of input using joi
    const valResult = userSchema.userVal.validate(req.body, {
      abortEarly: false,
    });
    if (valResult.error) {
      return res.status(400).send({
        message: valResult.error.details,
      });
    }

    const pwdResult = userSchema.pwdVal.validate(req.body.password);
    if (pwdResult.error) {
      return res.status(400).send({
       message: pwdResult.error.details,
      });
    }

    const { name, email, password, userName} = req.body;

    //check if a user exists
    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    //hashing password
    const passwordHash = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        password: passwordHash,
        email: email,
        name: name,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "user not created",
      });
    }

    //create a profile
    const profile = await prisma.profile.create({
      data: {
        userId: Number(user.id),
        userName: user.name,
      },
    });

    if (!profile) {
      return res.status(400).json({
        message: "failed to creatye profile for ${user.email}",
      });
    }

    return res.status(200).json({
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error);
  }
});
//update a user
router.put("/update", async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    const user = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name,
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "user not updated",
      });
    }

    return res.status(200).json({
      message: "user updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

//delete a user
router.delete("/delete", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "user not deleted",
      });
    }

    return res.status(200).json({
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

//user login
router.post("/Login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "password does not match",
      });
    }

    return res.status(200).json({
      message: "user logged in successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
