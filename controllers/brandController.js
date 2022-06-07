const Brand = require("../models/brand");
const Product = require("../models/product");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Brands.
exports.brand_list = function (req, res) {
  // res.send("NOT IMPLEMENTED: Brand list");
  Brand.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_brands) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("brand_list", { title: "Brands", brand_list: list_brands });
    });
};

// Display detail page for a specific Brand.
exports.brand_detail = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },

      brand_products: function (callback) {
        Product.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.brand == null) {
        // No results.
        var err = new Error("Brand not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("brand_detail", {
        title: "Products",
        brand: results.brand,
        brand_products: results.brand_products,
      });
    }
  );
};

// Display Brand create form on GET.
exports.brand_create_get = function (req, res) {
  res.render("brand_form", { title: "Create Brand", post: false });
};

// Handle Brand create on POST.
exports.brand_create_post = [
  // Validate and sanitize the name field.
  body("name", "Brand name required").trim().isLength({ min: 2 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a brand object with escaped and trimmed data.
    const brand = new Brand({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array(),
        post: true,
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Brand with same name already exists.
      Brand.findOne({ name: req.body.name }).exec(function (err, found_brand) {
        if (err) {
          return next(err);
        }

        if (found_brand) {
          // Brand exists, redirect to its detail page.
          res.redirect(found_brand.url);
        } else {
          brand.save(function (err) {
            if (err) {
              return next(err);
            }
            // Brand saved. Redirect to brand detail page.
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];

// Display Brand delete form on GET.
exports.brand_delete_get = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_products: function (callback) {
        Product.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.brand == null) {
        // No results.
        res.redirect("/brands");
      }
      // Successful, so render.
      res.render("brand_delete", {
        title: "Delete Brand",
        brand: results.brand,
        brand_products: results.brand_products,
      });
    }
  );
};

// Handle Brand delete on POST.
exports.brand_delete_post = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.body.brandid).exec(callback);
      },
      brand_products: function (callback) {
        Product.find({ brand: req.body.brandid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.brand_products.length > 0) {
        // Brand has products. Render in same way as for GET route.
        res.render("brand_delete", {
          title: "Delete Brand",
          brand: results.brand,
          brand_products: results.brand_products,
        });
        return;
      } else {
        // Brand has no products. Delete object and redirect to the list of categories.
        Brand.findByIdAndRemove(req.body.brandid, function deleteBrand(err) {
          if (err) {
            return next(err);
          }
          // Success - go to brand list
          res.redirect("/brands");
        });
      }
    }
  );
};

// Display Brand update form on GET.
exports.brand_update_get = function (req, res, next) {
  // Get brand, authors and brands for form.
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.brand == null) {
        // No results.
        const err = new Error("Brand not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("brand_form", {
        title: "Update Brand",
        brand: results.brand,
        post: false,
      });
    }
  );
};

// Handle Brand update on POST.
exports.brand_update_post = [
  // Validate and sanitze the name field.
  body("name", "Brand name required").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    // Create a brand object with escaped and trimmed data (and the old id)
    const brand = new Brand({
      name: req.body.name,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      // Render form again with sanitized values and error messages.
      res.render("brand_form", {
        title: "Update Brand",
        brand: brand,
        errors: errors.array(),
        post: true,
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Brand.findByIdAndUpdate(req.params.id, brand, {}, function (err, brand) {
        if (err) {
          return next(err);
        }
        res.redirect(brand.url);
      });
    }
  },
];
