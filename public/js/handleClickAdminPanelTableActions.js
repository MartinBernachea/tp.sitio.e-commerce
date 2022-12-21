import { deleteCategory } from "./service/deleteCategory.js";
import { deleteBrand } from "./service/deleteBrand.js";
import { deleteGenre } from "./service/deleteGenre.js";

const resultsTable = document.querySelector("table")

const hiddeCurrentModal = (id) => {
    const modalRef = document.querySelector(`#modalConfirm${id}`);
    const modalContainer = modalRef.parentElement;
    if (modalContainer.classList.contains("show-modal")) modalContainer.classList.remove("show-modal")
}

const showCurrentModal = (id) => {
    const modalRef = document.querySelector(`#modalConfirm${id}`);
    /* SOLUCION BUG */
    /* 
    Habian veces donde al cargar la seccion, de forma random, el modal aparecia visible y automaticamente desaparecia:
    El modal inicialmente tiene clase con opacidad 0 y trans de opacidad de 500ms 
    (supongo que el bug se daba porque al iniciar screen aparecia con opacidad 1 y transicionaba a 0, en lugar de iniciar directo con 0).
    Se agrego una clase solo de uso inicial que ubica al modal en una posicion fuera de la screen, para que, si ese evento random sucede, 
    no sea visible
     */
    if (modalRef.parentElement.classList.contains("initial-position")) modalRef.parentElement.classList.remove("initial-position")
    /* SOLUCION BUG */

    modalRef.parentElement.classList.add("show-modal");
}
const extraerNumeroId = (prefijo, nombreEntero) => {
    return nombreEntero.slice(prefijo.length, nombreEntero.length)
}

if (resultsTable) {
    resultsTable.addEventListener("click", async (event) => {
        event.preventDefault();

        if (event.target.id.includes("modalEliminarConfirm")) {
            showCurrentModal(extraerNumeroId("modalEliminarConfirm", event.target.id))
            return
        }

        if (event.target.id.includes("btnSuccessConfirm")) {
            event.preventDefault();

            let deleteFunction;
            if (location.href.includes("categories")) deleteFunction = deleteCategory;
            if (location.href.includes("genres")) deleteFunction = deleteGenre;
            if (location.href.includes("brands")) deleteFunction = deleteBrand;

            if (deleteFunction) {
                try {
                    const response = await deleteFunction({ id: extraerNumeroId("btnSuccessConfirm", event.target.id) });
                } catch (err) {
                    console.log(err)
                } finally {
                    location.reload();
                }
            }
            return
        }

        if (event.target.id.includes("btnCancelConfirm")) {
            event.preventDefault();
            hiddeCurrentModal(extraerNumeroId("btnCancelConfirm", event.target.id))
            return
        }

        if (event.target.id.includes("modalBackgroundConfirm")) {
            hiddeCurrentModal(extraerNumeroId("modalBackgroundConfirm", event.target.id))
            return
        }
    })
}

