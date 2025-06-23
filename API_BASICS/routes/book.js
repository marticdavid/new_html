const express = require("express");
const router = express.Router();

//import prisma
const prisma = require("../lib/prisma");

//get auth middleware
const authProtect = require("../middleware/auth");
const { number } = require("joi");

//create a book
router.post("/create", authProtect, async (req, res, next) => {
  try {
    const { title, description, price, author, categoryId } = req.body;
    const { sub, email } = req.user;

    //create a book on database
    const book = await prisma.book.create({
      data: {
        title: title,
        description: description,
        priceRequest: price,
        author: author,
        category: {
          connect: {
            id: Number(categoryId),
          },
        },
        user: {
          connect: {
            id: Number(sub),
          },
        },
      },
    });

    //send back response
    return res.status(200).json({
      message: "book created successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
});

// get all books
router.get("/", authProtect, async (req, res, next) => {
  try {
    const { sub, email } = req.user;

    const books = await prisma.book.findMany({
      where: {
        userId: Number(sub),
      },
    });
    return res.status(200).json({
      message: "books sent successfully",
      books,
    });
  } catch (error) {
    next(error);
  }
});

//get one book
router.get("/:bookId", authProtect, async (req, res, next) => {
  try {
    const { bookId } = req.params;

    console.log(bookId);
    const book = await prisma.book.findUnique({
      where: {
        id: Number(bookId),
        userId: Number(req.user.sub),
      },
    });
    return res.status(200).json({
      message: "book sent successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
});

//update a book
router.put("/update/:bookId", authProtect, async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { title, description, price, author } = req.body;

    const book = await prisma.book.update({
      where: {
        id: Number(bookId),
      },
      data: {
        title: title,
        description: description,
        priceRequest: price,
        author: author,
      },
    });
    return res.status(200).json({
      message: "book updated sucessfully",
      book,
    });
  } catch (error) {
    next(error);
  }
});

//     //delete a book
router.delete("/delete/:bookId", authProtect, async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await prisma.book.delete({
      where: {
        id: Number(bookId),
        userId: Number(req.user.sub)
      },
    });

    return res.status(200).json({
      message: "book deleted successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
