const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define(
  "perguntas",
  {
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descricao: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {}
);

// caso a tabela já exista, o 'force: false' não permite a recriação
Pergunta.sync({ force: false }).then(() => {});

module.exports = Pergunta;
