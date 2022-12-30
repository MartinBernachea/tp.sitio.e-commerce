export const getProductsLike = async (params) => {
    console.log("Ejecutamos getProductsLike")

    let URLFetch = new URL(window.location.origin + "/products/search")
    URLFetch.search = new URLSearchParams(params).toString();
    const resp = await fetch(URLFetch)
    return await resp.json();
}