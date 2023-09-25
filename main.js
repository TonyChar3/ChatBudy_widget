import { styles, openChat, stopChat, sendChat, EmitIsTyping, SetVisitorEmail, getWSlink, SetupSSEconnection } from "./asset.js";
import { LoadUpsequence } from "./LoaderTemplate.js";

class SalezyWidget {
  constructor(position = `${JSON.parse(localStorage.getItem('chatbudy_style')).position}`) {
    this.position = position// save the position of the widget
    this.ask_email_copy = JSON.parse(localStorage.getItem('chatbudy_style')).greeting_message;
    this.ask_email_page = true;// show the input for the email and the buttons & hide the chat input
    this.widgetID = JSON.parse(localStorage.getItem('chatbudy_state')).access_id// To identify the widget for each request he makes
    this.adminStatus = false;// To set the Online - Offline status of the admin in the widget header
    this.DOMLoaded = false;
    this.open = false;// the state of the widget Open/Close
    this.visitor = {};// state for the visitor of the website
    this.unreadChatCount = 0;// Initialize the unread chat count to zero
    this.SSElink = null;// Initialize the sse link variable
    this.initialize();// To invoke and display the UI for our widget in the DOM
    this.injectWidgetStyles();// To invoke and add the styling
    this.LoadUpsequence = LoadUpsequence
    this.LoadUpsequence();
    this.openChat = openChat;
    this.openChat();
    this.stopChat = stopChat;
    this.stopChat();
    this.sendChat = sendChat;
    this.sendChat();
    this.EmitIsTyping = EmitIsTyping;
    this.EmitIsTyping();
    this.SetVisitorEmail = SetVisitorEmail;
    this.SetVisitorEmail();
    this.getWSlink = getWSlink;
    this.getWSlink();
  }
  
  position = "";
  open = false;
  info = false;
  widgetContent = null;

  /**
   * Initialize the button and the div for the widget content
   */
  async initialize() {
    /**
     * Create and append a DIV element to the body
     */
    const container = document.createElement("div");
    container.classList.add("main__container");
    container.style.position = "fixed";
    container.style.zIndex = "20";
    this.position === 'right'? container.classList.add('widget-position__right') : container.classList.add('widget-position__left')
    // Object.keys(this.position).forEach(
    //   (key) => (container.style[key] = this.position[key])
    // );
    window.parent.document.body.appendChild(container);
    this.mainWidgetContainer = container;
    /**
     * Button element with the class button__container
     */
    const buttonContainer = document.createElement("button");
    buttonContainer.classList.add("widget-button__container");
    buttonContainer.style.color = `${JSON.parse(localStorage.getItem('chatbudy_style')).font_color === 'light'? 'white' : '#3f3f46'}`
    buttonContainer.style.backgroundColor = `${JSON.parse(localStorage.getItem('chatbudy_style')).main_color}`;
    switch (JSON.parse(localStorage.getItem('chatbudy_style')).shape){
      case "square":
        buttonContainer.style.borderRadius = "15px";
        break;
      case "circle":
        buttonContainer.style.borderRadius = "50%";
        break;
      default:
        break;
    }
    this.buttonContainer = buttonContainer;
    /**
     * Span element for the Icon
     */
    const widgetIconElement = document.createElement("div");
    widgetIconElement.innerHTML = `<i class="fa-regular fa-messages-question"></i>`;
    widgetIconElement.classList.add("widget__icon");
    widgetIconElement.addEventListener("click", this.toggleOpen.bind(this));
    this.widgetIcon = widgetIconElement;
    /**
     * Span element for the send chat icon
     */
    const sendIconElement = document.createElement("div");
    sendIconElement.innerHTML = `<i class="fa-sharp fa-light fa-paper-plane-top"></i>`;
    sendIconElement.classList.add("widget__icon", "widget__hidden");
    sendIconElement.addEventListener('click', () => {
      this.sendChat(this.chat_room_input)
      this.chat_room_input.value = '';
    });
    this.sendIcon = sendIconElement;
    /**
     * Span element for the unread chats count
     */
    const unreadChatCountSpan = document.createElement("span");
    unreadChatCountSpan.textContent = this.unreadChatCount
    unreadChatCountSpan.classList.add("unread_chat_count__span");
    this.unreadChatCountSpan = unreadChatCountSpan
    /**
     * Append both icon to the container and add click event
     */
    buttonContainer.appendChild(this.widgetIcon);
    buttonContainer.appendChild(this.sendIcon);
    /**
     * Create a container for the widget and add classes
     */
    this.widgetContainer = document.createElement('div');
    this.position === 'right'? this.widgetContainer.classList.add("widget__content") : this.widgetContainer.classList.add('widget__content-left')
    this.widgetContainer.classList.add("content__hidden");
    document.addEventListener("DOMContentLoaded", () => {
      if(!this.DOMLoaded) {
        this.handleSSEConnection();
        this.DOMLoaded = true;
      }
    })
    /**
     * Invoke the createWidget Method
     */
    this.createWidgetContent();
    /**
     * Append the widgets content and the button to the container
     */
    container.appendChild(this.widgetContainer);
    container.appendChild(buttonContainer);
  }
  /**
   * What is the content showed in the widget once it's open
   */
  createWidgetContent(){
    /**
      * The widget header section
    */
    // TODO: Add a space to add the company logo, put it on left side of the header along with the close button to the right
    this.widgetContainer.innerHTML = `
      <div style="background-color: ${JSON.parse(localStorage.getItem('chatbudy_style')).main_color}; color: ${JSON.parse(localStorage.getItem('chatbudy_style')).font_color === 'light'? 'white' : '#3f3f46'};" class="widget__header">
        <div class="header-icons__container">
          <span class="close-icon">
            <i class="fa-solid fa-arrow-right-from-arc"></i>
          </span>
        </div>
        <div id="chatbot__status">
          <h3 id="chatroom__title">${JSON.parse(localStorage.getItem('chatbudy_style')).admin_name}</h3>
          <p><i class="fa-solid fa-circle status-circle__icon ${this.adminStatus? "status__online" : "status__offline"}"></i>${this.adminStatus? "Online" : "Offline"}</p>
        </div>
      </div>
    `
    /**
    * The chat room page
    */
    const chatRoomPage = document.createElement("div");
    chatRoomPage.classList.add("chatroom__wrapper");

    const chatRoomContainer = document.createElement("div");
    chatRoomContainer.classList.add("chatroom__container");

    const chatRoomInput = document.createElement("textarea");
    chatRoomInput.setAttribute("id", "chat-room__input");
    chatRoomInput.setAttribute("type", "text");
    chatRoomInput.setAttribute("placeholder", "chat...");
    chatRoomInput.classList.add("chat__input");

    const chatRoomLineDivider = document.createElement("div");
    chatRoomLineDivider.classList.add("chat__line-divider");

    const chatRoomInputDivider = document.createElement("div");
    chatRoomInputDivider.classList.add("chat__input-divider");

    const chatRoomFooterContainer = document.createElement("div");
    const chatRoomFooterLogo = document.createElement("div");
    const chatRoomLogo = document.createElement("h2");
    chatRoomLogo.textContent = "powered by ChatBüdy :)"
    chatRoomFooterContainer.classList.add("chat__footer");
    chatRoomFooterLogo.appendChild(chatRoomLogo);
    chatRoomFooterContainer.appendChild(chatRoomFooterLogo);

    chatRoomPage.appendChild(chatRoomContainer);
    chatRoomPage.appendChild(chatRoomLineDivider);
    chatRoomPage.appendChild(chatRoomInput);
    chatRoomPage.appendChild(chatRoomInputDivider);
    chatRoomPage.appendChild(chatRoomFooterContainer);
    this.chatRoomContainer = chatRoomContainer;
    this.chatRoomPage = chatRoomPage;

    /**
     * Loading animation
     */
    const loadingAnimationDIV = document.createElement("div");
    loadingAnimationDIV.setAttribute("id", "loading");
    loadingAnimationDIV.style.display = 'block';

    const animationSpinnerDIV = document.createElement("div");
    animationSpinnerDIV.classList.add("spinner");

    loadingAnimationDIV.appendChild(animationSpinnerDIV);
    this.loadingAnimationDIV = loadingAnimationDIV;
    this.loadingAnimationDIV.style.display = 'none';
    this.chatRoomContainer.appendChild(loadingAnimationDIV);

    this.widgetContainer.appendChild(chatRoomPage);

    const closeButton = this.widgetContainer.querySelector('.fa-arrow-right-from-arc');
    const chat_room_input = this.widgetContainer.querySelector('#chat-room__input');
    this.chat_room_input = chat_room_input;
    this.chat_input_divider = chatRoomInputDivider;
    this.close_button = closeButton;

    this.chat_room_input.addEventListener('input', (event) => this.EmitIsTyping(event.target.value));
    this.close_button.addEventListener("click", this.toggleOpen.bind(this));
    this.chat_input_divider.classList.add("widget__hidden");
    this.chat_room_input.classList.add("widget__hidden");
  }
  /**
  * Add the style of the widget
  */
  injectWidgetStyles(){
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");
    window.parent.document.head.appendChild(styleTag);
  }
  /**
   * Handle the type of chat
   */
  hanldeChatStyles(chat_type, chat_text){
    const chatBubbleDIV = document.createElement("div");
    const chatTextSpan = document.createElement('span');
    chatBubbleDIV.classList.add("chatroom__chat");

    if(chat_type === '...'){
      chatBubbleDIV.classList.add("left");
      chatBubbleDIV.classList.add("is_typing_chat");
      chatTextSpan.innerText = `${chat_type}`
      chatBubbleDIV.appendChild(chatTextSpan);
    } else if(chat_type && chat_text) {
      chatBubbleDIV.classList.add(chat_type === "agent"? "left" : 'right');
      chatBubbleDIV.style.backgroundColor = chat_type === "agent"? '#d6d6d6' : `${JSON.parse(localStorage.getItem('chatbudy_style')).main_color}`;
      chatBubbleDIV.style.color = `${JSON.parse(localStorage.getItem('chatbudy_style')).font_color}` === 'light'? 'white' : '#3f3f46'
      chatTextSpan.innerText = `${chat_text}`
      chatBubbleDIV.appendChild(chatTextSpan);
    }
    this.chatRoomContainer.appendChild(chatBubbleDIV);
    requestAnimationFrame(() => {
      this.chatRoomContainer.scrollTop = this.chatRoomContainer.scrollHeight;
    });
  }
  /**
   * Submit Email
   */
  handleEmailSubmit(){
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized_value = this.chatroom__email_input.value.replace(/[^\w\s@.\-]/gi, '');
    if(email_pattern.test(sanitized_value) && this.chatroom__email_input.value !== ''){
      this.chatroom__email_input.classList.remove("set__input-error")
      this.SetVisitorEmail(sanitized_value)
      this.chatroom__email_input.value = ""
    } else {
      this.chatroom__email_input.value = ""
      this.chatroom__email_input.classList.add("set__input-error")
    }
  }
  /**
   * Nope is click
   */
  handleNopeSubmitEmail(){
    this.chatroom__email_input.value = ""
    this.SetVisitorEmail('');
  }
  /**
   * Handle the email form state
   */
  handleEmailFormState(){
    // the ask email copy chat bubble
    const ask_emailBubbleDIV = document.createElement("div");
    const chatTextSpan = document.createElement('span');
    ask_emailBubbleDIV.classList.add("chatroom__chat");
    ask_emailBubbleDIV.classList.add("left");
    chatTextSpan.innerText = `${this.ask_email_copy}`
    ask_emailBubbleDIV.appendChild(chatTextSpan);
    // generate the email input and the buttons
    const chatBubbleDIV = document.createElement("div");
    chatBubbleDIV.classList.add("chatroom__email-input-div");
    const emailInput = document.createElement("input");
    emailInput.setAttribute("type", "text");
    emailInput.setAttribute("placeholder", "email@adress.com");
    emailInput.classList.add("chatroom__email-input");
    chatBubbleDIV.appendChild(emailInput)
    // Sure - Nope buttons and div
    const submitButtonDiv = document.createElement("div");
    submitButtonDiv.classList.add("chatroom__submit-btn-div");
    const submitButton = document.createElement("button");
    const refuseButton = document.createElement("button");
    submitButton.innerText = "sure 👍"
    refuseButton.innerText = "nope 👎"
    submitButton.classList.add("chatroom__email-buttons");
    refuseButton.classList.add("chatroom__email-buttons");
    submitButtonDiv.appendChild(submitButton);
    submitButtonDiv.appendChild(refuseButton);
    this.chatroom__sure_btn = submitButton;
    this.chatroom__nope_btn = refuseButton;
    this.chatroom__email_input = emailInput;
    // div container for that email copy bubble, input and buttons
    const emailFormContainer = document.createElement("div");
    emailFormContainer.classList.add("chatroom__email-form-container");
    this.emailFormContainer = emailFormContainer;
    this.emailFormContainer.appendChild(ask_emailBubbleDIV);
    this.emailFormContainer.appendChild(chatBubbleDIV);
    this.emailFormContainer.appendChild(submitButtonDiv);
    this.chatRoomContainer.appendChild(this.emailFormContainer)
    // If click submit
    this.chatroom__sure_btn.addEventListener("click", this.handleEmailSubmit.bind(this))
    // if click no
    this.chatroom__nope_btn.addEventListener("click", this.handleNopeSubmitEmail.bind(this))
    requestAnimationFrame(() => {
      this.chatRoomContainer.scrollTop = this.chatRoomContainer.scrollHeight;
    });
  }
  /**
   * admin closed the Conversation message
  */
  handleConvoClosedMsg(){
    // The conversation was closed by admin chat bubble
    const conversationClosedBubbleDIV = document.createElement("div");
    const conversationClosedTextSpan = document.createElement("span");
    conversationClosedBubbleDIV.classList.add("chatroom__chat");
    conversationClosedBubbleDIV.classList.add("left");
    conversationClosedTextSpan.innerText = 'The conversation was closed by the admin, Thank you for you visit 👋'
    conversationClosedBubbleDIV.appendChild(conversationClosedTextSpan);
    // Div button for both the start a new conversation or no
    const buttonDIV = document.createElement("div");
    buttonDIV.classList.add("closed__convo_btn-div");
    const startNewConversationBtn = document.createElement("button");
    startNewConversationBtn.innerText = "New conversation 💬"
    startNewConversationBtn.classList.add("start__conversation-button");
    buttonDIV.appendChild(startNewConversationBtn);
    this.startNewConvoBtn = startNewConversationBtn
    // Div for the chat bubble and the button div
    const closedConversationMsgContainer = document.createElement("div");
    closedConversationMsgContainer.classList.add("closed__convo_msg-container");
    this.closedConversationMsgContainer = closedConversationMsgContainer
    this.closedConversationMsgContainer.appendChild(conversationClosedBubbleDIV);
    this.closedConversationMsgContainer.appendChild(buttonDIV);
    this.chatRoomContainer.appendChild(this.closedConversationMsgContainer)
    // If keep on talking to admin is clicked
    this.startNewConvoBtn.addEventListener("click", () => {
      // re-load the widget, set a new JWT token + remove convoClosed + add widgetLoaded again
      sessionStorage.removeItem('convoClosed');
      this.LoadUpsequence(this.widgetID);
      this.toggleOpen(this)
    });
  }
  /**
   * Manage the chat room state
   */
  getChat(chat){
    const { text, sender_type, type, status } = chat
    // first check the sender type
    if(type === '...' && status === true){
      let typingTimeout;
      this.hanldeChatStyles(type)
      clearTimeout(typingTimeout)
      typingTimeout = setTimeout(() => {
        const typingBubble = this.chatRoomContainer.querySelector('.is_typing_chat')
        if(typingBubble){
          this.chatRoomContainer.removeChild(typingBubble)
        }
      },6000)

    } else if( type === 'admin-status'){
      status ? this.adminStatus = true : this.adminStatus = false
    } else {
      const typingBubble = this.chatRoomContainer.querySelector('.is_typing_chat')
      if(typingBubble){
        this.chatRoomContainer.removeChild(typingBubble)
      }
      this.hanldeChatStyles(sender_type, text)
    }

  }
  async handleChatRoomState(widget_id){
    if(widget_id){
      const socket = await openChat(this.widgetID, this.SSElink)
      if(socket){
        socket.addEventListener('open', () => {});
        socket.addEventListener('message', (event) => {
            const chat = JSON.parse(event.data)
            if(Array.isArray(chat)){
              this.loadingAnimationDIV.style.display = 'none';
              if(this.emailFormContainer){
                this.emailFormContainer.style.display = 'none';
              }
              this.chat_input_divider.classList.remove("widget__hidden")
              this.chat_room_input.classList.remove("widget__hidden")
              chat.forEach(chats => {
                this.getChat(chats)
              })
            } else if(chat.type === 'ask-email'){
              this.loadingAnimationDIV.style.display = 'none';
              this.handleEmailFormState()
            } else {
              this.loadingAnimationDIV.style.display = 'none';
              this.chat_input_divider.classList.remove("widget__hidden")
              this.chat_room_input.classList.remove("widget__hidden")
              this.getChat(chat)
            }
        });
        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
        return () => {
          socket.close();
        }
      } else if (!socket){
        this.loadingAnimationDIV.style.display = 'none';
        this.handleConvoClosedMsg();
        this.DOMLoaded = false;
      }

    }
  }
  /**
   * Set the undread chats count state
   */
  handleUnreadChatState() {
    this.unreadChatCountSpan.textContent = this.unreadChatCount;
    this.unreadChatCount > 0 ? this.mainWidgetContainer.appendChild(this.unreadChatCountSpan) : '';
  }
  /**
   * Initialize the SSE connection
   */
  async handleSSEConnection() {
    // auth for the sse
    const auth_widget = await SetupSSEconnection(this.widgetID)
    if(!auth_widget){
      return;
    }
    this.SSElink = new EventSource(auth_widget.sse_link, { withCredentials: true })
    this.SSElink.addEventListener('message', (event) => {
      const number_unreadchat = JSON.parse(event.data)
      if(number_unreadchat > 0){
        this.unreadChatCountSpan.textContent = number_unreadchat
        this.buttonContainer.appendChild(this.unreadChatCountSpan)
      } else {
        this.buttonContainer.contains(this.unreadChatCountSpan)? this.buttonContainer.removeChild(this.unreadChatCountSpan) : '';
      }
    });

    this.SSElink.addEventListener('error', (event) => {
      console.error('SSE Error:', event);
      this.SSElink.close();
    });
  }
  /**
   * Open or close the widget
   */
  toggleOpen(){
    this.open = !this.open;
    if(this.open) {
      if(this.position === 'left'){
        this.mainWidgetContainer.classList.remove('widget-position__left');
        this.mainWidgetContainer.classList.add('widget-open__left');
        this.buttonContainer.classList.add('widget-button__open');
      }
      this.widgetContainer.style.zIndex = 30
      this.buttonContainer.style.zIndex = 50
      this.SSElink ? this.SSElink.close() : '';// Shut off the SSE connection for the notifications
      this.handleChatRoomState(this.widgetID);
      this.widgetIcon.classList.add("widget__hidden");
      this.sendIcon.classList.remove("widget__hidden");
      this.loadingAnimationDIV.style.display = 'block';
      this.widgetContainer.classList.remove("content__hidden");
    } else {
      this.createWidgetContent();
      this.handleSSEConnection();
      if(this.position === 'left'){
        this.mainWidgetContainer.classList.remove('widget-open__left');
        this.mainWidgetContainer.classList.add('widget-position__left');
        this.buttonContainer.classList.remove('widget-button__open');
      }
      this.widgetContainer.style.removeProperty('z-index');
      this.buttonContainer.style.removeProperty('z-index');
      this.widgetIcon.classList.remove("widget__hidden");
      this.sendIcon.classList.add("widget__hidden");
      this.widgetContainer.classList.add("content__hidden");
      this.stopChat(this.widgetID);
    }
  }
}

export const initializeWidget = () => {
  const widgetInstance = new SalezyWidget()
  return widgetInstance
}

initializeWidget();
