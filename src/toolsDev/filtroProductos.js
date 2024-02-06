const filtroProductos = {
  cantidad: `select * from 
  productos 
  where id_usuario = ? and unidades < ?`,
  distribuidor: `
  select * from 
   productos 
  where id_usuario = ? and distribuidor = ?
  `,
  laboratorio: `
  select * from 
   productos  
  where 
  id_usuario =? and laboratorio = ?
  `

};

module.exports = filtroProductos;
