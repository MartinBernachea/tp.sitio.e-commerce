export const editCategory = async (params) => {
    const resp = await fetch(window.location.origin + "/admin/panel/editCategory", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}