export const editGenre = async (params) => {
    const resp = await fetch(window.location.origin + "/admin/panel/editGenre", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}