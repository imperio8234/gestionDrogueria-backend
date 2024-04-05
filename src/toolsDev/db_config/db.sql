CREATE DATABASE villa;
use villa;

CREATE TABLE administrador(
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(250) NOT NULL,
    correo VARCHAR(250) NOT NULL,
    nit BIGINT,
    direccion VARCHAR(400), 
    celular VARCHAR(250) NOT NULL,
    contraseña VARCHAR(250) NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    fecha VARCHAR(500),
    clave INT,
    inicio VARCHAR(500),
    nombreNegocio VARCHAR(500),
    PRIMARY KEY (id_usuario)
);

CREATE TABLE productos(
    id_producto BIGINT NOT NULL AUTO_INCREMENT,
    unidades INT NOT NULL,
    distribuidor VARCHAR(400),
    id_deuda BIGINT NOT null,
    nombre VARCHAR(250) NOT NULL,
    costo BIGINT NOT NULL,
    precio BIGINT NOT NULL,
    laboratorio VARCHAR(250),
    porcentageIva INT,
    id_usuario BIGINT NOT NULL,
    metodo_pago VARCHAR(200) NOT NULL,
    ubicacion VARCHAR(300),
    codeBar BIGINT,
    PRIMARY KEY (id_producto),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE productos_historial(
    id_compra BIGINT not null AUTO_INCREMENT,
    id_producto BIGINT NOT NULL,
    id_deuda BIGINT NOT null,
    unidades INT NOT NULL,
    distribuidor VARCHAR(400),
    nombre VARCHAR(250) NOT NULL,
    costo BIGINT NOT NULL,
    precio BIGINT NOT NULL,
    laboratorio VARCHAR(250),
    id_usuario BIGINT NOT NULL,
    porcentageIva INT,
    fecha VARCHAR(500),
    metodo_pago VARCHAR(200) NOT NULL,
    ubicacion VARCHAR(300),
    codeBar BIGINT,
    PRIMARY KEY (id_compra),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE deudas(
    id_deuda BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    nombre VARCHAR(250) NOT NULL,
    celular VARCHAR(250) NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_deuda),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE abonos(
    id_abono BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT not null,
    id_deuda BIGINT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    PRIMARY KEY (id_abono),
    CONSTRAINT fk_deudas FOREIGN KEY (id_deuda) REFERENCES deudas(id_deuda) ON DELETE CASCADE
);

CREATE TABLE suma_deuda(
    id_suma BIGINT NOT NULL AUTO_INCREMENT,
    id_deuda BIGINT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    producto VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    PRIMARY KEY (id_suma),
    CONSTRAINT fk_deuda FOREIGN KEY (id_deuda) REFERENCES deudas(id_deuda) ON DELETE CASCADE
);

CREATE TABLE creditos(
    id_credito BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    nombre VARCHAR(250) NOT NULL,
    celular VARCHAR(250) NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_credito),
    CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE abonos_credito(
    id_abono BIGINT NOT NULL AUTO_INCREMENT,
    id_credito BIGINT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    id_usuario BIGINT,
    PRIMARY KEY (id_abono),
    CONSTRAINT fk_credito FOREIGN KEY (id_credito) REFERENCES creditos(id_credito) ON DELETE CASCADE
);

CREATE TABLE suma_credito(
    id_suma BIGINT NOT NULL AUTO_INCREMENT,
    id_credito BIGINT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    producto VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    unidades INT,
    precio BIGINT,
    laboratorio VARCHAR(500),
    id_venta BIGINT,
    id_usuario BIGINT,
    id_producto BIGINT,
    PRIMARY KEY (id_suma),
    CONSTRAINT fk_creditoSuma FOREIGN KEY (id_credito) REFERENCES creditos(id_credito) ON DELETE CASCADE
);

-- Modulo de ventas

CREATE TABLE ventas(
    id_usuario BIGINT NOT NULL,
    id_venta BIGINT NOT NULL AUTO_INCREMENT,
    fecha VARCHAR(300) NOT NULL,
    total_venta BIGINT NOT NULL,
    pago_con BIGINT,
    devolucion BIGINT,
    PRIMARY KEY (id_venta),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE productos_vendidos(
    id_producto_vendido BIGINT NOT NULL AUTO_INCREMENT,
    id_venta BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    producto VARCHAR(400),
    cantidad INT NOT NULL,
    laboratorio VARCHAR(500),
    id_usuario BIGINT,
    porcentageIva  INT,
    valor_total BIGINT,
    valor BIGINT NOT NULL,
    ubicacion VARCHAR(300),
    costo_un BIGINT,
    PRIMARY KEY (id_producto_vendido),
    CONSTRAINT fk_id_venta FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    CONSTRAINT fk_id_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE devoluciones(
    id_devolucion BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    cantidad INT NOT NULL,
    producto VARCHAR(400),
    valor BIGINT NOT NULL,
    PRIMARY KEY (id_devolucion),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE gastos(
    id_gasto BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    fecha VARCHAR(400) NOT NULL,
    descripcion VARCHAR(600),
    valor_gasto BIGINT NOT NULL,
    categoria VARCHAR(200) NOT NULL,
    PRIMARY KEY (id_gasto),
    CONSTRAINT fk_id_usuariog FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);


-- Tabla de lista

CREATE TABLE lista (
    id_usuario BIGINT NOT NULL,
    id_producto BIGINT,
    nombre VARCHAR(400),
    unidades INT,
    precio BIGINT,
    costo_un BIGINT,
    valor_total BIGINT,
    porcentageIva INT,
    laboratorio VARCHAR(500),
    ubicacion VARCHAR(300),
    PRIMARY KEY (id_producto),
    CONSTRAINT fk_lista FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fiado (
    id_fiado BIGINT not null AUTO_INCREMENT primary KEY,
    id_credito BIGINT not null, 
    descripcion VARCHAR(100),
    fecha VARCHAR(100) not null,
    valor BIGINT,
    CONSTRAINT FK_fiado FOREIGN KEY (id_credito) REFERENCES creditos(id_credito)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS compras_fuera_inventario (
    id_compra BIGINT not null AUTO_INCREMENT primary KEY,
    id_deuda BIGINT not null, 
    descripcion VARCHAR(100),
    fecha VARCHAR(100) not null,
    valor BIGINT,
    id_usuario BIGINT not null,
    metodo_pago VARCHAR(300) NOT NULL,
    procedencia VARCHAR(400) not null,
    CONSTRAINT FK_compras FOREIGN KEY (id_deuda) REFERENCES deudas(id_deuda)
    ON DELETE CASCADE
);


CREATE TABLE cajaDiaria (
    id_usuario BIGINT NOT NULL,
    id_caja BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    efectivoInicial BIGINT NOT NULL,
    efectivoCierre BIGINT,
    fecha VARCHAR(200) NOT NULL,
    CONSTRAINT fk_caja FOREIGN KEY (id_usuario)
    REFERENCES administrador(id_usuario)
    ON DELETE CASCADE

);

CREATE TABLE creditosf (
    id_usuario BIGINT NOT NULL,
    id_credito BIGINT NOT NULL,
    id_creditof BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    valor BIGINT NOT NULL,
    descripcion VARCHAR(300) NOT NULL,
    fecha VARCHAR(200) NOT NULL,
    CONSTRAINT fk_comprasf FOREIGN KEY (id_credito) REFERENCES creditos(id_credito) ON DELETE CASCADE
);
