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
      usedColors.clear();
      return getUniqueColor();
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
    messageText.className = 'text-raw';

    const messageTranslation = document.createElement('p');
    messageTranslation.id = `translation-${messageId}`;
    messageTranslation.style.display = translate ? '' : 'none';
    messageTranslation.textContent = "⌛";
    messageTranslation.className = 'text-translated';

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

    messages[messageId] = { element: messageElement, content: message, userId: userId };

    translateWithLibreTranslate(message, messageId).then(translation => {
      // Handle translation if needed
    });
  }

  async function translateWithLibreTranslate(text, messageId) {
    try {
      const response = await fetch(`http://localhost:5000/translate`, {
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
      messages[messageId].content = newMessage;
      translateWithLibreTranslate(newMessage, messageId).then(translation => {
        // Handle translation if needed
      });
    }

    if (users[messages[messageId].userId].icon !== icon)
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
    setupObserver();
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

// Observer setup
function setupObserver() {
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
                extractUserData(node, true);
              }
            });
          }

          // Si un elemento ha cambiado sus atributos o hijos
          if (mutation.type === 'attributes' || mutation.type === 'childList') {
            const node = mutation.target;
            if (node.classList.contains('fui-Flex') && node.hasAttribute('data-message-id')) {
              // Es un elemento existente que se ha actualizado
              extractUserData(node, false);
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

        if (isNewUser) {
          // Agrega el usuario al chat
          window.ChatSidebar.addUser(userId, name, imgSrc);
        }
        
        if (newMessage)
          window.ChatSidebar.addMessage(userId, messageText, messageId);
        else
          window.ChatSidebar.updateMessage(messageId, messageText, imgSrc);
      };

      // Función para verificar los elementos después de 3 segundos
      const verifyElements = () => {
        const elements = document.querySelectorAll('[data-message-id]'); // Selecciona todos los elementos con un ID de mensaje
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
        setTimeout(verifyElements, 3000);
      };

      
      // Crea una instancia de MutationObserver y comienza a observar el nodo objetivo
      const observer = new MutationObserver(callback);
      observer.observe(captionElement, config);

      // Ejecuta la función de verificación 3 segundos después
      setTimeout(verifyElements, 3000);
    }
  }
}

// Run the setup when the page is fully loaded
window.addEventListener('load', setupObserver);

// Additionally, run the setup when the URL changes (for single-page applications)
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setupObserver();
  }
}).observe(document, {subtree: true, childList: true});