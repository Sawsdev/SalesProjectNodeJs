const { ObjectId } = require("mongodb");
const { Database } = require("../database/index");

const COLLECTION = "sales";

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
  const collection = await Database(COLLECTION);
  return await collection.findOne({ _id: ObjectId(id) });
};

const create = async (sale) => {
  const collection = await Database(COLLECTION);

  let result = await collection.insertOne(sale);
  return result.insertedId;
};

const update = async (id, sale) => {
  const collection = await Database(COLLECTION);
  const updateSale = {
    $set: {
      products: sale.products,
      user: sale.user,
      total: sale.total,
    },
  };
  const filter = { _id: ObjectId(id) };
  const result = await collection.updateOne(filter, updateSale);
  return result;
};

const deleteSale = async (id) => {
  const collection = await Database(COLLECTION);
  const query = { _id: ObjectId(id) };
  const result = await collection.deleteOne(query);

  return result.deletedCount;
};

// const calculateSaleTotal = async (products) => {
//   let saleTotal = products.reduce(async (acumulador, saleProduct) => {
//     let product = await ProductsService.getById(saleProduct._id);
//     acumulador =
//       acumulador + Number(product.price) * Number(saleProduct.quatity);
//     return acumulador;
//   }, 0);

//   return saleTotal;
// };
module.exports.SalesService = {
  getAll,
  getById,
  create,
  update,
  deleteSale,
};
