const mongoose = require("mongoose");
const Product = require("./models/product");
mongoose
  .connect("mongodb://127.0.0.1:27017/db_express")
  .then(() => {
    console.log("Berhasil terkoneksi ke database db_express");
  })
  .catch((e) => {
    console.log(e);
  });

const seedProducts = [
  {
    name: "Kemeja Flanel",
    brand: "Hollister",
    price: 750000,
    color: "biru muda",
    category: "Baju",
  },

  {
    name: "Sweater",
    brand: "Gap",
    price: 650000,
    color: "merah muda",
    category: "Jaket",
  },

  {
    name: "Tas Ransel",
    brand: "Herschel",
    price: 1500000,
    color: "biru",
    category: "Aksesoris",
  },
  {
    name: "Kacamata Aviator",
    brand: "Ray-Ban",
    price: 2000000,
    color: "emas",
    category: "Aksesoris",
  },
  {
    name: "Baju Renang",
    brand: "Speedo",
    price: 500000,
    color: "biru tua",
    category: "Baju",
  },
  {
    name: "Topi Baseball",
    brand: "New Era",
    price: 350000,
    color: "hitam",
    category: "Aksesoris",
  },
  {
    name: "Rompi",
    brand: "Zara",
    price: 850000,
    color: "abu-abu",
    category: "Jaket",
  },
];

Product.insertMany(seedProducts)
  .then((r) => {
    console.log(r);
  })
  .catch((e) => {
    console.log(e);
  });
