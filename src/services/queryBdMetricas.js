const creditosf = `
select 
 sum(valor) valor
from 
 creditosf
where 
 id_usuario = ?

`;

const comprasfSinPagar = `
select 
 sum(valor) valor
from 
 compras_fuera_inventario
where 
 id_usuario = ?
and 
 metodo_pago = "compra a credito"
`;


const comprasTotsales = `

select 
 sum(valor) valor
from 
 compras_fuera_inventario
where 
 id_usuario = ?
`;

const abonosCredito = `
select 
 sum(valor) valor
from 
 abonos_credito
where 
 id_usuario = ?
`

const abonosCompras = `
select 
 sum(valor) valor
from 
 abonos
where 
 id_usuario = ?
`


module.exports= {
    creditosf,
    comprasTotsales,
    comprasfSinPagar,
    abonosCompras,
    abonosCredito
}