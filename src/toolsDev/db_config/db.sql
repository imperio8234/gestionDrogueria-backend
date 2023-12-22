CREATE DATABASE villa;
use villa

CREATE TABLE administrador(
    id_usuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(250) NOT NULL,
    correo VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
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
    id_producto INT NOT NULL AUTO_INCREMENT,
    unidades INT NOT NULL,
    distribuidor VARCHAR(400),
     id_deuda BIGINT NOT null,
    nombre VARCHAR(250) NOT NULL,
    costo BIGINT NOT NULL,
    precio BIGINT NOT NULL,
    laboratorio VARCHAR(250),
    porcentageIva INT,
    id_usuario INT NOT NULL,
     metodo_pago VARCHAR(200) NOT NULL,
    codeBar BIGINT,
    PRIMARY KEY (id_producto),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE productos_historial(
    id_compra int not null AUTO_INCREMENT,
    id_producto INT NOT NULL AUTO_INCREMENT,
    id_deuda BIGINT NOT null,
    unidades INT NOT NULL,
    distribuidor VARCHAR(400),
    nombre VARCHAR(250) NOT NULL,
    costo BIGINT NOT NULL,
    precio BIGINT NOT NULL,
    laboratorio VARCHAR(250),
    id_usuario INT NOT NULL,
    porcentageIva INT,
    fecha VARCHAR(500),
    metodo_pago VARCHAR(200) NOT NULL,
    codeBar BIGINT,
    PRIMARY KEY (id_compra),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE deudas(
    id_deuda INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nombre VARCHAR(250) NOT NULL,
    celular VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_deuda),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE abonos(
    id_abono INT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT not null,
    id_deuda INT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    PRIMARY KEY (id_abono),
    CONSTRAINT fk_deudas FOREIGN KEY (id_deuda) REFERENCES deudas(id_deuda) ON DELETE CASCADE
);

CREATE TABLE suma_deuda(
    id_suma INT NOT NULL AUTO_INCREMENT,
    id_deuda INT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    producto VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    PRIMARY KEY (id_suma),
    CONSTRAINT fk_deuda FOREIGN KEY (id_deuda) REFERENCES deudas(id_deuda) ON DELETE CASCADE
);

CREATE TABLE creditos(
    id_credito INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nombre VARCHAR(250) NOT NULL,
    celular VARCHAR(250) NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_credito),
    CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE abonos_credito(
    id_abono INT NOT NULL AUTO_INCREMENT,
    id_credito INT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    PRIMARY KEY (id_abono),
    CONSTRAINT fk_credito FOREIGN KEY (id_credito) REFERENCES creditos(id_credito) ON DELETE CASCADE
);

CREATE TABLE suma_credito(
    id_suma INT NOT NULL AUTO_INCREMENT,
    id_credito INT NOT NULL,
    fecha VARCHAR(250) NOT NULL,
    producto VARCHAR(250) NOT NULL,
    valor BIGINT NOT NULL,
    unidades INT,
    precio BIGINT,
    laboratorio VARCHAR(500),
    id_venta INT,
    id_usuario INT,
    id_producto INT,
    PRIMARY KEY (id_suma),
    CONSTRAINT fk_creditoSuma FOREIGN KEY (id_credito) REFERENCES creditos(id_credito) ON DELETE CASCADE
);

-- Modulo de ventas

CREATE TABLE ventas(
    id_usuario INT NOT NULL,
    id_venta INT NOT NULL AUTO_INCREMENT,
    fecha VARCHAR(300) NOT NULL,
    total_venta BIGINT NOT NULL,
    pago_con BIGINT,
    devolucion BIGINT,
    PRIMARY KEY (id_venta),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE productos_vendidos(
    id_producto_vendido INT NOT NULL AUTO_INCREMENT,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    producto VARCHAR(400),
    cantidad INT NOT NULL,
    laboratorio VARCHAR(500),
    id_usuario INT,
    porcentageIva  INT,
    valor_total INT,
    valor BIGINT NOT NULL,
    costo_un BIGINT,
    PRIMARY KEY (id_producto_vendido),
    CONSTRAINT fk_id_venta FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    CONSTRAINT fk_id_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE devoluciones(
    id_devolucion INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    cantidad INT NOT NULL,
    producto VARCHAR(400),
    valor BIGINT NOT NULL,
    PRIMARY KEY (id_devolucion),
    FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE gastos(
    id_gasto INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    fecha VARCHAR(400) NOT NULL,
    descripcion VARCHAR(600),
    valor BIGINT NOT NULL,
    PRIMARY KEY (id_gasto),
    CONSTRAINT fk_id_gasto FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

-- Tabla de lista

CREATE TABLE lista (
    id_usuario INT NOT NULL,
    id_producto INT,
    nombre VARCHAR(400),
    unidades INT,
    precio BIGINT,
    costo_un BIGINT 
    valor_total INT,
    porcentageIva INT,
    laboratorio VARCHAR(500),
    PRIMARY KEY (id_producto),
    CONSTRAINT fk_lista FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gastos (
    id_gasto int not null AUTO_INCREMENT primary KEY,
    id_usuario int not null,
    descripcion VARCHAR(1000),
    valor_gasto BIGINT not null,
    categoria VARCHAR(100) NOT NULL,
    fecha VARCHAR(500),
    CONSTRAINT fk_gasto FOREIGN KEY (id_usuario) REFERENCES administrador(id_usuario)
    ON DELETE CASCADE
);


