export const createNewGenre = async (params) => {
    console.log("Ejecutamos createNewGenre")

    const resp = await fetch(window.location.origin + "/admin/panel/createNewGenre", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}
