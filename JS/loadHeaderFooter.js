document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header-container", "../HTML/header.html");
    loadComponent("footer-container", "../HTML/footer.html");
});
function loadComponent(elementID, filePath) {
     fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementID).innerHTML = data;
        })
        .catch(error => console.error("Error loading component:", error));
}