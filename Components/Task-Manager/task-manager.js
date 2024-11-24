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

//Naib

const task_add_btn = document.getElementById("task-add-task-btn");
const taskadd_slide = document.querySelector(".task-manager-task-add-slide");
const taskedit_slide = document.querySelector(".task-manager-task-edit-slide");
const task_slid_close_btn = document.getElementById("task-m-close-slide-btn");
const task_slide_close_btn = document.getElementById("task-m-close-edit-slide-btn");
const task_edit_btn =document.getElementById("task-edit-btn");
task_add_btn.addEventListener("click",()=>{
    taskadd_slide.style.display = "block";
})
task_slid_close_btn.addEventListener("click",()=>{
    taskadd_slide.style.display = "none";
})

task_edit_btn.addEventListener("click",()=>{
    taskedit_slide.style.display = "block";
})
task_slide_close_btn.addEventListener("click",()=>{
    taskedit_slide.style.display = "none";
})
// Add event listener for the Edit button in the expanded view
