 const Separador=(numero)=>{
    const number=numero?numero:0;
    const numeroSeparado=number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    return numeroSeparado
}

module.exports = Separador;