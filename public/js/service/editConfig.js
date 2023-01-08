export const editConfig = async (params) => {
    const resp = await fetch(window.location.origin + "/super/panel/editConfig", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json();
}