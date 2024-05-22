import { io } from 'socket.io-client';

const socket = io(
  'http://localhost:' + (import.meta.env.PORT || 4000) + '?session=receive',
);

const chat = document.querySelector('.container');

function sendMessage(message) {
  const text = document.createElement('p');
  text.innerText = message;
  chat.appendChild(text);
}

socket.on('connect', () => sendMessage(`Connected with ID: ${socket.id}`));
socket.on('SUBSCRIBE', sendMessage);
