export const deleteBrand = async (params) => {
    console.log("Ejecutamos deleteBrand")

    const resp = await fetch(window.location.origin + "/admin/panel/deleteBrand", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}