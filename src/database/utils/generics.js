const isParamNotEmpty = (param) => param && param != ""

const agregarCantidadesProductos = (arrElementosSinCantidadProductos, arrCantidadesProductos) => {
    /* 
    arrElementosSinCantidadProductos: [
        { dataValues: {id} }
    ] 
    
    arrCantidadesProductos: [
        { id, cantidadProductos }
    ]

    */

    console.log("arrElementosSinCantidadProductos", arrElementosSinCantidadProductos)
    console.log("arrCantidadesProductos", arrCantidadesProductos)

    return arrElementosSinCantidadProductos.map(ctElement => {
        const formatedElement = {
            ...ctElement.dataValues
        }
        const cantidadIndex = arrCantidadesProductos.findIndex(ct => ct.id == formatedElement.id);
        formatedElement.cantidadProductos = cantidadIndex >= 0 ? arrCantidadesProductos[cantidadIndex].cantidad : 0
        return formatedElement
    })

}

module.exports = {
    isParamNotEmpty,
    agregarCantidadesProductos,
}