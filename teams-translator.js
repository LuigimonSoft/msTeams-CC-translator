const Sourcelanguage = 'fr'; //auto
const destinationlanguage = 'es';

function initChatSidebar() {
  const users = {};
  const messages = {};
  let lastSpeaker = null;
  let lastPosition = 'left';
  let isChatVisible = false;
  let autoScrollEnabled = true;
  let translate = false;

  const pastelColors = [
    'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200',
    'bg-pink-200', 'bg-indigo-200', 'bg-gray-200', 'bg-orange-200', 'bg-teal-200',
    'bg-cyan-200', 'bg-lime-200', 'bg-emerald-200', 'bg-sky-200', 'bg-violet-200',
    'bg-fuchsia-200', 'bg-rose-200', 'bg-amber-200', 'bg-light-blue-200', 'bg-warm-gray-200'
  ];

  const usedColors = new Set();

  function getUniqueColor() {
    const availableColors = pastelColors.filter(color => !usedColors.has(color));
    if (availableColors.length === 0) {
      throw new Error("Se han agotado todos los colores disponibles.");
    }
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    usedColors.add(color);
    return color;
  }

  function addUser(id, name, icon) {
    if (users[id]) {
      console.warn(`Usuario con ID ${id} ya existe. Se actualizará la información.`);
    }
    const color = getUniqueColor();
    users[id] = { name, color, icon };
    return id;
  }

  function addUser(id, name, icon) {
    if (users[id]) {
      console.warn(`Usuario con ID ${id} ya existe. Se actualizará la información.`);
    }
    const color = getUniqueColor();
    users[id] = { name, color, icon };
    return id;
  }

  function addMessage(userId, message, messageId) {
    const user = users[userId];
    if (!user) {
      console.error(`Usuario con ID ${userId} no encontrado.`);
      return;
    }
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.id = `message-${messageId}`;

    if (userId !== lastSpeaker) {
      lastPosition = lastPosition === 'left' ? 'right' : 'left';
      lastSpeaker = userId;
    }

    messageElement.className = `flex ${lastPosition === 'right' ? 'justify-end' : 'justify-start'}`;

    const messageContent = document.createElement('div');
    messageContent.className = `max-w-3/4 ${user.color} rounded-lg p-3 shadow`;

    const userInfo = document.createElement('div');
    userInfo.className = 'flex items-center mb-1';

    const iconSpan = document.createElement('img');
    iconSpan.className = '';
    iconSpan.src = user.icon;
    iconSpan.style.width = '15px';
    iconSpan.style.height = '15px';
    iconSpan.style.marginLeft = '5px';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'font-bold';
    nameSpan.textContent = user.name;

    userInfo.appendChild(iconSpan);
    userInfo.appendChild(nameSpan);

    const messageText = document.createElement('p');
    messageText.style.display = translate ? 'none' : '';
    messageText.textContent = message;

    const messageTranslation = document.createElement('p');
    messageTranslation.id = `translation-${messageId}`;
    messageTranslation.style.display = translate ? '' : 'none';
    messageTranslation.textContent = "⌛";
    

    

    messageContent.appendChild(userInfo);
    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTranslation);
    messageElement.appendChild(messageContent);

    chatMessages.appendChild(messageElement);

    if (autoScrollEnabled) {
      setTimeout(() => {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 0);
    }

    // Store the message in the messages object
    messages[messageId] = { element: messageElement, content: message, userId: userId };

    translateWithLibreTranslate(message, messageId).then(translation => {

    });
  }

  async function translateWithLibreTranslate(text, messageId) {
    try {
      const response = await fetch(`https://localhost:5000/translate`, {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: Sourcelanguage,
          target: destinationlanguage
        }),
        headers: { "Content-Type": "application/json" }
      });
      const json = await response.json();
      const messageTranslation = document.getElementById(`translation-${messageId}`);
      messageTranslation.textContent = json.translatedText;
      return json.translatedText;
    } catch (error) {
      console.log(`Error al traducir el mensaje con ID ${messageId}:`, error);
    }
  }

  function updateMessage(messageId, newMessage, icon) {
    const messageInfo = messages[messageId];
    if (!messageInfo) {
      console.error(`Mensaje con ID ${messageId} no encontrado.`);
      return;
    }

    const messageElement = messageInfo.element;
    const messageText = messageElement.querySelector('p');

    if (messageText.textContent !== newMessage) {
      messageText.textContent = newMessage;
   
      // Update the stored message content
      messages[messageId].content = newMessage;
      translateWithLibreTranslate(message, messageId).then(translation => {

      });
    }
    
    if (users[messages[messageId].userId].icon!==icon) 
      users[messages[messageId].userId].icon = icon;
  }

  function saveMessagesToJson() {
    const messagesArray = Object.entries(messages).map(([id, msg]) => ({
      id,
      content: msg.content,
      userId: msg.userId,
      userName: users[msg.userId].name
    }));

    const jsonString = JSON.stringify(messagesArray, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_messages.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Create and insert CSS
  const style = document.createElement('style');
  style.textContent = `
            /* Tailwind-inspired utility classes */
            .fixed { position: fixed; }
            .right-0 { right: 0; }
            .top-0 { top: 0; }
            .bottom-4 { bottom: 1rem; }
            .right-4 { right: 1rem; }
            .h-full { height: 100%; }
            .w-80 { width: 20rem; }
            .w-16 { width: 4rem; }
            .h-16 { height: 4rem; }
            .bg-white { background-color: #ffffff; }
            .bg-blue-500 { background-color: #3b82f6; }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
            .overflow-y-auto { overflow-y: auto; }
            .p-4 { padding: 1rem; }
            .p-3 { padding: 0.75rem; }
            .rounded-full { border-radius: 9999px; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .font-bold { font-weight: 700; }
            .mb-4 { margin-bottom: 1rem; }
            .mr-2 { margin-right: 0.5rem; }
            .text-white { color: #ffffff; }
            .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
            .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
            .duration-300 { transition-duration: 300ms; }
            .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
            .transform { --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
            .translate-x-full { --tw-translate-x: 100%; }
            .max-w-3\\/4 { max-width: 75%; }
            .rounded-lg { border-radius: 0.5rem; }
            .justify-end { justify-content: flex-end; margin-right: 10px; }
            .justify-start { justify-content: flex-start; margin-left: 10px; }
            .color-text { color: #000000; }
            .border-l { border-left-width: 1px; }
            .border-gray-200 { border-color: #e5e7eb; }
            .margin-top-120 { margin-top: 150px; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .bg-green-500 { background-color: #10b981; }
            .text-white { color: #ffffff; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .w-full { width: 100%; }
            .rounded-t { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
            .flex-grow { flex-grow: 1; }

            /* Custom scrollbar styles */
            #chat-sidebar::-webkit-scrollbar {
                width: 6px;
            }
            #chat-sidebar::-webkit-scrollbar-thumb {
                background-color: rgba(156, 163, 175, 0.5);
                border-radius: 3px;
            }
            #chat-sidebar::-webkit-scrollbar-track {
                background-color: rgba(229, 231, 235, 0.5);
            }

            #chat-sidebar {
              display: flex;
              flex-direction: column;
            }

            #chat-messages {
              flex-grow: 1;
              overflow-y: auto;
              /* padding-bottom: 60px;  Espacio para el botón de guardar */
            }

            /* Pastel background colors */
            .bg-red-200 { background-color: #fecaca; }
            .bg-blue-200 { background-color: #bfdbfe; }
            .bg-green-200 { background-color: #a7f3d0; }
            .bg-yellow-200 { background-color: #fde68a; }
            .bg-purple-200 { background-color: #ddd6fe; }
            .bg-pink-200 { background-color: #fbcfe8; }
            .bg-indigo-200 { background-color: #c7d2fe; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-gray-200 { background-color: #e5e7eb; }
            .bg-orange-200 { background-color: #fed7aa; }
            .bg-teal-200 { background-color: #99f6e4; }
            .bg-cyan-200 { background-color: #a5f3fc; }
            .bg-lime-200 { background-color: #d9f99d; }
            .bg-emerald-200 { background-color: #a7f3d0; }
            .bg-sky-200 { background-color: #bae6fd; }
            .bg-violet-200 { background-color: #ddd6fe; }
            .bg-fuchsia-200 { background-color: #f5d0fe; }
            .bg-rose-200 { background-color: #fecdd3; }
            .bg-amber-200 { background-color: #fde68a; }
            .bg-light-blue-200 { background-color: #bae6fd; }
            .bg-warm-gray-200 { background-color: #e7e5e4; }
        `;
  document.head.appendChild(style);

  // Create and insert HTML elements
  const chatSidebar = document.createElement('div');
  chatSidebar.id = 'chat-sidebar';
  chatSidebar.className = 'fixed right-0 top-0 h-full w-80 bg-gray-100 border-l border-gray-200 color-text shadow-lg overflow-hidden transition-transform duration-300 ease-in-out transform translate-x-full flex flex-col';

  const chatHeader = document.createElement('div');
  chatHeader.className = 'flex justify-between items-center mb-4';

  const chatTitle = document.createElement('h2');
  chatTitle.className = 'text-xl font-bold';
  chatTitle.textContent = 'Live caption';

  const autoScrollButton = document.createElement('button');
  autoScrollButton.id = 'toggle-autoscroll';
  autoScrollButton.className = 'bg-blue-500 text-white px-2 py-1 rounded text-sm';
  autoScrollButton.textContent = 'Auto-scroll: ON';

  const translateButton = document.createElement('button');
  translateButton.id = 'toggle-translate';
  translateButton.className = 'bg-blue-500 text-white px-2 py-1 rounded text-sm';
  translateButton.textContent = 'Translate: OFF';

  chatHeader.appendChild(chatTitle);
  chatHeader.appendChild(autoScrollButton);
  chatHeader.appendChild(translateButton);

  const chatMessages = document.createElement('div');
  chatMessages.id = 'chat-messages';
  chatMessages.className = 'space-y-4 overflow-y-auto';


  const saveButton = document.createElement('button');
  saveButton.id = 'save-messages';
  saveButton.className = 'w-full bg-green-500 text-white px-4 py-2 rounded-t shadow-lg';
  saveButton.textContent = 'Save Messages';
  saveButton.style.marginTop = '20px';

  const chatContent = document.createElement('div');
  chatContent.className = 'flex-grow overflow-y-auto';
  chatContent.appendChild(chatMessages);

  chatSidebar.appendChild(chatHeader);
  chatSidebar.appendChild(chatContent);
  chatSidebar.appendChild(saveButton);

  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggle-chat';
  toggleButton.className = 'fixed bottom-4 right-4 w-16 h-16 bg-blue-500 rounded-full shadow-lg flex items-center justify-center focus:outline-none';

  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('class', 'h-8 w-8 text-white');
  svgIcon.setAttribute('fill', 'none');
  svgIcon.setAttribute('viewBox', '0 0 24 24');
  svgIcon.setAttribute('stroke', 'currentColor');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('d', 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z');

  svgIcon.appendChild(path);
  toggleButton.appendChild(svgIcon);

  document.body.appendChild(chatSidebar);
  document.body.appendChild(toggleButton);

  // Toggle chat sidebar
  toggleButton.addEventListener('click', () => {
    isChatVisible = !isChatVisible;
    chatSidebar.classList.toggle('translate-x-full', !isChatVisible);
  });

  autoScrollButton.addEventListener('click', () => {
    autoScrollEnabled = !autoScrollEnabled;
    autoScrollButton.textContent = `Auto-scroll: ${autoScrollEnabled ? 'ON' : 'OFF'}`;
    autoScrollButton.className = `${autoScrollEnabled ? 'bg-blue-500' : 'bg-gray-500'} text-white px-2 py-1 rounded text-sm`;
  });

  translateButton.addEventListener('click', () => {
    translate = !translate;
    translateButton.textContent = `Translate: ${translate ? 'ON' : 'OFF'}`;
    translateButton.className = `${translate ? 'bg-blue-500' : 'bg-gray-500'} text-white px-2 py-1 rounded text-sm`;
  });

  // Save messages to JSON
  saveButton.addEventListener('click', saveMessagesToJson);

  // Expose public methods
  return {
    addUser: addUser,
    addMessage: addMessage,
    updateMessage: updateMessage
  };
}

// Create global object
window.ChatSidebar = initChatSidebar();



if (document.querySelector('[data-tid="closed-caption-v2-wrapper"]')) {
  const uiBoxChildren = document.querySelector('[data-tid="closed-caption-v2-wrapper"]').childNodes[0].querySelector('.ui-box').children;

  let captionElement = null;

  for (let element of uiBoxChildren) {
    if (element.classList.contains('ui-box') && element.classList.length === 1) {
      captionElement = element;
      break;
    }
  }

  if (captionElement) {
    // Configuración de las opciones del observador
    const config = { childList: true, subtree: true, attributes: true };

    const generateUniqueId = (() => {
      let id = 0;
      return () => `unique-id-${++id}`;
    })();

    const generateUserId = (() => {
      let userId = 0;
      return () => `user-id-${++userId}`;
    })();

    const generateMessageId = (() => {
      let id = 0;
      return () => `message-id-${++id}`;
    })();

    const userMap = new Map();

    // Función de callback que se ejecuta cuando hay mutaciones
    const callback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Verifica si se ha agregado un nuevo div con la clase 'fui-Flex'
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('fui-Flex')) {
              // Si es nuevo, asigna un ID único para el mensaje
              if (!node.hasAttribute('data-message-id')) {
                const messageId = generateMessageId();
                node.setAttribute('data-message-id', messageId);
              }

              // Extrae la información del usuario
              extractUserData(node,true);
            }
          });
        }

        // Si un elemento ha cambiado sus atributos o hijos
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          const node = mutation.target;
          if (node.classList.contains('fui-Flex') && node.hasAttribute('data-message-id')) {
            // Es un elemento existente que se ha actualizado
            extractUserData(node,false);
          }
        }
      }
    };

    // Función para extraer los datos del usuario y asignar un identificador único
    const extractUserData = (node, newMessage) => {
      // Extrae el ID único del mensaje
      const messageId = node.getAttribute('data-message-id');

      // Extrae el nombre del usuario
      const nameElement = node.querySelector('.ui-chat__messageheader .ui-text');
      const name = nameElement ? nameElement.textContent.trim() : null;

      // Si ya existe este usuario en el mapa, usa el ID existente
      let isNewUser = false;
      let userId;
      if (name && userMap.has(name)) {
        userId = userMap.get(name);
      } else if (name) {
        // Si es un nuevo usuario, asigna un nuevo ID y guárdalo en el mapa
        userId = generateUserId();
        userMap.set(name, userId);
        isNewUser = true;
      }

      // Extrae la imagen
      const imgElement = node.querySelector('.ui-avatar img');
      const imgSrc = imgElement ? imgElement.src : null;

      // Extrae el texto del mensaje
      const messageElement = node.querySelector('.ui-chat__messagecontent .fui-StyledText');
      const messageText = messageElement ? messageElement.textContent.trim() : null;

      if(isNewUser) {
        // Agrega el usuario al chat
        ChatSidebar.addUser(userId, name, imgSrc);
      }
      
      if(newMessage)
        ChatSidebar.addMessage(userId, messageText, messageId);
      else
        ChatSidebar.updateMessage(messageId, messageText);
    };

    // Función para verificar los elementos después de 3 segundos
    const verifyElements = () => {
      const elements = document.querySelectorAll('[data-message-id]'); // Selecciona todos los elementos con un ID de mensaje
      setTimeout(verifyElements, 3000);
      elements.forEach(node => {
        const messageId = node.getAttribute('data-message-id');
        const nameElement = node.querySelector('.ui-chat__messageheader .ui-text');
        const name = nameElement ? nameElement.textContent.trim() : null;
        const messageElement = node.querySelector('.ui-chat__messagecontent .fui-StyledText');
        const messageText = messageElement ? messageElement.textContent.trim() : null;
        const imgElement = node.querySelector('.ui-avatar img');
        const imgSrc = imgElement ? imgElement.src : null;

        window.ChatSidebar.updateMessage(messageId, messageText, imgSrc);
      });
    };

    // Crea una instancia de MutationObserver y comienza a observar el nodo objetivo
    const observer = new MutationObserver(callback);
    observer.observe(captionElement, config);

    // Ejecuta la función de verificación 3 segundos después
    setTimeout(verifyElements, 3000);

  }
}
