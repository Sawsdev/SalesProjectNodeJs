const debug = require("debug")("app:mod_products");
const createError = require("http-errors");
const { ProductsService } = require("./services");
const { Response } = require("../common/response");
module.exports.ProductsController = {
  getProducts: async (req, res) => {
    try {
      let products = await ProductsService.getAll();
      Response.success(res, 200, "Lista de productos", products);
      //   res.json(products);
    } catch (error) {
      debug(error);
      Response.error(res);
      //   res.status(500).json({
      //     message: "Internal Server Error",
      //   });
    }
  },
  getProduct: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      let product = await ProductsService.getById(id);
      if (!product) {
        Response.error(res, new createError.NotFound());
      } else {
        Response.success(res, 200, `Producto ${id}`, product);
      }
      //   res.json(product);
    } catch (error) {
      debug(error);
      Response.error(res);
      //   res.status(500).json({
      //     message: "Internal Server Error",
      //   });
    }
  },
  createProduct: async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest());
      } else {
        const insertedId = await ProductsService.create(body);
        Response.success(res, 201, "Producto agregado", insertedId);
        // res.json(insertedId);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
      //   res.status(500).json({
      //     message: "Internal Server Error",
      //   });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const {
        params: { id },
        body,
      } = req;
      const updatedProduct = await ProductsService.update(id, body);
      Response.success(
        res,
        200,
        `Producto modificado correctamente`,
        updatedProduct
      );
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      const deletedProducts = ProductsService.deleteProduct(id);
      Response.success(res, 200, "Producto(s) eliminado(s)", deletedProducts);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  generateReport: async (req, res) => {
    try {
      ProductsService.generateReport("Inventario", res);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
