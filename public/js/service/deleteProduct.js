export const deleteProduct = async (params) => {
    console.log("Ejecutamos deleteProduct")

    const resp = await fetch(window.location.origin + "/admin/panel/deleteProduct", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}