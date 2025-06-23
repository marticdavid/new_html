const express = require("express");
const router = express.Router();

//import prisma
const prisma = require("../lib/prisma");

//get auth middleware
const authProtect = require("../middleware/auth");
//get all books
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json({
      message: "categories sent successfully",
      categories,
    });
  } catch (error) {
    console.log(error)
  }
}); 

//get one category
router.get("/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
      },
    });
    if (!category) {
      return res.status(400).json({
        message: "category not found",
      });
    }

    return res.status(200).json({
      message: "category fetched successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
});

//create category
router.post("/create",authProtect, async (req, res) => {
  const { categoryName} = req.body;

  const category = await prisma.category.create({
    data: {
      name: categoryName,
    },
  });

  if (!category) {
    return res.status(400).json({
      message: "category not created",
    });
  }

  return res.status(200).json({
    message: "category created successfully",
  });
});



//update a category
router.put("/update",authProtect, async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;

    const category = await prisma.category.update({
      where: {
        id: Number(categoryId),
      },
      data: {
        name: categoryName,
      },
    });

    if (!category) {
      return res.status(400).json({
        message: "category not updated",
      });
    }

    return res.status(200).json({
      message: "category updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
  
});
//delete a category
router.delete("/delete",authProtect, async (req, res) => {
  const { categoryId } = req.body;

  const category = await prisma.category.delete({
    where: {
      id: Number(categoryId),
    },
  });

  if (!category) {
    return res.status(400).json({
      message: "category not deleted",
    });
  }

  return res.status(200).json({
    message: "category deleted successfully",
  });
});

module.exports = router;
