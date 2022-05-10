const { ObjectId } = require("mongodb");
const { Database } = require("../database/index");

const COLLECTION = "users";

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
  const collection = await Database(COLLECTION);
  return await collection.findOne({ _id: ObjectId(id) });
};

const create = async (user) => {
  const collection = await Database(COLLECTION);

  let result = await collection.insertOne(user);
  return result.insertedId;
};

const update = async (id, user) => {
  const collection = await Database(COLLECTION);
  const updateUser = {
    $set: {
      name: user.name,
      email: user.email,
    },
  };
  const filter = { _id: ObjectId(id) };
  const result = await collection.updateOne(filter, updateUser);
  return result;
};

const deleteUser = async (id) => {
  const collection = await Database(COLLECTION);
  const query = { _id: ObjectId(id) };
  const result = await collection.deleteOne(query);

  return result.deletedCount;
};

module.exports.UsersService = {
  getAll,
  getById,
  create,
  update,
  deleteUser,
};
