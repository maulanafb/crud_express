const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Product = require("./models/product");
const ErrorHandler = require("./ErrorHandler");
const { dir } = require("console");
mongoose
  .connect("mongodb://127.0.0.1:27017/db_express")
  .then(() => {
    console.log("Berhasil terkoneksi ke database db_express");
  })
  .catch((e) => {
    console.log(e);
  });
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send(`<a href='/products' style='margin: 0px auto; text-decoration: none'>
      ke halaman produk
    </a>`);
});

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}
app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "All" });
  }
});

app.get("/products/create", (req, res) => {
  res.render("products/create");
});

app.post(
  "/products",
  wrapAsync(async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/products/${product._id}`);
  })
);

app.get(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/show", { product });
  })
);

app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product });
  })
);

app.put(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    res.redirect(`/products/${product._id}`);
  })
);

app.delete(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  })
);

const validationHanlder = (err) => {
  err.status = 400;
  err.message = Object.values(err.errors).map((item) => item.message);
  return new ErrorHandler(err.message, err.status);
};
app.use((err, req, res, next) => {
  console.dir(err);
  if (err.name === "ValidationError") err = validationHanlder(err);
  if (err.name === "CastError") {
    err.status = 404;
    err.message = "Product not Found";
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
