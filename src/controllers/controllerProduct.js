const { GetAllproductDB, DeleteproductDB, UpdateproductDB, CreateproductDB, findProductDB } = require("../services/productServices");
const isNumber = require("../toolsDev/isNumber");
const getAllproducts = (req, res) => {
  const id = req.usuario.id_usuario;
  const pagina = req.params.page;
  GetAllproductDB(id, pagina)
    .then(data => {
      if (data.length <= 0) {
        res.json({
          success: false,
          message: "no hay productos registrados"
        });
      } else {
        res.json({
          success: true,
          message: "productos registrados",
          data
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        err
      });
    });
};

const createProducts = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { nombre, unidades, costo, precio, laboratorio, distribuidor, codeBar } = req.body;

  const product = {
    nombre,
    unidades,
    costo,
    precio,
    laboratorio,
    idUsuario,
    distribuidor,
    codeBar
  };
  if (!isNumber(unidades) || !isNumber(costo) || !isNumber(precio)) {
    res.json({
      success: false,
      message: "no deben de existir letras en algunos campos"
    });
  } else if (laboratorio && nombre && distribuidor) {
    CreateproductDB(product)
      .then(result => {
        if (result) {
          res.json({
            success: true,
            message: "registro exitoso"
          });
        } else {
          res.json({
            success: false,
            message: "ya se encuentra registrado"
          });
        }
      }).catch(err => {
        res.json({
          err
        });
      });
  } else {
    res.json({
      success: false,
      message: "faltan campos por llenar "
    });
  }
};

const deleteProducts = (req, res) => {
  const id = req.params.idproduct;
  DeleteproductDB(id)
    .then(result => {
      res.json({
        message: "se elimino correctamente",
        success: true,
        result
      });
    })
    .catch(err => {
      res.json({
        message: err
      });
    });
};

const updateProducts = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { nombre, unidades, costo, precio, laboratorio, idProduct, distribuidor } = req.body;
  const product = {
    nombre,
    unidades,
    costo,
    precio,
    laboratorio,
    idProduct,
    distribuidor,
    idUsuario
  };

  if (!isNumber(precio) || !isNumber(costo) || !isNumber(unidades)) {
    res.json({
      success: false,
      message: "no deben de existir letras en algunos campos"
    });
  } else {
    UpdateproductDB(product)
      .then(result => {
        if (result) {
          res.json({
            success: true,
            message: "se actualizo correctamente"
          });
        }
      })
      .catch(err => {
        if (err) {
          res.json({
            success: false,
            message: "error al acceder"
          });
        }
      });
  }
};

const findProduct = (req, res) => {
  const id = req.usuario.id_usuario;
  const words = req.params.words;

  findProductDB(id, words)
    .then(result => {
      if (result.data.length <= 0) {
        res.json({
          message: "no se encontro ningun registro",
          success: false
        });
      } else {
        res.json({
          success: true,
          data: result.data
        });
      };
    })
    .catch(err => {
      if (err) {
        res.json({
          success: false,
          message: "ocurrio un error",
          err
        });
      }
    });
};

module.exports = {
  getAllproducts,
  deleteProducts,
  updateProducts,
  createProducts,
  findProduct
};
