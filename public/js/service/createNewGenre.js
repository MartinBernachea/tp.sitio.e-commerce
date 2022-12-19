const createNewGenre = async (params) => {
    const resp = await fetch(window.location.origin + "/admin/createNewGenre", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}

const importedScript = async (...params) => {
    console.log("EJECUTAMOS SCRIPT")
    return await createNewGenre(...params);
}