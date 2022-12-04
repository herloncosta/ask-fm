const express = require("express");
const { urlencoded, json } = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
const cors = require("cors");
const env = require("dotenv").config();

const app = express();

// Conexão com o banco de dados
connection
  .authenticate()
  .then(console.log("Conexão estabelecida com sucesso!"))
  .catch((e) => console.log("Falha na conexão: ", e));

// configuração da engine EJS
app.set("view engine", "ejs");
app.use(express.static("public"));

// configuração do body-parser
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

app.get("/", function (req, res) {
  // ASC = Crescente || DESC = Decrescente
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    res.render("index", {
      perguntas,
    });
  });
});

app.get("/perguntar", function (req, res) {
  res.render("perguntar");
});

app.post("/salvarpergunta", function (req, res) {
  const body = req.body;
  const data = {
    titulo: body.titulo,
    descricao: body.descricao,
  };

  // insert na tabela perguntas
  Pergunta.create({ titulo: data.titulo, descricao: data.descricao }).then(
    () => res.redirect("/") // redirecionando para a página principal
  );
});

app.get("/pergunta/:id", function (req, res) {
  const id = req.params.id;
  Pergunta.findOne({ where: { id: id } }).then((pergunta) => {
    if (pergunta != undefined) {
      Resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas,
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", function (req, res) {
  const corpo = req.body.corpo;
  const id = req.body.perguntaId;

  Resposta.create({ corpo: corpo, perguntaId: id }).then(() => {
    // res.send("pergunta criada");
    res.redirect(`/perguntar`);
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
