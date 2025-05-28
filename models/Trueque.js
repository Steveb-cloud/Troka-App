class Trueque {
    constructor(id_trueque, id_usuario_ofrece, id_usuario_recibe, id_producto_ofrece, id_producto_recibe, estado, fecha) {
        this.id_trueque = id_trueque;
        this.id_usuario_ofrece = id_usuario_ofrece;
        this.id_usuario_recibe = id_usuario_recibe;
        this.id_producto_ofrece = id_producto_ofrece;
        this.id_producto_recibe = id_producto_recibe;
        this.estado = estado;
        this.fecha = fecha;
    }
}

module.exports = Trueque;
