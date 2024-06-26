import { io } from 'socket.io-client';

const socket = io(
  'http://localhost:' + (import.meta.env.PORT || 4000) + '?session=send',
);

const chat = document.querySelector('.container');
const input = document.querySelector('#message');
const send = document.querySelector('#btn-send');

function sendMessage(message) {
  const text = document.createElement('p');
  text.innerText = message;
  chat.appendChild(text);
}

send.addEventListener('click', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('PUBLISH', input.value);
  }
  input.value = '';
});

input.addEventListener('keydown', function (e) {
  if (e.code === 'Enter') {
    if (input.value) {
      socket.emit('PUBLISH', input.value);
    }
    input.value = '';
  }
});

socket.on('connect', () => sendMessage(`Connected with ID: ${socket.id}`));
socket.on('SUBSCRIBE', sendMessage);
