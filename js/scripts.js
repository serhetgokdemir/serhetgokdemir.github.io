// Fotografi dondurme efekti
document.addEventListener("DOMContentLoaded", function() {
    const profilePic = document.querySelector(".profile-pic");

    profilePic.addEventListener("click", function() {
        profilePic.style.animation = "none";
        setTimeout(() => {
            profilePic.style.animation = "spinEffect 0.5s ease-in-out";
        }, 10);
    });
});

// Navbari cagir
fetch("/components/navbar.html")
    .then(res => res.text())
    .then(html => document.getElementsByClassName("navbar")[0].innerHTML = html);

