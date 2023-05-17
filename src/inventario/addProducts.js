const conexion = require("../toolsDev/midelware/bd_conection");

const addProducts=require("express").Router();

addProducts.post("/", async(req, res)=>{
    //variables
    const {nombre, unidades, costo, precio, id_usuario, laboratorio}= req.body;
   

    //comprobar si el producto ya esta registrado 
    conexion.query("SELECT * FROM productos WHERE nombre =?",[nombre],(err, result)=>{
        if(err){
            console.log("error al acceder a los datos")
        }else{
            if (result.length <= 0) {
                //agregar producto despues de la comprobacion 
                conexion.query("INSERT INTO productos SET ? ",[{nombre:nombre, unidades:unidades, costo:costo, precio:precio, id_usuario:id_usuario, laboratorio:laboratorio}], async(err, result)=>{

                    if (err) {
                        console.log("no se pudo guarar", err);
                    }else{
                        res.json({
                            message:"se guardo el producto",
                            success:true
                        });
                    }

                });
                
            }else{
                res.json({
                    message:"el producto ya esta registrado",
                    success:false
                });
            };
        };

    });


    
    
});
 
    // actualizar producto 
    addProducts.put("/editar/:producto", (req, res)=>{
        const product=JSON.parse(req.params.producto);
        console.log(product)
        conexion.query(`UPDATE productos SET unidades =?,costo=?, precio=?,laboratorio=? WHERE nombre=?`,
        [product.unidades,product.costo, product.precio,product.laboratorio, product.nombre], (err, result)=>{
            if (err) {
                res.json({
                    success:false,
                    data:"error al actualizar"
                })
                
            }else{
                res.json({
                    success:true,
                    data:"se actualizo"
                })
            }

        })
      
    })
module.exports=addProducts;