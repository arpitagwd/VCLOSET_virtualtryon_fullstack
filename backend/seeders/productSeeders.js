// seedProducts.js

import mongoose from "mongoose";
import Product from "../modelsmongodb/Product.js";

const MONGO_URI =
  "mongodb://localhost:27017/vcloset";

const products = [
  {
    productId: "P001",
    name: "Black Hoodie",
    price: 599,
    description: "Stylish and comfortable black hoodie",
    category: "Unisex",
    size: ["S", "M", "L", "XL"],
    image: "/cloth-models/blackhoodietop.png",
    color: "Black",
  },

  {
    productId: "P002",
    name: "Black Trouser Pant",
    price: 800,
    description: "Comfortable black trouser for women",
    category: "Women",
    size: ["26", "28", "30", "32", "34", "36"],
    image: "/cloth-models/blacktrouserpant.png",
    color: "Black",
  },

  {
    productId: "P003",
    name: "Blue Shirt",
    price: 799,
    description: "Stylish blue shirt for casual wear",
    category: "Men",
    size: ["M", "L", "XL", "XXL"],
    image: "/cloth-models/bluecheckshirtmen.png",
    color: "Blue",
  },

  {
    productId: "P004",
    name: "Brown Cargo Pant",
    price: 999,
    description: "Relaxed fit cargo pant",
    category: "Unisex",
    size: ["26", "28", "30", "32", "36"],
    image: "/cloth-models/cargopant.png",
    color: "Brown",
  },

  {
    productId: "P005",
    name: "Grey T-Shirt",
    price: 389,
    description: "Comfortable t-shirt for normal use",
    category: "Men",
    size: ["S", "M", "L", "XL"],
    image: "/cloth-models/greytshirtmentop.png",
    color: "Grey",
  },

  {
    productId: "P006",
    name: "Black Cargo",
    price: 900,
    description: "Normal fit cargo pant for men",
    category: "Men",
    size: ["28", "30", "32", "34", "36"],
    image: "/cloth-models/menblackcargopant.png",
    color: "Black",
  },

  {
    productId: "P007",
    name: "Blue Jeans",
    price: 899,
    description: "Comfortable blue jeans for men",
    category: "Men",
    size: ["28", "30", "32", "34", "36"],
    image: "/cloth-models/menbluejeanspant.png",
    color: "Blue",
  },

  {
    productId: "P008",
    name: "Blue T-Shirt",
    price: 499,
    description: "100% cotton blue t-shirt for daily use",
    category: "Men",
    size: ["M", "L", "XL", "XXL"],
    image: "/cloth-models/menbluetshirt.png",
    color: "Blue",
  },

  {
    productId: "P009",
    name: "Summer Short Dress",
    price: 900,
    description: "Short and stylish summer dress for women",
    category: "Women",
    size: ["XS", "S", "M"],
    image: "/cloth-models/orangewhitesummershortdress.png",
    color: "Orange",
  },

  {
    productId: "P010",
    name: "Ruffeled Top",
    price: 799,
    description: "Stylish and beautiful ruffeled top for women",
    category: "Women",
    size: ["XS", "S", "M", "L"],
    image: "/cloth-models/womenruffeledtop.png",
    color: "Blue",
  },

  {
    productId: "P011",
    name: "Pink Top",
    price: 399,
    description: "Normal fit top for daily use",
    category: "Women",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "/cloth-models/womentop.png",
    color: "Pink",
  },

  {
    productId: "P012",
    name: "Grey Tshirt",
    price: 399,
    description: "Soft grey tshirt for casual everyday wear",
    category: "Men",
    size: ["S", "M", "L", "XL"],
    image: "/cloth-models/greytshirt men top.png",
    color: "Grey",
  },

  {
    productId: "P013",
    name: "Floral Blue Top",
    price: 499.99,
    description:
      "Fresh and vibrant women's top for your everyday look.",
    category: "Women",
    size: ["S", "M", "L", "XL"],
    image: "/cloth-models/womenruffeledtop.png",
    color: "Blue",
  },

  {
    productId: "P014",
    name: "Stylish Long Skirt",
    price: 1299.99,
    description:
      "Stylish skirt for women with aesthetic and modern feel.",
    category: "Women",
    size: ["S", "M", "L"],
    image: "/cloth-models/denimlong skirt pant.png",
    color: "Blue",
  },

  {
    productId: "P015",
    name: "Pink Floral Top",
    price: 399.99,
    description:
      "Stylish women's floral top made from breathable fabric.",
    category: "Women",
    size: ["S", "M", "L", "XL"],
    image: "/cloth-models/pinkflowered top.png",
    color: "Pink",
  },

  {
    productId: "P016",
    name: "Men Casual Trouser",
    price: 899.99,
    description:
      "Casual stylish trouser for men made from breathable fabric.",
    category: "Men",
    size: ["M", "L", "XL"],
    image: "/cloth-models/menblackcargo pant.png",
    color: "Black",
  },

  {
    productId: "P017",
    name: "Floral Dress",
    price: 699,
    description: "Elegant floral dress perfect for casual outings",
    category: "Women",
    size: ["S", "M", "L", "XL"],
    image: "/cloth-models/floraloffwhite longdress.png",
    color: "White",
  },

  {
    productId: "P018",
    name: "Red Dress",
    price: 699.99,
    description:
      "Modern short dress made from premium-quality fabric.",
    category: "Women",
    size: ["S", "M", "L", "XL"],
    image: "/cloth-models/redhighlow shortdress.png",
    color: "Red",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products Seeded Successfully");

    mongoose.connection.close();
  } catch (error) {
    console.log("Error:", error);
  }
};

seedDB();