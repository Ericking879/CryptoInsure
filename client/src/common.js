const mobileBtn = document.getElementById("mobile-cta")
      nav = document.querySelector("nav") // don't need to say const if don't ; in prev. line
      mobileBtnExit = document.getElementById("mobile-exit");

mobileBtn.addEventListener("click", () => {
    nav.classList.add("mobile-menu");
})

mobileBtnExit.addEventListener("click", () => {
    nav.classList.remove("mobile-menu");
})