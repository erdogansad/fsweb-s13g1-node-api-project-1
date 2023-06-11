const express = require("express");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { find, findById, insert, update, remove, resetDB } = require("./users/model.js");

server.use(
  bodyParser.json({
    type: function () {
      return true;
    },
  })
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

server.post("/api/users", async (req, res) => {
  let data = req.body;

  try {
    if (!data.name || !data.bio) {
      res.status(400).json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
    } else {
      let process = await insert(data);
      res.status(201).json(process);
    }
  } catch (e) {
    res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
  }
});

server.get("/api/users", async (req, res) => {
  try {
    let process = await find();
    res.status(201).json(process);
  } catch (e) {
    res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

server.get("/api/users/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let process = await findById(id);
    if (process) {
      res.status(200).json(process);
    } else {
      res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    }
  } catch (e) {
    res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
  }
});

server.delete("/api/users/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let process = await remove(id);
    if (process) {
      res.status(200).json(process);
    } else {
      res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    }
  } catch (e) {
    res.status(500).json({ message: "Kullanıcı silinemedi" });
  }
});

server.put("/api/users/:id", async (req, res) => {
  let id = req.params.id,
    data = req.body;

  try {
    if (!data.name || !data.bio) {
      res.status(400).json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
    } else {
      let process = await update(id, data);
      if (process) {
        res.status(200).json(process);
      } else {
        res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi" });
  }
});

module.exports = server;
