var logged = false;
function closeMenu(){
    const menuList = document.getElementById("menu-list");
    const loggedmenuList = document.getElementById("menu-list-logged");
    
    if (menuList && menuList.style.display !== "none") {
        menuList.style.display = "none";
    }
    if (loggedmenuList && loggedmenuList.style.display !== "none") {
        loggedmenuList.style.display = "none";
    }
}
function changeMenuList(){
    closeMenu();
    logged = !logged;
}
window.addEventListener('load',()=>{
    document.querySelector(".preloader").style.display = 'grid';
    document.querySelector(".home").style.display = 'none';
});
document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(() => {
        document.querySelector(".preloader").style.display = 'none';
        document.querySelector(".home").style.display = 'block';
    }, 2000);
});
document.getElementById("menu").addEventListener('click', () => {
    let menuname = "menu-list";
    if(!logged){
        menuname = "menu-list";
    }
    else{
        menuname = "menu-list-logged";
    }
    const menuList = document.getElementById(menuname);
    const menu = document.getElementById("menu");
    if (menuList.style.display === "none" || menuList.style.display === "") {
        menuList.style.display = "block";
        menu.style.transform = "rotate(270deg)";
    } else {
        menuList.style.display = "none";
        menu.style.transform = "rotate(0deg)";
    }
});
document.getElementById("Login-btn").addEventListener('click',()=>{
    closeMenu();
    document.getElementById("login-sigin").style.display = "block";
    document.getElementById("slide").style.display = "none";
})
document.getElementById("login-slide-btn").addEventListener('click',()=>{
    closeMenu();
    document.getElementById("login-sigin").style.display = "block";
    document.getElementById("slide").style.display = "none";
})
document.querySelectorAll(".close-btn")[0].addEventListener('click', () => {
    document.getElementById("login-sigin").style.display = "none";
    document.getElementById("slide").style.display = "flex";
});
document.querySelectorAll(".close-btn")[1].addEventListener('click', () => {
    document.getElementById("login-sigin").style.display = "none";
    document.getElementById("slide").style.display = "flex";
});
document.getElementById("signin-slide").addEventListener("click",()=>{
    document.querySelector(".login").style.display = "none";
    document.querySelector(".signup").style.display = "block";
})
document.getElementById("login-slide").addEventListener("click",()=>{
    document.querySelector(".login").style.display = "block";
    document.querySelector(".signup").style.display = "none";
})



