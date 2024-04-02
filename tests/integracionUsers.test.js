const Test = require("supertest/lib/test");
const app = require("../index");
const request = require("supertest"); 
const conexion = require("../src/toolsDev/midelware/bd_conection");

// modulo de usuario 
const user = {
    id_usuario:15,
    nombre: "pedro",
    correo: 'garci@gmail.com',
    celular: '0987123456',
    contraseña: '1234567890',
    activo: 0,
    fecha: '3/3/2024',
    clave: 1234,
    inicio: '3',
    nombreNegocio: 'Farmacia XYZ',
    nit: 2222222,
    direccion: 'Av. Principal 123'
}
const userUpdate= {
    id_usuario:15,
    nombre: "pedro",
    correo: 'garci@gmail.com',
    celular: '12345678',
    contraseña: '1234567890',
    activo: 0,
    fecha: '10/02/2023',
    clave: 1234,
    inicio: '3',
    nombreNegocio: 'la union ',
    nit: 2222222,
    direccion: 'el barrio nuevo '
}

//modulo gasto
const gasto ={
    idGasto : "123",
    idUsuario : 2,
    descripcion : "hola a todos",
    valorGasto : "12222",
    fecha : "8/09/2021",
    categoria: "ropa"
}
let token 
 let id;
// conexion 
beforeAll(() => {
    conexion.connect((err) => {
       if (err) {
        console.log(err)
       }
       console.log("conexion exitosa")
    })
})

describe("POST /api/v1/user", () => {
    test("crear usuario",async () => {
        const response =await request(app).post("/api/v1/user").send(user);
        expect(response.status).toBe(200);
    });
});

describe("GET /api/v1/user/all", () => {
    test("ver usuario ",async () => {
        const response = await request(app).get("/api/v1/user/all").send();
            
            expect(response.status).toBe(200);
            const data = response.body.data;
            const user = data.find(user => user.nombre == "pedro");
            id = user.id_usuario;
            expect(user.nombre).toBe("pedro");
      });
});


describe("POST /api/v1/user/aut", () => {
    test("iniciar sesion", async () => {
        const response = await request(app).post("/api/v1/user/aut")
        .send({"correo":  user.correo,
        "contraseña": user.contraseña})
        .set('Accept', 'application/json')
        expect(response.status).toBe(200)
        token =  response.headers["set-cookie"]
    })
})

 describe("PUT /api/v1/user", () => {
    test("actualizar usuario ", async () => {
        const response = await (await request(app)
        .put("/api/v1/user")
        .set("cookie", token[0].split(";")[0])
        .send(userUpdate))
        expect(response.status).toBe(200)
    })
 })

 ////---------------modulo de inventario  
 
 describe("GET /api/v1/productos", () => {
    test("pedir producto", async () => {
        const response = await request(app).get("/api/v1/productos/1").set("Cookie", token[0].split(";")[0])
        expect(response.status).toBe(200)
        expect
    })
 })



 //_---------- modulo gastos --------
 describe("POST /api/v1/gastos/creargastos", () => {
    test("crear gasto", async () => {
        const response = await request(app).post("/api/v1/gastos/creargastos").set("Cookie", token[0].split(";")[0]).send(gasto)
        expect(response.status).toBe(200)
        console.log(response.body)
    })
 })

 //optener gastos 
 describe("POST /api/v1/gastos/", () => {
    test("crear gasto", async () => {
        const response = await request(app).post("/api/v1/gastos/creargastos").set("Cookie", token[0].split(";")[0]).send(gasto)
        expect(response.status).toBe(200)
        console.log(response.body)
    })
 })

afterAll(() => {
 conexion.query("DELETE FROM administrador where nombre = 'pedro' ",  (err) => {
          if (err) {
            console.log(err)
          }
          
        })
        
})
