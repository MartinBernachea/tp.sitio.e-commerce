export const deleteGenre = async (params) => {
    console.log("Ejecutamos deleteGenre")

    const resp = await fetch(window.location.origin + "/admin/panel/deleteGenre", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}