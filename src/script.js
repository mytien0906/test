const socket = io();

const formChat = document.querySelector("#formChat");
const inputChat = document.querySelector("#inputChat");
const chatMessage = document.querySelector("#chat_messages");
const chatBoxBody = document.querySelector("#chat_box_body");
let userName = "";
if (!userName) {
  userName = prompt("Your name is: ");
  socket.emit("username", userName);
  localStorage.setItem("userName", JSON.stringify(userName));
}
formChat?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputChat.value) {
    socket.emit("message", {
      username: userName,
      message: inputChat.value,
    });
    inputChat.value = "";
  }
});

let user = {};
if (localStorage.getItem("userName")) {
  user = JSON.parse(localStorage.getItem("userName"));
}
const createMessage = (data) => {
  const { message, username } = data;
  if (user === username) {
    chatMessage.innerHTML += `
    <div class="profile my-profile">
    
    <a href="/detail" >
      <img
        src="https://images.unsplash.com/photo-1537396123722-b93d0acd8848?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=efc6e85c24d3cfdd15cd36cb8a2471ed"
        width="30"
        height="30"
      />
    </a>
      <span>${username}</span>
        <div class="message my-message">${message}</div>
    `;
  } else if (user === "") {
    chatMessage.innerHTML = "";
  } else {
    if (message !== "") {
      chatMessage.innerHTML += `
      <div class="profile other-profile">
      <img
        src="https://images.unsplash.com/photo-1537396123722-b93d0acd8848?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=efc6e85c24d3cfdd15cd36cb8a2471ed"
        width="30"
        height="30"
      />
      <span>${username}</span>
    </div>
        <div class="message other-message"></span>${message}</div>
    `;
    }
  }
  chatBoxBody.scrollTo(0, chatBoxBody.scrollHeight);
};
socket.on("message", (data) => {
  createMessage(data);
});

socket.on("messages", (data) => {
  data.forEach((element) => {
    createMessage(element);
  });
});
