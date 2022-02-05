const debug = require("debug")("app:mod_users_controller");
const createError = require("http-errors");
const { UsersService } = require("./services");
const { Response } = require("../common/response");
module.exports.UsersController = {
  getUsers: async (req, res) => {
    try {
      let users = await UsersService.getAll();
      Response.success(res, 200, "Lista de usuarios", users);
      //   res.json(Users);
    } catch (error) {
      debug(error);
      Response.error(res);
      //   res.status(500).json({
      //     message: "Internal Server Error",
      //   });
    }
  },
  getUser: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      let user = await UsersService.getById(id);
      if (!user) {
        Response.error(res, new createError.NotFound());
      } else {
        Response.success(res, 200, `Usuario ${id}`, user);
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
  createUser: async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest());
      } else {
        const insertedId = await UsersService.create(body);
        Response.success(res, 201, "Usuario agregado", insertedId);
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

  updateUser: async (req, res) => {
    try {
      const {
        params: { id },
        body,
      } = req;
      const updatedUser = await UsersService.update(id, body);
      Response.success(
        res,
        200,
        `Usuario modificado correctamente`,
        updatedUser
      );
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      const deletedUser = UsersService.deleteUser(id);
      Response.success(res, 200, "Usuario(s) eliminado(s)", deletedUser);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
