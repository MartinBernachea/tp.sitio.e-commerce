export const deleteCategory = async (params) => {
    console.log("Ejecutamos deleteCategory")

    const resp = await fetch(window.location.origin + "/admin/panel/deleteCategory", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}

