const { ObjectId } = require("mongodb");
const { Database } = require("../database/index");
const { ProductsUtils } = require("./utils");

const COLLECTION = "products";

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
  const collection = await Database(COLLECTION);
  return await collection.findOne({ _id: ObjectId(id) });
};

const create = async (product) => {
  const collection = await Database(COLLECTION);

  let result = await collection.insertOne(product);
  return result.insertedId;
};

const generateReport = async (filename, res) => {
  let products = await getAll();
  ProductsUtils.excelGenerator(products, filename, res);
};

const update = async (id, product) => {
  const collection = await Database(COLLECTION);
  const updateProduct = {
    $set: {
      name: product.name,
      price: product.price,
      quatity: product.quatity,
    },
  };
  const filter = { _id: ObjectId(id) };
  const result = await collection.updateOne(filter, updateProduct);
  return result;
};

const deleteProduct = async (id) => {
  const collection = await Database(COLLECTION);
  const query = { _id: ObjectId(id) };
  const result = await collection.deleteOne(query);

  return result.deletedCount;
};

module.exports.ProductsService = {
  getAll,
  getById,
  create,
  generateReport,
  update,
  deleteProduct,
};
