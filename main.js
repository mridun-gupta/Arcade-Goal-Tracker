/* popUp() Logic */
function popUp(ImgSrc) {
    const imageContainer = document.getElementById("imageContainer");
    const popUpDiv = document.getElementById("popUp");

    imageContainer.src = ImgSrc;
    popUpDiv.style.display = "flex";
}

/* dismissPopUp() Logic */
function dismissPopUp() {
    const popUpDiv = document.getElementById("popUp");

    popUpDiv.style.display = "none";
}