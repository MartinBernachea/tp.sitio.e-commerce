
const createNewCategory = async (params) => {
    const resp = await fetch(window.location.origin + "/admin/panel/createNewCategory", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}

const importedScript = async (...params) => {
    console.log("Ejecutamos createNewCategory")
    return await createNewCategory(...params);
}