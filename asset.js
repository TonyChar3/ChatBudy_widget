let socket;// variable for the WebSocket connection
let sentIsTyping = false

export const styles = `
    .main__container * {
        box-sizing: border-box;
        scroll-behavior: smooth;
    } 
    .widget__content h3, p, input {
        margin: 0;
        padding: 0;
    }
    .widget__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        cursor: pointer;
        transition: transform .6s ease-in-out;
        color: white;
    }
    .widget__icon i {
        font-size: 1.8rem;
    }
    .widget__hidden {
        display: none;
    }
    .content__hidden {
        transform: scale(0);
    }
    .widget-button__container {
        position: relative;
        border: none;
        width: 65px;
        height: 65px;
        border-radius: 15px;
        cursor: pointer;
        background-color: white;
        box-shadow: -3px 0px 19px -3px rgba(0,0,0,0.4);
    }
    .widget-button__container:hover {
        transform: scale(1.1);
        transition-duration: .2s;
        transition-timing-function: ease-in-out;
    }
    .widget-button__container:active {
        transform: scale(0.9);
        transition-duration: .1s;
        transition-timing-function: ease-in-out;
    }
    .widget-button__container > i {
        font-size: 5rem;
    }
    @media (min-width: 1024px) {
        .widget-button__container {
          width: 70px;
          height: 70px;
        }
    }
    .chatroom__wrapper.hidden {
        display: none;
    }
    .widget__header {
        padding: 1em;
        color: #fff;
        background-color: #0c64f2;
        box-shadow: inset 0px -26px 31px -30px rgba(255,255,255,0.9);
        border-bottom: 1px;
        boder-color: transparent;
    }
    .header-icons__container {
        padding: .4em;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    #chatroom__title {
        font-family: 'Noto Sans', sans-serif;
        font-size: 1.5rem;
        font-weight: 400;
        margin-bottom: .2em;
    }
    #chatbot__status {
        font-size: 0.90rem;
    }
    .status-circle__icon {
        margin-right: .4em;
        font-size: 0.65rem;
        
    }
    .status__online {
        color: #1af033;
    }
    .status__offline {
        color: #ff2929;
    }
    .widget-chatroom__header {
        position: relative;
        padding: .2em;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
    }
    .widget__content {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transition: transform .2s ease-in-out;
        box-shadow: -3px 0px 19px -3px rgba(0,0,0,0.4);
        scrollbar-width: thin;
        scrollbar-color: #c9c8c5 transparent;
    }
    @media (min-width: 1024px) {
        .widget__content {
            position: absolute;
            width: 390px;
            height: auto;
            max-width: 400px;
            top: auto;
            left: auto;
            right: -26px;
            bottom: 40px;
            border-radius: 15px;
        }
        .widget__header {
            border-radius: 15px 15px 0 0;
        }
    }
    .close-icon {
        position: absolute;
        margin: .2em;
        right: .6em;
        cursor: pointer;
    }
    .chevron-icon {
        font-size: 1.4rem;
        color: white;
    }
    .help-icon {
        position: absolute;
        right: .8em;
        cursor: pointer;
    }
    .chatroom__wrapper {
        font-family: 'Noto Sans', sans-serif;
        height: 88%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        transition: transform .2s ease;
        background-color: white;
    }
    @media (min-width: 1024px) {
        .chatroom__wrapper {
            height: 430px;
            border-radius: 0 0 15px 15px;
        }
    }
    .chatroom__container {
        max-height: 95%;
        width: 100%;
        overflow-y: auto;
        display: grid;
        grid-template-columns: 1fr;
        background-color: rgba(255,255,255,0.6);
        background-attachment: fixed;
        transition: all 0.3s ease-in-out;
    }
    .chatroom__email-form-container,
    .closed__convo_msg-container {
        width: auto;
        height: auto;
        display: flex;
        flex-direction: column;
    }
    .chatroom__chat {
        display: inline-block;
        max-width: 40%;
        height: auto;
        margin: 1.01em;
        border-radius: 0 0 10px 10px;
    }
    .chatroom__email-input-div,
    .closed__convo_btn-div {
        display: inline-block;
        max-width: 50%;
        height: auto;
        margin: 1.01em 1.01em 0 1.01em;
        padding: .5em;
        border: 2px solid #0c64f2; 
        border-radius: 10px 10px 10px 0;
    }
    .chatroom__email-input {
        width: 100%;
        padding: .4em;
        border-bottom: 1px solid #c9c8c5;
        font-size: 0.90rem;
        outline: none;
    }
    .set__input-error {
        border-bottom: 2px solid red;
    }
    .chatroom__email-input:focus {
        border-bottom: 1px solid #0c64f2;
    }
    .chatroom__submit-btn-div {
        display: flex;
        justify-content: space-between;
        max-width: 50%;
        height: auto;
        margin: .3em 1.01em .5em 1.01em;
        padding: .2em;
    }
    .chatroom__email-buttons,
    .start__conversation-button {
        padding: .4em;
        border: 1px solid #0c64f2;
        border-radius: 10px;
        color: #0c64f2;
        font-size: 0.95rem;
        font-style: #0c64f2;
    }
    .chatroom__email-buttons:active {
        border: 1px solid #c9c8c5;
        color: #c9c8c5;
        transform: scale(0.70);
        transition: 0.2s all ease-in-out;
    }
    .chatroom__chat.left {
        background-color: #d6d6d6;
        border-radius: 10px 10px 10px 0;
        align-self: flex-start;
        justify-self: flex-start;
    }
    .chatroom__chat.right {
        background-color: #0c64f2;
        color: white;
        border-radius: 10px 10px 0 10px;
        align-self: flex-end;
        justify-self: flex-end;
    }
    .chatroom__chat span {
        word-break: break-word;
        display: inline-block;
        max-width: 100%;
        padding: .5em;
    }
    .chat__line-divider {
        width: 90%;
        height: 2px;
        margin: .1em auto;
        background-color: #c9c8c5;
    }
    .chat__input-divider {
        width: 8%;
        height: 2px;
        margin: 0 auto;
        background-color: #c9c8c5;
    }
    .chat__input {
        height: auto;
        max-height: 20%;
        max-width: 79%;
        overflow-y: auto;
        padding: 1em;
        color: #gray-500;
        font-size: 1rem;
        border: none;
        outline: none;
        resize: none;
        white-space: pre-wrap;
        word-wrap: break-word
    }
    @media (min-width: 1024px) {
        .chat__input {
            max-width: 100%;
            height: 30%;
        }
    }
    .chat__footer {
        width: 100%;
        padding: .4em .5em;
        border-radius: 0 0 10px 10px;
    }
    .chat__footer h2 {
        font-size: 0.70rem;
        color: #6e6e6e;
    }
    .widget__content .chatroom__container ::-webkit-scrollbar {
        width: 6px;
    }
    .widget__content .chatroom__container ::-webkit-scrollbar-track {
        background-color: transparent;
    } 
    .widget__content .chatroom__container ::-webkit-scrollbar-thumb {
        margin: .2em;
        background-color: transparent;
        border-radius: 4px;
    }
    .widget__content .chat__input ::-webkit-scrollbar-track {
        background-color: transparent;
    } 
    .widget__content .chat__input ::-webkit-scrollbar-thumb {
        background-color: transparent;
    }
    #loading {
        width: 100%;
        height: 100%;
        margin: 6em 0;
    }
    .spinner {
        width: 60px;
        height: 60px;
        margin: 0 auto;
        border: 3px solid rgba(157, 158, 157, 0.3);
        border-top-color: #0c64f2;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    .unread_chat_count__span{
        position: absolute;
        right: -3%;
        bottom: 75%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        color: white;
        font-size: 1.1rem;
        background-color: #f75252;
    }
    @media (min-width: 1024px) {
        .widget__content .chatroom__container ::-webkit-scrollbar-thumb {
            margin: .2em;
            background-color: #c9c8c5;
            border-radius: 4px;
        }
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
/**
 * Open up the chat room
 */
export const openChat = async(widget_id, sse_connection) => {
    try{
        if(widget_id){
            if(!sessionStorage.getItem('convoClosed') && sessionStorage.getItem('widgetLoaded')){
                // will send the user_hash and the httpOnly cookie jwt 
                //TODO: credentials: 'include' once in production to send the httpOnly cookie
                const token = getCookie('visitor_jwt');
                const ws_auth_fetch = await fetch('http://localhost:8080/chat/auth-ws',{
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    },
                    body: JSON.stringify({ user_hash: widget_id })
                });
                // the fetch request will return the jwt with the hash and jwt inside
                const data = await ws_auth_fetch.json();
                if(data.visitor_not_found){
                    // close the SSE connection
                    sse_connection.close()
                    // Remove widgetLoaded from session storage
                    sessionStorage.removeItem('widgetLoaded');
                    // remove the state and access id of the widget
                    localStorage.removeItem('chatbudy_state');
                    // Remove visitor_jwt cookie
                    document.cookie = 'visitor_jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    // Open the closed conversation message
                    sessionStorage.setItem('convoClosed', true);
                } else if(data.wss_connection){
                    // the WS connection will be made with the same jwt inside the params
                    socket = new WebSocket(`ws://localhost:8080?id=${data.wss_connection}`);
                    return socket
                } 
            } 
        }
    } catch(err){
        console.log('ERROR opening the chat: ', err)
    }
};
/**
 * Function to send the socket link to the frontend
 */
export const getWSlink = (widget_id) => {
    if(widget_id && socket){
        return socket;
    }
};
/**
 * Close the Chat
 */
export const stopChat = () => {
    try{
        const token = getCookie('visitor_jwt');
        if(socket && token){
            socket.close()
        }
    } catch(err){
        console.log('ERROR closing the chat: ', err)
    }
};
/**
 * To send new chat in the room
 */
export const sendChat = (input) => {
    if(input){
        // get the chat message from the input
        if(input.value !== ''){
            // create the new chat object           
            const new_chat = {
                senderType: 'visitor',
                content: input.value
            };
            // send it to the websocket server
            socket.send(JSON.stringify(new_chat));
            input.value = ''
            sentIsTyping = false
        } else if(!input.value || input.value === ''){
            input.value = ''
            sentIsTyping = false
        }
    }
};

/**
 * To send the isTyping action
 */
export const EmitIsTyping = (input_value) => {
    const isTypingObj = JSON.stringify({ type: 'typing', status: true })

    if(socket){
        if(input_value !== '' && !sentIsTyping){
            socket.send(isTypingObj)
            sentIsTyping = true
        } else if (input_value === ''){
            sentIsTyping = false;
        }
    }
};
/**
 * Set the visitor email address
 */
export const SetVisitorEmail = (email_value) => {
    if(email_value || email_value === ''){
        // send the email to the WebSocket server
        const set_visitor_email = {
            type: "set-email",
            visitor_email: email_value
        }
        socket.send(JSON.stringify(set_visitor_email))
    }
};
/**
 * Set up the SSE connection of the widget
 */
export const SetupSSEconnection = async(widget_id) => {
    try{
        // will send the user_hash and the httpOnly cookie jwt 
        //TODO: credentials: 'include' once in production to send the httpOnly cookie
        const token = getCookie('visitor_jwt');
        if(!token){
            return
        }
        const response = await fetch('http://localhost:8080/code/sse-auth',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ user_access: widget_id })
        });
        const data = await response.json()
        if(!data){
            console.log('ERROR (500): Unable to provide live notification')
            return
        }
        return data
    } catch(err){
        console.log('ERROR setting up the widget connection: ', err)
    }
};
/**
 * Dev env set a cookie
 */

function getCookie(name) {
    const cookieString = window.parent.document.cookie
    const cookies = cookieString.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return null;
}