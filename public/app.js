const socket = io();

let nickname = prompt("Please enter your nickname");
socket.emit("set nickname", nickname);

const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
const online = document.getElementById("online");
const typing = document.getElementById("typing");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        const item = document.createElement("li");
        item.innerHTML = `${nickname}: ${input.value}`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
        socket.emit("chat message", input.value);
        input.value = "";
        socket.emit("stop typing");
    }
});

input.addEventListener("input", () => {
    if (input.value) {
        socket.emit("typing");
    } else {
        socket.emit("stop typing");
    }
});

socket.on("chat message", (data) => {
    const item = document.createElement("li");
    item.textContent = `${data.user}: ${data.msg}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("user connected", (msg) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("user disconnected", (msg) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("user list", (userList) => {
    online.innerHTML = "<li>Online:</li>";
    userList.forEach((user) => {
        const item = document.createElement("li");
        item.textContent = `${user}`;
        online.appendChild(item);
    });
});

socket.on("typing", (user) => {
    typing.textContent = `${user} is typing...`;
});

socket.on("stop typing", (user) => {
    typing.textContent = '';
});