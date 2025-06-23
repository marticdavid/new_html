const express = require('express');
const router = express.Router();
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const config = require("config");
//import prisma to our app
const prisma = require("../lib/prisma");

//import joi
const userSchema = require("../joiSchema/userSchema")

router.post("/login", async (req, res, next) => {
 try {
   //user validation of input using joi
   const valResult = userSchema.loginVal.validate(req.body, {
     abortEarly: false,
   });
   if (valResult.error) {
     return res.status(400).send({
       errors: valResult.error.details,
     });
   }

   const { email, password } = req.body,
     user = await prisma.user.findUnique({
       where: {
         email: email,
       },
     });

   if (!user) {
     return res.status(400).json({
       message: "Authentication Error - user not found",
     });
   }

   //check if password is correct
   const isPasswordValid = await argon.verify(user.password, password);
   if (!isPasswordValid) {
     return res.status(400).json({
       message: "Authentication Error",
     });
   }

   //create a token
   const payLoad = {
     sub: user.id,
     email: user.email,
     isAdmin: user.isAdmin,
   };

   const jwtOptions = {
     expiresIn: 3600,
   };
   const token = jwt.sign(payLoad, config.get("jwtSecret"), jwtOptions);
   //send token to client
   return res.status(200).json({access_token: token});
 } catch (error) {
    next(error)
 }
});


module.exports = router;