const Memory = require("../models/Memory");
const fs = require("fs");

const removeOldImage = (memory) => {
  fs.unlink(`public/${memory.src}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Imagem excluída do servidor!");
    }
  });
};

const createMemory = async (req, res) => {
  try {
    const { title, description } = req.body;

    const src = `images/${req.file.filename}`;

    if (!title || !description) {
      return res
        .status(400)
        .json({ msg: "Por favor, preencha todos os campos." });
    }

    const newMemory = new Memory({
      title,
      src,
      description,
    });

    await newMemory.save();

    res.json({ msg: "Memória criada com sucesso!", newMemory });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Ocorreu um erro!");
  }
};

const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find();

    res.json(memories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ocorreu um erro!");
  }
};

const getMemory = async (req, res) => {
  try {
    const id = req.params.id;
    const memory = await Memory.findById(id);

    if (!memory) {
      return res.status(404).json({ msg: "Memória não encontrada." });
    }

    res.json(memory);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ocorreu um erro!");
  }
};

const deleteMemory = async (req, res) => {
  try {
    const id = req.params.id;
    const memory = await Memory.findByIdAndRemove(id);

    if (!memory) {
      return res.status(404).json({ msg: "Memória não encontrada." });
    }

    removeOldImage(memory);

    res.status(200).json({ memory, msg: "Memória excluida com sucesso." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Ocorreu um erro." });
  }
};

const updateMemory = async (req, res) => {
  try {
    const { title, description } = req.body;
    let src = null;

    if (req.file) {
      src = `images/${req.file.filename}`;
    }

    const id = req.params.id;
    const memory = await Memory.findById(id);

    if (!memory) {
      return res.status(404).json({ msg: "Memória não encontrada" });
    }

    if (src) {
      removeOldImage(memory);
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (src) updateData.src = src;

    const updateMemory = await Memory.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res
      .status(200)
      .json({ updateMemory, msg: "Memória atualizada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Ocorreu um erro." });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const id = req.params.id;
    const memory = await Memory.findById(id);

    if (!memory)
      return res.status(404).json({ msg: "Memória não encontrada." });

    memory.favorite = !memory.favorite;

    let favoriteMsg;

    if (memory.favorite) {
      favoriteMsg = "Memória adicionada aos favoritos!";
    } else {
      favoriteMsg = "Memória removida de favoritos!";
    }

    await memory.save();

    res.json({ memory, msg: favoriteMsg });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Ocorreu um erro." });
  }
};

const addComment = async (req, res) => {
  try {
    const { name, text } = req.body;

    if (!name || !text) {
      return res
        .status(400)
        .json({ msg: "Por favor, preencha todos os campos." });
    }
    const comment = { name, text };

    const id = req.params.id;
    const memory = await Memory.findById(id);

    if (!memory) {
      res.status(404).json({ msg: "Memória não encontrada." });
    }

    memory.comments.push(comment);

    await memory.save();

    res.json({ memory, msg: "Comentário adicionado!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Ocorreu um erro" });
  }
};

module.exports = {
  createMemory,
  getMemories,
  getMemory,
  deleteMemory,
  updateMemory,
  toggleFavorite,
  addComment,
};
