// Control The Light or Dark Mode of page

// variable for
let clicked = "light";
// get toggle
let toggle = document.getElementById("mode-toggle");

// get items to change
let htmltag = document.documentElement;
let body = document.querySelector("body");
let topnav = document.getElementsByClassName("top-nav");
let navlink = document.getElementsByClassName("nav-link");
let socialicon = document.getElementsByClassName("social-icons");
let blogitem = document.getElementsByClassName("blog-item");
let bloglink = document.getElementsByClassName("bloglink");

// check mode of page
if (localStorage.getItem("mode") != "light") {
  clicked = "dark";
  console.log("code gets here");
  // single changes
  toggle.classList.add("mode-active");
  htmltag.classList.add("mode-active");
  body.classList.add("mode-active");
  // many possible changes
  for (var i = 0; i < topnav.length; i++) {
    topnav[i].classList.add("mode-active");
  }
  for (var i = 0; i < blogitem.length; i++) {
    blogitem[i].classList.add("mode-active");
  }
  for (var i = 0; i < bloglink.length; i++) {
    bloglink[i].classList.add("mode-active");
  }
  for (var i = 0; i < navlink.length; i++) {
    navlink[i].classList.add("mode-active");
  }
  for (var i = 0; i < socialicon.length; i++) {
    socialicon[i].classList.add("mode-active");
  }
}

// control what happens upon clicking
toggle.onclick = function () {
  switch (clicked) {
    case "light":
      clicked = "dark";
      localStorage.setItem("mode", "dark");
      break;
    case "dark":
      clicked = "light";
      localStorage.setItem("mode", "light");
      break;
  }
  console.log(localStorage.getItem("mode"));
  // single changes
  toggle.classList.toggle("mode-active");
  htmltag.classList.toggle("mode-active");
  body.classList.toggle("mode-active");
  // many possible changes
  for (var i = 0; i < topnav.length; i++) {
    topnav[i].classList.toggle("mode-active");
  }
  for (var i = 0; i < blogitem.length; i++) {
    blogitem[i].classList.toggle("mode-active");
  }
  for (var i = 0; i < bloglink.length; i++) {
    bloglink[i].classList.toggle("mode-active");
  }
  for (var i = 0; i < navlink.length; i++) {
    navlink[i].classList.toggle("mode-active");
  }
  for (var i = 0; i < socialicon.length; i++) {
    socialicon[i].classList.toggle("mode-active");
  }
};
