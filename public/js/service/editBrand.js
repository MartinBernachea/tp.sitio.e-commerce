export const editBrand = async (params) => {
    const resp = await fetch(window.location.origin + "/admin/panel/editBrand", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}