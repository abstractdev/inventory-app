const Product = require("../models/product");
const Category = require("../models/category");
const Brand = require("../models/brand");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Products.
exports.product_list = function (req, res) {
  // res.send("NOT IMPLEMENTED: Product list");
  Product.find({}, "name")
    .sort([["name", "ascending"]])
    .exec(function (err, list_products) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("product_list", {
        title: "Products",
        product_list: list_products,
      });
    });
};

// Display detail page for a specific Product.
exports.product_detail = function (req, res, next) {
  async.parallel(
    {
      product: function (callback) {
        Product.findById(
          req.params.id,
          "name flavor description form servings serving_size weight quantity strength price"
        ).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("product_detail", {
        title: results.product.name,
        product_details: results.product,
      });
    }
  );
};

// Display Product create form on GET.
exports.product_create_get = function (req, res, next) {
  // Get all products and categories, which we can use for adding to our product.
  async.parallel(
    {
      products: function (callback) {
        Product.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
      brands: function (callback) {
        Brand.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("product_form", {
        title: "Create Product",
        products: results.products,
        categories: results.categories,
        brands: results.brands,
        post: false,
      });
    }
  );
};

// Handle Product create on POST.
exports.product_create_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 2 }).escape(),
  body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("flavor").trim().escape(),
  body("description", "description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("form", "form must not be empty").trim().isLength({ min: 1 }).escape(),
  body("servings", "servings must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("serving_size", "serving_size must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("weight", "weight must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("quantity", "quantity must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("strength").trim().escape(),
  body("price", "price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      flavor: req.body.flavor,
      description: req.body.description,
      form: req.body.form,
      servings: req.body.servings,
      serving_size: req.body.serving_size,
      weight: req.body.weight,
      quantity: req.body.quantity,
      strength: req.body.strength,
      price: req.body.price,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all products and categories for form.
      async.parallel(
        {
          products: function (callback) {
            Product.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
          brands: function (callback) {
            Brand.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          res.render("product_form", {
            title: "Create Product",
            products: results.products,
            categories: results.categories,
            product: product,
            errors: errors.array(),
            brands: results.brands,
            post: true,
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save product.
      product.save(function (err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new product record.
        res.redirect(product.url);
      });
    }
  },
];
// Display Product delete form on GET.
exports.product_delete_get = function (req, res, next) {
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        res.redirect("/products");
      }
      // Successful, so render.
      res.render("product_delete", {
        title: "Delete Product",
        product_details: results.product,
      });
    }
  );
};

// Handle Product delete on POST.
exports.product_delete_post = function (req, res, next) {
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.body.productid).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Product has no products. Delete object and redirect to the list of categories.
      Product.findByIdAndRemove(
        req.body.productid,
        function deleteProduct(err) {
          if (err) {
            return next(err);
          }
          // Success - go to product list
          res.redirect("/products");
        }
      );
    }
  );
};

// Display Product update form on GET.
exports.product_update_get = function (req, res, next) {
  // Get product, brands and categories for form.
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.params.id)
          .populate("brand")
          .populate("category")
          .exec(callback);
      },
      brands: function (callback) {
        Brand.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected categories as checked.
      for (let i = 0; i < results.categories.length; i++) {
        for (let j = 0; j < results.product.category.length; j++) {
          if (
            results.categories[i]._id.toString() ===
            results.product.category[j]._id.toString()
          ) {
            results.categories[i].checked = "true";
          }
        }
      }
      res.render("product_form", {
        title: "Update Product",
        brands: results.brands,
        categories: results.categories,
        product_details: results.product,
        post: false,
      });
    }
  );
};

// Handle product update on POST.
exports.product_update_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("flavor").trim().escape(),
  body("description", "description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("form", "form must not be empty").trim().isLength({ min: 1 }).escape(),
  body("servings", "servings must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("serving_size", "serving_size must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("weight", "weight must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("quantity", "quantity must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("strength").trim().escape(),
  body("price", "price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      flavor: req.body.flavor,
      description: req.body.description,
      form: req.body.form,
      servings: req.body.servings,
      serving_size: req.body.serving_size,
      weight: req.body.weight,
      quantity: req.body.quantity,
      strength: req.body.strength,
      price: req.body.price,
      category:
        typeof req.body.category === "undefined" ? [] : req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all products and categories for form.
      async.parallel(
        {
          categories: function (callback) {
            Category.find(callback);
          },
          brands: function (callback) {
            Brand.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected categories as checked.
          for (let i = 0; i < results.categories.length; i++) {
            if (product.category.indexOf(results.categories[i]._id) > -1) {
              results.categories[i].checked = "true";
            }
          }
          res.render("product_form", {
            title: "Update Product",
            categories: results.categories,
            product: product,
            errors: errors.array(),
            brands: results.brands,
            post: true,
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Update the record.
      Product.findByIdAndUpdate(
        req.params.id,
        product,
        {},
        function (err, theproduct) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to product detail page.
          res.redirect(theproduct.url);
        }
      );
    }
  },
];
