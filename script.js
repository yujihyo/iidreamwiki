document.querySelectorAll("h2").forEach(function(title){

let anchor = document.createElement("a");

anchor.href = "#" + title.id;

anchor.textContent = " #";

anchor.style.color = "#999";
anchor.style.fontSize = "14px";
anchor.style.textDecoration = "none";

title.appendChild(anchor);

});