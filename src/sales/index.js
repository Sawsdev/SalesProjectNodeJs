const express = require("express");
const { SalesController } = require("./controller");
const router = express.Router();

module.exports.SalesAPI = (app) => {
  router
    .get("/", SalesController.getSales)
    .get("/:id", SalesController.getSale)
    .post("/", SalesController.createSale)
    .put("/:id", SalesController.updateSale)
    .delete("/:id", SalesController.deleteSale);

  app.use("/api/sales", router);
};
