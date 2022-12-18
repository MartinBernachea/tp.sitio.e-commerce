const formatProductDate = (arrProducts) => {
    return arrProducts.map(ctProduct => {
        const fechaCreacion = new Date(ctProduct.createdAt);
        const formatedCreatedAt = `${fechaCreacion.getDate()}/${fechaCreacion.getMonth() + 1}/${fechaCreacion.getFullYear()}`
        const formatedProduct = { ...ctProduct.dataValues, createdAt: formatedCreatedAt }
        return formatedProduct
    })
}



module.exports = {
    formatProductDate
}