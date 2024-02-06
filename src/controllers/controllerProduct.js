const { GetAllproductDB, DeleteproductDB, UpdateproductDB, CreateproductDB, findProductDB, compraProductosDB, filtrarProductoBD } = require("../services/productServices");
const isNumber = require("../toolsDev/isNumber");
const random = require("../toolsDev/random");
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
        const filtros = data.filtros;
        const distribuidor = [].concat(...filtros.map(dis => dis.distribuidor));
        const distribuidor2 = [...new Set(distribuidor)];
        const laboratorio = [].concat(...filtros.map(lab => lab.laboratorio));
        const laboratorio2 = [...new Set(laboratorio)];
        res.json({
          success: true,
          message: "productos registrados",
          data: data.data,
          paginas: data.paginas,
          info: data.totalP,
          filtros: { laboratorio: laboratorio2, distribuidor: distribuidor2 }
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
  const { ubicacion, nombre, unidades, costo, precio, laboratorio, distribuidor, codeBar, porcentageIva, modalidadPago, idDeuda } = req.body;

  const product = {
    nombre,
    idProduct: random(1000, 9000),
    idDeuda,
    unidades,
    costo,
    precio,
    laboratorio,
    idUsuario,
    distribuidor,
    codeBar,
    porcentageIva,
    modalidadPago,
    ubicacion
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
  const { ubicacion, codeBar, nombre, unidades, costo, precio, laboratorio, idProduct, distribuidor, porcentageIva, metodoPago } = req.body;
  const product = {
    nombre,
    unidades,
    costo,
    precio,
    laboratorio,
    idProduct,
    distribuidor,
    idUsuario,
    porcentageIva,
    metodoPago,
    codeBar,
    ubicacion
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
  const idDeuda = req.params.id_deuda;

  findProductDB(id, words, idDeuda)
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

const comprarProductos = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { idDeuda, nombre, unidades, costo, precio, laboratorio, idProduct, distribuidor, porcentageIva, metodoPago } = req.body;
  const product = {
    idDeuda,
    nombre,
    unidades,
    costo,
    precio,
    laboratorio,
    idProduct,
    distribuidor,
    idUsuario,
    porcentageIva,
    metodoPago
  };
  if (unidades < 0) {
    res.status(401).json({
      message: "el numero es negativo ",
      success: false
    });
    return;
  }

  if (!isNumber(precio) || !isNumber(costo) || !isNumber(unidades)) {
    res.json({
      success: false,
      message: "no deben de existir letras en algunos campos"
    });
  } else {
    compraProductosDB(product)
      .then(result => {
        if (result) {
          res.json({
            success: true,
            message: "compra exitosa"
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

const filtrarProducto = (req, res) => {
  const filtro = JSON.parse(req.params.filtro);
  const usuario = req.usuario.id_usuario;

  filtrarProductoBD(usuario, filtro)
    .then((result) => {
      if (result.length < 1) {
        res.status(200).json({
          message: "no se encontro ningun registro",
          success: false
        });
      } else {
        res.status(200).json({
          message: "exito",
          data: result,
          success: true
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "error en el proceso",
        success: false,
        err
      });
    });
};

module.exports = {
  getAllproducts,
  deleteProducts,
  updateProducts,
  createProducts,
  findProduct,
  comprarProductos,
  filtrarProducto
};
