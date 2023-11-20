const { getListaDB, createListaDB, UpdateListaDB, deleteListaDB, deleteAllListaDB } = require("../services/listaServices");
const getLista = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  getListaDB(idUsuario)
    .then(result => {
      if (result.length <= 0) {
        res.json({
          message: "No hay productos en la lista",
          success: false
        });
      } else {
        res.json({
          message: "hay articulos",
          success: true,
          result
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "ocurrio un error",
          err
        });
      }
    });
};
const createLista = (req, res) => {
  const item = req.body;
  const idUsuario = req.usuario.id_usuario;
  const producto = {
    idProducto: item.id_producto,
    idUsuario,
    nombre: item.nombre,
    precio: item.precio,
    unidades: item.unidades,
    valorTotal: item.valorTotal,
    laboratorio: item.laboratorio,
    porcentageIva: item.porcentageIva
  };
  createListaDB(producto)
    .then(result => {
      if (result.success) {
        res.json({
          message: "se creo correctamente",
          success: true
        });
      } else {
        res.json({
          message: result.message,
          success: false
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "ocurrio un error",
          success: false,
          err
        });
      }
    });
};
const updateLista = (req, res) => {
  const item = req.body;
  const idUsuario = req.usuario.id_usuario;
  const producto = {
    idUsuario,
    idProducto: item.id_producto,
    unidades: item.unidades,
    valorTotal: item.valorTotal,
    porcentageIva: item.porcentageIva
  };
  UpdateListaDB(producto)
    .then(result => {
      if (result.success) {
        res.json({
          message: "se actualizo correctamente",
          success: true
        });
      } else {
        res.json({
          message: result.message,
          success: false
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "error",
          err
        });
      }
    });
};
const deleteLista = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const idProducto = req.params.id_producto;
  deleteListaDB(idUsuario, idProducto)
    .then(result => {
      if (result) {
        res.json({
          success: true,
          result,
          message: "se elimino"
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "error",
          err
        });
      }
    });
};

const deleteAllLista = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  deleteAllListaDB(idUsuario)
    .then(result => {
      if (result) {
        res.json({
          message: "lista eliminada",
          success: true
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "error",
          err,
          success: false
        });
      }
    });
};

module.exports = {
  getLista,
  createLista,
  updateLista,
  deleteLista,
  deleteAllLista

};
