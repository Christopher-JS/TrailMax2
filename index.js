//Toggle NavBar on Mobile and desktop
const respNavHeader = document.querySelector(".resp-nav-header")
const navbarItems = document.querySelector(".nav-items-container")
const openHamburgerBtn = document.querySelectorAll(".open-menu")
const closeMenuBtn = document.querySelectorAll(".close-menu")
const emptyMainBoilerplate = document.querySelector(".empty-boiler-plate")
const mainSection = document.querySelector(".main-section")

const toggleNavbar = () => {
    if (window.matchMedia("(min-width: 800px)").matches) {
        navbarItems.classList.toggle("active-nav-items")
        emptyMainBoilerplate.classList.toggle("show-boiler-plate")
        mainSection.classList.toggle("full-main-section")
        if (!navbarItems.classList.contains("active-nav-items")) {
            respNavHeader.style.display = "flex"
        } else {
            closeMenuBtn[1].style.display = "none"
            // mainSection.style.width = "78%"
        }
    } else {
        navbarItems.classList.toggle("active-nav-items")
        if (!navbarItems.classList.contains("active-nav-items")) {
            respNavHeader.style.display = "flex"
        } else {
            respNavHeader.style.display = "none"
            openHamburgerBtn[1].style.display = "none";
            closeMenuBtn[1].style.display = "block"
        }
    }
}

openHamburgerBtn.forEach(btn => btn.addEventListener("click", toggleNavbar))
closeMenuBtn.forEach(btn => btn.addEventListener("click", toggleNavbar))


// Movie Caroussel & Slider JAVASCRIPT Logic

// Caroussel Header - Progress Bar
// JS Throttle
const throttle = (cb, delay = 1000) => {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false
        } else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, delay)
        }
    }

    return (...args) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }

        cb(...args)
        shouldWait = true
        setTimeout(timeoutFunc, delay)
    }
}
const throttledProgressBar = throttle(() => {
    document.querySelectorAll(".slider-progress-bar").forEach(calculateProgressBar)
}, 250)
window.addEventListener("resize", throttledProgressBar)

// Calculate ProgressBar
const calculateProgressBar = (progressBar) => {
    progressBar.innerHTML = ""

    const slider = progressBar.closest(".movie-caroussel").querySelector(".slider")
    const itemCount = slider.children.length
    let sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue("--slider-index"))
    const itemsPerScreen = parseInt(getComputedStyle(slider).getPropertyValue("--items-per-screen"))
    const progressBarItemsCount = Math.ceil(itemCount / itemsPerScreen)

    if (sliderIndex >= progressBarItemsCount) {
        slider.style.setProperty("--slider-index", progressBarItemsCount - 1)
        sliderIndex = progressBarItemsCount - 1
    }
    // console.log(progressBarItemsCount)

    for (let i = 0; i < progressBarItemsCount; i++) {
        const barItem = document.createElement("div")
        barItem.classList.add("progress-item")
        if (i === sliderIndex) {
            barItem.classList.add("active")
        }
        progressBar.append(barItem);
    }
}
document.querySelectorAll(".slider-progress-bar").forEach(calculateProgressBar)

// OnClick of left and right handle
document.addEventListener("click", e => {
    let handle;
    if (e.target.matches(".handle")) {
        handle = e.target
    } else {
        handle = e.target.closest(".handle")
    }
    if (handle !== null) onHandleClick(handle)
})

const onHandleClick = (handle) => {
    const progressBar = handle.closest(".movie-caroussel").querySelector(".slider-progress-bar")
    const slider = handle.closest(".movie-container").querySelector(".slider")
    const sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue("--slider-index"))

    const progressBarItemsCount = progressBar.children.length

    if (handle.classList.contains("left-handle")) {
        if (sliderIndex - 1 < 0) {
            slider.style.setProperty("--slider-index", progressBarItemsCount - 1)
            progressBar.children[sliderIndex].classList.remove("active")
            progressBar.children[progressBarItemsCount - 1].classList.add("active")

        } else {
            slider.style.setProperty("--slider-index", sliderIndex - 1)
            progressBar.children[sliderIndex].classList.remove("active")
            progressBar.children[sliderIndex - 1].classList.add("active")
        }
    }


    if (handle.classList.contains("right-handle")) {
        if (sliderIndex + 1 >= progressBarItemsCount) {
            slider.style.setProperty("--slider-index", 0)
            progressBar.children[sliderIndex].classList.remove("active")
            progressBar.children[0].classList.add("active")
        } else {
            slider.style.setProperty("--slider-index", sliderIndex + 1)
            progressBar.children[sliderIndex].classList.remove("active")
            progressBar.children[sliderIndex + 1].classList.add("active")
        }

    }
}