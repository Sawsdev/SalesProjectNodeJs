const debug = require("debug")("app:mod_sales_controller");
const createError = require("http-errors");
const { SalesService } = require("./services");
const { Response } = require("../common/response");
const { ProductsService } = require("../products/services");

const calculateSaleTotal = async (acumulador, products) => {
  for (let i = 0; i < products.length; i++) {
    let product = await ProductsService.getById(products[i]._id);
    if (Number(product.quatity) >= Number(products[i].quatity)) {
      acumulador =
        acumulador + Number(product.price) * Number(products[i].quatity);
      let updateProduct = {
        name: product.name,
        price: product.price,
        quatity: Number(product.quatity) - Number(products[i].quatity),
      };
      let updatedProduct = await ProductsService.update(
        product._id,
        updateProduct
      );
    } else {
      Response.success(
        res,
        204,
        `El producto ${product._id} no tiene existencias suficientes para la venta`,
        product
      );
      acumulador = -1;
      break;
    }
  }
  return acumulador;
};
module.exports.SalesController = {
  getSales: async (req, res) => {
    try {
      let sales = await SalesService.getAll();
      Response.success(res, 200, "Lista de ventas", sales);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  getSale: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      let user = await SalesService.getById(id);
      if (!user) {
        Response.error(res, new createError.NotFound());
      } else {
        Response.success(res, 200, `Venta ${id}`, user);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  createSale: async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest());
      } else {
        if (!body.products) {
          Response.error(res, new createError.BadRequest());
        } else {
          let products = body.products;
          let acumulador = 0;
          let total = await calculateSaleTotal(acumulador, products);
          let errorVenta = false;

          if (total > 0) {
            let sale = {
              ...body,
              total: total,
            };
            const insertedId = await SalesService.create(sale);
            Response.success(res, 201, "Venta agregada", insertedId);
          } else {
            Response.success(
              res,
              406,
              `Problemas con las cantidades de la venta, no permitido`,
              body.products
            );
          }
        }
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  updateSale: async (req, res) => {
    try {
      const {
        params: { id },
        body,
      } = req;
      let acumulador = 0;
      let total = await calculateSaleTotal(acumulador, body.products);
      const sale = {
        ...body,
        total: total,
      };
      const updatedSale = await SalesService.update(id, sale);
      Response.success(res, 200, `Venta modificada correctamente`, updatedSale);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  deleteSale: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      const deletedSale = SalesService.deleteSale(id);
      Response.success(res, 200, "Venta(s) eliminada(s)", deletedSale);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
