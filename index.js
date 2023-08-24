// Navbar open Menu Btn
let navbarOpenMenuBtn = document.querySelector("#navbar-open-menu-btn");
let navbarCloseMenuBtn = document.querySelector("#navbar-close-menu-btn");
let navbar = document.querySelector("#navbar");

// Main section open Menu Btn
let mainOpenMenuBtn = document.querySelector("#main-sect-nav-open-menu-btn");
let mainCloseMenuBtn = document.querySelector("#main-sect-close-menu-btn")

// Toggle Navbar Function
const toggleNavbar = () => {
    console.log("clicked")
    navbar.classList.toggle("active-nav");
}

var sceneStart2;
if (window.matchMedia("(min-width: 800px)").matches) {

    navbar.className += "active-nav";

    mainOpenMenuBtn.addEventListener(("click"), toggleNavbar);
    navbarOpenMenuBtn.addEventListener(("click"), toggleNavbar);

} else {
    mainOpenMenuBtn.addEventListener(("click"), () => {
        navbar.style.display = "grid"
        document.querySelector("#main-nav-header").style.display = "none"
        navbarOpenMenuBtn.style.display = "none"
    })
    navbarCloseMenuBtn.addEventListener(("click"), () => {
        navbar.style.display = "none";
        document.querySelector("#main-nav-header").style.display = "flex"
        navbarOpenMenuBtn.style.display = "block"
    })

}