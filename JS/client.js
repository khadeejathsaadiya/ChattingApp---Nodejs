const socket = io('http://localhost:8009');

//Get DOM elements in respective JS variables 
const form = document.getElementById('send-container');
const messageInput= document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages 
var audio = new Audio('ting.mp3');

//function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    //  messageElement.style.border = "1px solid red";  // Add border for visibility
    // console.log(messageElement);  // Log to see the element structure
    messageContainer.append(messageElement);
    if(position == 'left') {
        audio.play();
    }
}

//ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//if a new user joins ,receive his/her name from the server 
socket.on('user-joined', name =>{
    append(`${name} joined the chat`,'right');
    // console.log(`${name} joined the chat`);
    // console.log(`${name} joined`);
})

//If server sends a message , receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

//If a user leaves a chat , append the info to the container 
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
})

//If the form gets submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})