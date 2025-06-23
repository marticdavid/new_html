const config = require("config");

const express = require("express");
const app = express();
const port =  config.get("PORT") || 7000 ;
const cors = require("cors");

//cors
app.use(cors());

console.log(config.get("AppName"));

//body parser
app.use(express.json());

//import files
const category = require("./routes/category");
const user = require("./routes/user");
const profile = require("./routes/profile");
const book = require("./routes/book");
const auth = require("./routes/Auth");
//add this to your server.js for downloads

const path = require("path");
//serving of static asset to the client
app.use("/public", express.static(path.join(__dirname, "public")));
const error = require("./middleware/error");

//define main routes
app.use("/category", category);
app.use("/user", user);
app.use("/profile", profile);
app.use("/book", book);
app.use("/auth", auth);

//route
// app.get("/", (req, res) => res.status(200).json({ message: "Hello World!" }));

// //get all books
// app.get("/books", (req, res) => {
//   return res.status(200).json({
//     message: "books sent successfully",
//     books: [{ name: "book 1" }, { name: "book 2" }],
//   });
// });

// //post a book
// app.post("/books", (req, res) => {
//   console.log(req.body);

//   return res
//     .status(201)
//     .json({ message: `The book ${req.body.name} has been created` });
// });
// app.put("/books/:id", (req, res) => {
//   return res
//   .status(201)
//     .json({ message: `The book ${req.body.name} has been updated` });
//   });
// app.delete("/books/:id", (req, res) => {
//   return res
//     .status(201)
//     .json({ message: `The book ${req.body.name} has been deleted` });
// });

app.use(error);

app.listen(port, () => console.log(`Book app listening on port ${port}!`));
//body parser middleware
