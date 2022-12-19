const createNewBrand = async (params) => {
    const resp = await fetch(window.location.origin + "/admin/panel/createNewBrand", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}

const importedScript = async (...params) => {
    console.log("Ejecutamos createNewBrand")
    return await createNewBrand(...params);
}