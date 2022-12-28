export const createNewBrand = async (params) => {
    console.log("Ejecutamos createNewBrand")

    const resp = await fetch(window.location.origin + "/admin/panel/createNewBrand", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}