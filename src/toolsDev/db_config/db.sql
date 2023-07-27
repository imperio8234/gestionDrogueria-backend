CREATE DATABASE drogueria;
use drogueria

CREATE TABLE administrador(
    id_usuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(250) NOT NULL,
    correo VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    celular VARCHAR(250) NOT NULL,
    contraseña VARCHAR(250) NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    fecha VARCHAR(500),
    clave INT
    PRIMARY KEY (id_usuario)
)

CREATE TABLE productos(
    id_producto INT NOT NULL AUTO_INCREMENT,
    unidades VARCHAR(250) NOT NULL,
    nombre VARCHAR(250) NOT NULL,
    costo VARCHAR(250) NOT NULL,
    precio VARCHAR(250) NOT NULL,
    laboratorio VARCHAR(250),
    id_usuario INT NOT NULL
    PRIMARY KEY (id_producto),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario)  
);

CREATE TABLE deudas(
    id_deuda INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nombre VARCHAR(250) NOT NULL,
    celular VARCHAR(250) NOT NULL,
    valor VARCHAR(250) NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_deuda),
    FOREIGN KEY (id_usuario)
    REFERENCES administrador(id_usuario)
    ON DELETE CASCADE;  
);

CREATE TABLE abonos(
    id_abono INT NOT NULL AUTO_INCREMENT,
    id_deuda INT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    valor VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_abono),
    CONSTRAINT fk_deudas
    FOREIGN KEY (id_deuda)
    REFERENCES deudas(id_deuda)
);

CREATE TABLE suma_deuda(
    id_suma INT NOT NULL AUTO_INCREMENT,
    id_deuda INT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    producto VARCHAR(250) NOT NULL,
    valor VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_suma),
    CONSTRAINT fk_deuda
    FOREIGN KEY (id_deuda)
    REFERENCES deudas(id_deuda)

);


CREATE table creditos(
    id_credito INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nombre VARCHAR(250) NOT NULL, 
    celular VARCHAR(250) NOT NULL,  
    fecha VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_credito),
    CONSTRAINT fk_id_usuario,
    FOREIGN key (id_usuario)
    REFERENCES administrador(id_usuario)
    ON DELETE CASCADE

   
);

CREATE TABLE abonos_credito(
    id_abono INT NOT NULL AUTO_INCREMENT,
    id_credito INT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    valor VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_abono),
    CONSTRAINT fk_credito
    FOREIGN KEY (id_credito)
    REFERENCES creditos(id_credito)
);

CREATE TABLE suma_credito(
    id_suma INT NOT NULL AUTO_INCREMENT,
    id_credito INT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    producto VARCHAR(250) NOT NULL,
    valor VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_suma),
    CONSTRAINT fk_credito
    FOREIGN KEY (id_credito)
    REFERENCES creditos(id_credito)

);

// modulo de ventas 

CREATE TABLE ventas(
    id_usuario INT NOT NULL,
    id_venta INT NOT NULL AUTO_INCREMENT,
    fecha VARCHAR(300) NOT NULL,
    total_venta INT NOT NULL,
    PRIMARY key (id_venta)
    CONSTRAINT fk_venta
    FOREIGN KEY (id_usuario)
    REFERENCES administrador(id_usuario)
    ON DELETE CASCADE
)

CREATE TABLE productos_vendidos(
    id_producto_vendido INT NOT NULL AUTO_INCREMENT,
    id_venta INT NOT NULL,
    producto VARCHAR(400),
    cantidad INT NOT NULL,
    valor INT NOT NULL,
    PRIMARY KEY (id_producto_vendido),
    CONSTRAINT fk_id_venta
    FOREIGN KEY (id_venta)
    REFERENCES ventas(id_venta)
    ON DELETE CASCADE
)

CREATE TABLE devoluciones(
    id_devolucion INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    cantidad INT NOT NULL,
    producto VARCHAR(400),
    valor INT NOT NULL,
    PRIMARY KEY (id_devolucion),
    
    FOREIGN KEY (id_usuario)
    REFERENCES administrador(id_usuario)
)

CREATE TABLE gastos(
    id_gasto INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    fecha VARCHAR(400) NOT NULL,
    descripcion VARCHAR(600),
    valor INT NOT NULL,
    PRIMARY KEY (id_gasto),
    CONSTRAINT fk_id_venta
    FOREIGN key (id_usuario)
    REFERENCES administrador(id_usuario)

)


--- tabla de lista -------

CREATE table lista (
    id_usuario INT NOT NULL,
    id_producto INT
    nombre VARCHAR(400),
    unidades INT,
    precio INT,
    valor_total INT,
    laboratorio VARCHAR(500),
    PRIMARY KEY (id_producto)
    CONSTRAINT fk_lista
    FOREIGN KEY (id_usuario)
    REFERENCES administrador(id_usuario)
)