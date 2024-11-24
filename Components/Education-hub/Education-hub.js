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

//btns
const searchbtn = document.getElementById("Health-hub-search-bar");
const filterbtn = document.getElementById("Health-hub-filter");
const fitertypebtn = document.getElementById("Health-hub-filter-by-type");
const fiterratingbtn = document.getElementById("Health-hub-filter-by-rating");
const gridlistbtn = document.getElementById("Health-hub-grid");
const viewbtn = document.getElementById("Health-hub-view-my-tips");
const addtipbtn = document.getElementById("Health-hub-add-tip");
const changegirdlist = document.getElementById("Health-hub-container-grid-list-changer");
const addtipslide = document.querySelector(".Health-hub-container-add-slide");
const addtipslideclosebtn = document.querySelector(".Health-hub-container-add-slide-close-box");
const gridlistimg = document.getElementById("Health-hub-hrid-list-img");
const viewimg = document.getElementById("health-viewimg");
//functions
searchbtn.addEventListener("focus",()=>{
    searchbtn.style.width = "100%";
});
searchbtn.addEventListener("blur",()=>{
    searchbtn.style.width = "60%";
});
filterbtn.addEventListener("click",()=>{
    fitertypebtn.style.display = fitertypebtn.style.display === "block" ? "none" : "block";
    fiterratingbtn.style.display = fiterratingbtn.style.display === "block" ? "none" : "block";
});
gridlistbtn.addEventListener("click",()=>{
    if(gridlistimg.src.includes("app")){
        gridlistimg.src ="/assets/menu (3).png";
        changegirdlist.classList = "Health-hub-container-grid";
    } else{
        gridlistimg.src = "/assets/app (1).png";
        changegirdlist.classList = "Health-hub-container-list";
    }
})
viewbtn.addEventListener("click",()=>{
    if(viewimg.src.includes("visible")){
        viewimg.src ="/assets/visibility (1).png";
    } else{
    viewimg.src = "/assets/visible (1).png";
    }
})
addtipbtn.addEventListener("click",()=>{
    addtipslide.style.display = "flex";
    changegirdlist.style.display = "none";
})
addtipslideclosebtn.addEventListener("click",()=>{
    addtipslide.style.display = "none";
    changegirdlist.style.display = "";
})


//Database
