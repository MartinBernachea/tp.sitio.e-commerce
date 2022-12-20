export const createNewCategory = async (params) => {
    console.log("Ejecutamos createNewCategory")

    const resp = await fetch(window.location.origin + "/admin/panel/createNewCategory", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}