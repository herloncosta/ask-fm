const Sequelize = require("sequelize");

const connection = new Sequelize("nome_da_base", "usuario", "senha", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
