import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

function loader(element) {
  let count = 0;
  element.textContent = '';

  const intervalId = setInterval(() => {
    element.textContent += '.';
    count++;

    if (count === 4) {
      element.textContent = '';
      count = 0;
    }
  }, 300);

  return intervalId;
}

function typeText(element, text) {
  let index = 0;

  const intervalId = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(intervalId);
    }
  }, 20);

  return intervalId;
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi ? 'ai' : ''}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}">
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `;
}

async function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(form);
  const prompt = data.get('prompt');

  // User's chat stripe
  chatContainer.innerHTML += chatStripe(false, prompt);

  form.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '', uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);

  const loadInterval = loader(messageDiv);

  try {
    const response = await fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
      const { bot } = await response.json();
      const parsedData = bot.trim();
      typeText(messageDiv, parsedData);
    } else {
      throw new Error('Something went wrong with the fetch request.');
    }
  } catch (error) {
    clearInterval(loadInterval);
    messageDiv.innerHTML = 'Something went wrong!';
    console.error(error);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});