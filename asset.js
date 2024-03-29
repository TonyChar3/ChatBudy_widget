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
    .widget-position__right {
        bottom: 28px;
        right: 40px;
    }
    .widget-open__left {
        bottom: 28px;
        right: 40px;
    }
    @media (min-width: 1024px){
        .widget-open__left {
            bottom: 28px;
            left: 40px;
        }
    }
    .widget-position__right {
        bottom: 28px;
        right: 40px;
    }
    .widget-position__left {
        bottom: 28px;
        left: 40px;
    }
    .widget-position-open__left {
        left: 0;
        right: 40px;
    }
    .widget-button__container {
        position: relative;
        border: none;
        width: 65px;
        height: 65px;
        cursor: pointer;
        box-shadow: -3px 0px 19px -3px rgba(0,0,0,0.4);
    }
    .widget-button__open {
        left: auto;
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
        .widget-button__open {
            top: 0;
            bottom: 28px;
            left: 250px;
        }
    }
    .chatroom__wrapper.hidden {
        display: none;
    }
    .widget__header {
        padding: 1em;
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
        font-size: 1.9rem;
        font-weight: 400;
        margin-bottom: .2em;
    }
    #chatbot__status {
        font-size: 0.90rem;
    }
    #chatbot__status p {
        font-size: 1.05rem;
    }
    @media (min-width: 1024px) {
        #chatroom__title {
            font-size: 1.6rem;
        }
        #chatbot__status p {
            font-size: 1.01rem;
        }
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
    .widget__content,
    .widget__content-left {
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
        .widget__content-left {
            position: absolute;
            width: 390px;
            height: auto;
            max-width: 400px;
            top: auto;
            right: auto;
            left: -26px;
            bottom: 40px;
            border-radius: 15px;
        }
        .widget__header {
            border-radius: 15px 15px 0 0;
        }
    }
    .mute-notification-icon {
        position: absolute;
        margin: .3em;
        right: 13%;
        font-size: 1.2rem;
        cursor: pointer;
    }
    .mute-notification-icon:active {
        transform: scale(0.90);
        transition: all 0.3s ease;
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
        height: 87%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        transition: transform .2s ease;
        background: url(https://res.cloudinary.com/dskpbps9l/image/upload/v1698324746/ChatBudy.io/Increase_Your_Sales_25_yqxvac.png);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    @media (min-width: 1024px) {
        .chatroom__wrapper {
            height: 450px;
            border-radius: 0 0 15px 15px;
        }
    }
    .chatroom__container {
        max-height: 95%;
        width: 100%;
        overflow-y: auto;
        display: grid;
        grid-template-columns: 1fr;
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
        max-width: 45%;
        height: auto;
        margin: 1.01em;
        border-radius: 0 0 10px 10px;
        font-size: 1.1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.05);
    }
    .success-offline__chat {
        display: inline-block;
        max-width: 60%;
        height: auto;
        padding: .5em;
        margin: 1.01em;
        border-radius: 10px 10px 10px 0;
        font-size: 1.1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.05);
    }
    .greeting-offline__chat {
        display: inline-block;
        max-width: 50%;
        height: auto;
        margin: 1.01em;
        border-radius: 0 0 10px 10px;
        font-size: 1.1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.05);
    }
    @media (min-width: 1024px) {
        .chatroom__chat {
            font-size: 1rem;
        }
        .greeting-offline__chat {
            font-size: 1rem;
            margin: 1em 0 .5em 1em;
        }
        .success-offline__chat {
            font-size: 1rem;
            margin: 1em 0 .5em 1em;
        }
    }
    .chatroom__email-input-div {
        display: inline-block;
        max-width: 50%;
        height: auto;
        margin: 1.05em 1.05em;
        padding: .5em; 
        border-radius: 10px 10px 10px 0;
    }
    @media (min-width: 1024px) {
        .chatroom__email-input-div {
            margin: 1em 0 .5em 1em;
        }
    }
    .closed__convo_btn-div {
        display: inline-block;
        max-width: 50%;
        height: auto;
        margin: 1em;
        padding: .5em; 
        border-radius: 10px 10px 10px 0;
    }
    .chatroom__email-input {
        width: 100%;
        padding: .4em;
        border-bottom: 1px solid #c9c8c5;
        font-size: 1rem;
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
    .chatroom__chat.left,
    .greeting-offline__chat.left {
        border-radius: 10px 10px 10px 0;
        align-self: flex-start;
        justify-self: flex-start;
    }
    .chatroom__chat.right,
    .greeting-offline__chat.right {
        color: white;
        border-radius: 10px 10px 0 10px;
        align-self: flex-end;
        justify-self: flex-end;
    }
    .chatroom__chat span,
    .greeting-offline__chat span {
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
        padding: 1.1em;
        color: #gray-500;
        font-size: 1.1rem;
        border: none;
        outline: none;
        resize: none;
        white-space: pre-wrap;
        word-wrap: break-word;
        background: transparent;
    }
    .offline__textarea-input {
        height: auto;
        max-width: 79%;
        padding: .5em;
        margin: 1em;
        border: none;
        outline: none;
        resize: none;
        overflow-y: auto;
        color: #gray-500;
        font-size: 1.05rem;
        white-space: pre-wrap;
        word-wrap: break-word;
        background: transparent;
        border-radius: 10px 10px 10px 0;
    }
    @media (min-width: 1024px) {
        .chat__input {
            max-width: 100%;
            max-height: 30%;
            font-size: 1rem;
        }
        .offline__textarea-input {
            font-size: 1rem;
            margin: 1em 0 .5em 1em;
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
                const security_hash = sessionStorage.getItem("visitor")
                // const token = getCookie('visitor_jwt');
                const ws_auth_fetch = await fetch('https://chatbudy-api.onrender.com/chat/auth-ws',{
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(security_hash)}`
                    },
                    body: JSON.stringify({ user_hash: widget_id })
                });
                // the fetch request will return the jwt with the hash and jwt inside
                const data = await ws_auth_fetch.json();
                if(data.visitor_not_found){
                    // close the SSE connection
                    sse_connection.close();
                    // Remove widgetLoaded from session storage
                    sessionStorage.removeItem('widgetLoaded');
                    // remove the state and access id of the widget
                    localStorage.removeItem('chatbudy_state');
                    // Open the closed conversation message
                    sessionStorage.setItem('convoClosed', true);
                } else if(data.wss_connection){
                    sse_connection = null
                    // the WS connection will be made with the same jwt inside the params
                    socket = new WebSocket(`wss://chatbudy-api.onrender.com?id=${data.wss_connection}`);
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
        if(socket){
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
        socket.send(JSON.stringify({
            type: "set-email",
            visitor_email: email_value
        }))
    }
};
/**
 * Set up the SSE connection of the widget
 */
export const SetupSSEconnection = async(widget_id) => {
    try{
        const security_hash = sessionStorage.getItem("visitor")
        const response = await fetch('https://chatbudy-api.onrender.com/code/sse-auth',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(security_hash)}`
            },
            credentials: 'include',
            body: JSON.stringify({ user_hash: widget_id })
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
 * Offline email submit
 */
export const OfflineSendEmail = async(widget_id, email_from, email_content) => {
    try{
        // will send the user_hash and the httpOnly cookie jwt 
        //TODO: credentials: 'include' once in production to send the httpOnly cookie
        const security_hash = sessionStorage.getItem("visitor")
        await fetch(`https://chatbudy-api.onrender.com/visitor/send-email-${widget_id}`,{
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(security_hash)}`
            },
            body: JSON.stringify({ from: email_from, content: email_content })
        });
        return;
    } catch(err){
        console.log('ERROR sending email. try again or contact support');
    }
}
/**
 * Dev env set a cookie
 */
// function getCookie(name) {
//     const cookieString = window.parent.document.cookie
//     const cookies = cookieString.split('; ');
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].split('=');
//       if (cookie[0] === name) {
//         return cookie[1];
//       }
//     }
//     return null;
// }