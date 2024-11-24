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
    const menuList = document.getElementById('menu-list');
    const menu = document.getElementById("menu");
    if (menuList.style.display === "none" || menuList.style.display === "") {
        menuList.style.display = "block";
        menu.style.transform = "rotate(270deg)";
    } else {
        menuList.style.display = "none";
        menu.style.transform = "rotate(0deg)";
    }
    const cred = document.querySelector(".userCred");
    if(cred.style.display === "flex"){
        cred.style.display = "none";
    }
});
document.getElementById("myProfile").addEventListener('click',()=>{
    document.querySelector(".userCred").style.display = "flex";
    document.getElementById('menu-list').style.display = "none";
})
document.getElementById("userCred-close-btn").addEventListener('click',()=>{
    document.querySelector(".userCred").style.display = "none";
})
document.getElementById("add-motivation-btn").addEventListener('click',()=>{
    document.querySelector(".Motivation-Container-list").style.display = "none";
    document.querySelector(".Motivation-Container-add-Tab").style.display = "flex";
})
document.getElementById("Motivation-Container-add-Tab-close-btn").addEventListener('click',()=>{
    document.querySelector(".Motivation-Container-list").style.display = "flex";
    document.querySelector(".Motivation-Container-add-Tab").style.display = "none";
})