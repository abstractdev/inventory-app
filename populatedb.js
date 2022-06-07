#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require("async");
const Category = require("./models/category");
const Brand = require("./models/brand");
const Product = require("./models/product");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const categories = [];
const brands = [];
const products = [];

function categoryCreate(name, cb) {
  const category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function brandCreate(name, cb) {
  const brand = new Brand({ name: name });

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function productCreate(
  name,
  category,
  brand,
  flavor,
  description,
  form,
  servings,
  serving_size,
  weight,
  quantity,
  strength,
  price,
  cb
) {
  productdetail = {
    name: name,
    category: category,
    brand: brand,
    flavor: flavor,
    description: description,
    form: form,
    servings: servings,
    serving_size: serving_size,
    weight: weight,
    quantity: quantity,
    strength: strength,
    price: price,
  };

  const product = new Product(productdetail);
  product.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Product: " + product);
    products.push(product);
    cb(null, product);
  });
}

function createCategoryBrand(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate("Vitamins", callback);
      },
      function (callback) {
        categoryCreate("Herbs", callback);
      },
      function (callback) {
        categoryCreate("Food", callback);
      },
      function (callback) {
        categoryCreate("Drinks", callback);
      },
      function (callback) {
        categoryCreate("Protein", callback);
      },
      function (callback) {
        categoryCreate("Performance", callback);
      },
      function (callback) {
        brandCreate("Solgar", callback);
      },
      function (callback) {
        brandCreate("Plnt", callback);
      },
      function (callback) {
        brandCreate("Quest Nutrition", callback);
      },
      function (callback) {
        brandCreate("Labrada Nutrition", callback);
      },
      function (callback) {
        brandCreate("Bang Energy", callback);
      },
      function (callback) {
        brandCreate("Optimum Nutrition", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createProducts(cb) {
  async.parallel(
    [
      function (callback) {
        productCreate(
          "Vitamin A",
          [categories[0]],
          brands[0],
          null,
          "Solgars Dry Vitamin A Tablets are free of yeast, wheat, soy, gluten and dairy products and are formulated without the use of artificial preservatives, flavors or colors.",
          "tablet",
          100,
          "1 tablet",
          5,
          7,
          "10,000 IU",
          7.59,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Vitamin B-12",
          [categories[0]],
          brands[0],
          null,
          "Vitamin B12 is part of a group of essential nutrients known as the B Complex. It supports energy metabolism and promotes a healthy nervous system. Along with Folic Acid and Vitamin B6, it supports heart health by promoting healthy levels of homocysteine. B12 is required for the normal development and regeneration of red blood cells, which help to deliver oxygen throughout the body. In addition, B12 is involved in DNA synthesis and renewal.",
          "capsule",
          100,
          "1 capsule",
          5,
          8,
          "500 MCG",
          9.88,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Vitamin C",
          [categories[0]],
          brands[0],
          null,
          "Vitamin C is a water soluble viatmin that helps fight free radicals which can lead to oxidatitive stress and the premature aging of cells. One of its primary functions is collagen formation, which is important for healthy nails, skin, hair, and joints. Vitamin C also plays an essential role in the fuctioning of white blood cells which are vital components of the immune system. It helps promote cardiavascular and respiratory health and is beneficial for healthy gums. Vitamin C is also helps regenerate Vitamin E, allowing Vitamin E's antioxidate properties to be maintained.",
          "capsule",
          100,
          "1 capsule",
          11,
          9,
          "1000 MCG",
          14.98,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Vitamin B-12",
          [categories[0]],
          brands[0],
          null,
          "Solgars Dry Vitamin A Tablets are free of yeast, wheat, soy, gluten and dairy products and are formulated without the use of artificial preservatives, flavors or colors.",
          "capsule",
          100,
          "1 capsule",
          5,
          10,
          "500 MCG",
          9.88,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Vitamin D",
          [categories[0]],
          brands[0],
          null,
          "Vitamin D is required to promote calcium absorption, which helps to maintain healthy bones and teeth. Vitamin D also supports a healthy immnue system, the health of the pancreas and supports the health of various tissues including breast, colon and prostate tissue. It may also support muscle strength in older adults. The natural Vitamin D3 in this product is the same form produced by the body when our skin is exposed to sunlight. As we age, our bodies produce this important nutrient less efficiently. This formulation offers advanced Vitamin D3 support in oil-based softgels to promote optimal absorption and assimilation.",
          "softgel",
          120,
          "1 softgel",
          6,
          10,
          "10,000 IU",
          15.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Omega 3 Fish Oil Concentrate",
          [categories[0]],
          brands[0],
          null,
          "This formulation provides a natural, concentrated source of the essential Omega 3 fatty acids EPA and DHA from deep-sea, cold-water fish. EPA and DHA support cardiovascular, joint and immune health. The fish oil in this formulation is tested for optimum purity. It undergoes molecular distillation to remove mercury and other harmful contaminants.",
          "softgel",
          40,
          "3 softgels",
          16,
          13,
          "3900 MG",
          15.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Turmeric",
          [categories[1]],
          brands[1],
          null,
          "Turmeric is a star both in and out of the kitchen. Thanks to its potent antioxidant content, this popular Indian spice is also a staple in ancient Ayurvedic medicine to promote healthy joints, neutralize cell-damaging free radicals, and support cardiovascular health.",
          "capsule",
          60,
          "1 capsule",
          8,
          16,
          "450 MG",
          21.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Ashwagandha",
          [categories[1]],
          brands[1],
          null,
          "If you're looking for a natural way to stress less look no further than plnt® Ashwagandha. This ancient herb has been trusted for millennia to promote relaxation and help the body adapt to stress as it naturally reduces cortisol levels.",
          "capsule",
          90,
          "1 capsule",
          8,
          20,
          null,
          19.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Milk Thistle",
          [categories[1]],
          brands[1],
          null,
          "Milk Thistle is a pretty and prickly plant that blooms in regions of Europe, Australia, North and South America, and the Mediterranean. It contains an antioxidant called silymarin, which is known to help protect your liver from damaging free radicals.",
          "capsule",
          90,
          "1 capsule",
          8,
          17,
          null,
          20.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Black Seed Oil",
          [categories[1]],
          brands[1],
          null,
          "Black Seed Oil is derived from the seeds of Nigella sativa, or black cumin plant. Native to eastern Europe and western Asia, this annual flowering plant contains antioxidants and essential fatty acids that are believed to promote natural immunity while protecting your cells from free radical damage.",
          "liquid capsule",
          45,
          "2 capsules",
          8,
          18,
          null,
          18.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Black Seed Oil",
          [categories[1]],
          brands[1],
          null,
          "Black Seed Oil is derived from the seeds of Nigella sativa, or black cumin plant. Native to eastern Europe and western Asia, this annual flowering plant contains antioxidants and essential fatty acids that are believed to promote natural immunity while protecting your cells from free radical damage.",
          "liquid capsule",
          45,
          "2 capsules",
          8,
          18,
          null,
          18.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Quest Peanut Butter Cups",
          [categories[2], categories[4]],
          brands[2],
          "Peanut Butter",
          "Satisfy your sweet tooth with 11g Protein Less than 1g Sugar 1g Net Carbs",
          "pack",
          12,
          "2 cups",
          18,
          24,
          null,
          29.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Quest Tortilla Style Protein Chips",
          [categories[2], categories[4]],
          brands[2],
          "Ranch",
          "Quest Nutrition is on a mission to make the foods you crave work for you not against you. Want a rich, zesty tortilla chip you can enjoy anytime? Lucky you! We made Quest® Ranch Tortilla Style Protein Chips to feed your flavor cravings. No added Soy ingredientsBaked. Never Fried. Gluten Free 19g Protein",
          "bag",
          8,
          "1 bag",
          18,
          24,
          null,
          18.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Quest Protein Bar",
          [categories[2], categories[4]],
          brands[2],
          "Lemon Cake",
          "To bring you a bar this healthy and tasty, we had to create a whole new process for making bars. Quest is so revolutionary, in fact, that we've filed a patent! That's why you won't see any other bar like it on the market. Quest Bars are the only bars that you can eat without feeling guilty!",
          "bar",
          12,
          "1 bar",
          26,
          27,
          null,
          29.98,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Quest Protein Cookie",
          [categories[2], categories[4]],
          brands[2],
          "Chocolate Chip",
          "Feed Your Cookie Cravings! Sometimes you just need to have a cookie. We get it, cravings are a real struggle. That's why we made Quest Protein Cookies: soft baked, sweet indulgences you can enjoy anytime. But you've read enough, reward yourself with a cookie. This cookie!",
          "cookie",
          12,
          "1 cookie",
          18,
          33,
          null,
          29.98,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Lean Body Protein Shake",
          [categories[3], categories[4]],
          brands[3],
          "Vanilla",
          "Lean Body® Ready-to-Drink shakes provide quick, delicious lean muscle nutrition for athletes with little time for preparing meals. Just twist open the re-sealable top and enjoy Lean Body®'s award-winning taste! Lean Body® satisfies your appetite, increases your energy levels, and makes you feel great. Use Lean Body® in conjunction with your exercise program to help you build lean muscle and burn fat.",
          "drink",
          12,
          "1",
          241,
          22,
          null,
          39.98,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Bang Energy Drink",
          [categories[3]],
          brands[4],
          "Raging Raspberry Hibiscus",
          "300mg Caffeine Essential Amino Acids Electrolytes CoQ10 Super Creatine No sugars, calories or carbs No artificial flavors or colors",
          "drink",
          12,
          "1 can",
          212,
          15,
          null,
          24.79,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Gold Standard 100% Whey Protein",
          [categories[4]],
          brands[5],
          "Vanilla",
          "Whey Protein Isolates are 90% pure protein by weight. They are the purest and most expensive form of whey protein that exists. That's why they are the first ingredients you read on the 100% of Whey Gold Standard label. By using Whey Protein Isolate as our primary protein source, we're able to pack 24 grams of the purest, muscle-building protein per serving, and a lot less of the fat, cholesterol, lactose, and other stuff that you can do without. There's no question this is the standard by which other whey proteins are measured.",
          "powder",
          29,
          "1 scoop",
          39,
          44,
          null,
          39.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Quest Protein Powder",
          [categories[4]],
          brands[2],
          "Peanut Butter",
          "NO ADDED SOY INGREDIENTS GLUTEN FREE",
          "powder",
          23,
          "1 scoop",
          26,
          36,
          null,
          34.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Micronized Creatine Powder",
          [categories[5]],
          brands[5],
          null,
          "Highly researched and well absorbed, creatine monohydrate has been shown to significantly boost muscle strength, power, and size during high-intesity activities.** Our Micronized Creatine Powder is made with Creapure™, a creatine monohydrate known for its exceptional purity and potency. It's also micronized (to make the particles smaller), so our powder mixes easier and stays suspended in liquid longer than other creatine supplements.",
          "powder",
          114,
          "1 teaspoon",
          24,
          25,
          null,
          38.99,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Gold Standard Pre-Workout",
          [categories[5]],
          brands[5],
          "Fruit Punch",
          "Highly researched and well absorbed, creatine monohydrate has been shown to significantly boost muscle strength, power, and size during high-intesity activities.** Our Micronized Creatine Powder is made with Creapure™, a creatine monohydrate known for its exceptional purity and potency. It's also micronized (to make the particles smaller), so our powder mixes easier and stays suspended in liquid longer than other creatine supplements.",
          "powder",
          30,
          "1 scoop",
          13,
          13,
          null,
          41.99,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategoryBrand, createProducts],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("success");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
