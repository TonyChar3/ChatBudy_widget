let socket,sentIsTyping=!1;export const styles="\n    .main__container * {\n        box-sizing: border-box;\n        scroll-behavior: smooth;\n    } \n    .widget__content h3, p, input {\n        margin: 0;\n        padding: 0;\n    }\n    .widget__icon {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n        height: 100%;\n        border-radius: 15px;\n        cursor: pointer;\n        transition: transform .6s ease-in-out;\n        color: white;\n    }\n    .widget__icon i {\n        font-size: 1.8rem;\n    }\n    .widget__hidden {\n        display: none;\n    }\n    .content__hidden {\n        transform: scale(0);\n    }\n    .widget-position__right {\n        bottom: 28px;\n        right: 40px;\n    }\n    .widget-open__left {\n        bottom: 28px;\n        right: 40px;\n    }\n    @media (min-width: 1024px){\n        .widget-open__left {\n            bottom: 28px;\n            left: 40px;\n        }\n    }\n    .widget-position__right {\n        bottom: 28px;\n        right: 40px;\n    }\n    .widget-position__left {\n        bottom: 28px;\n        left: 40px;\n    }\n    .widget-position-open__left {\n        left: 0;\n        right: 40px;\n    }\n    .widget-button__container {\n        position: relative;\n        border: none;\n        width: 65px;\n        height: 65px;\n        cursor: pointer;\n        box-shadow: -3px 0px 19px -3px rgba(0,0,0,0.4);\n    }\n    .widget-button__open {\n        left: auto;\n    }\n    .widget-button__container:hover {\n        transform: scale(1.1);\n        transition-duration: .2s;\n        transition-timing-function: ease-in-out;\n    }\n    .widget-button__container:active {\n        transform: scale(0.9);\n        transition-duration: .1s;\n        transition-timing-function: ease-in-out;\n    }\n    .widget-button__container > i {\n        font-size: 5rem;\n    }\n    @media (min-width: 1024px) {\n        .widget-button__container {\n          width: 70px;\n          height: 70px;\n        }\n        .widget-button__open {\n            top: 0;\n            bottom: 28px;\n            left: 250px;\n        }\n    }\n    .chatroom__wrapper.hidden {\n        display: none;\n    }\n    .widget__header {\n        padding: 1em;\n        box-shadow: inset 0px -26px 31px -30px rgba(255,255,255,0.9);\n        border-bottom: 1px;\n        boder-color: transparent;\n    }\n    .header-icons__container {\n        padding: .4em;\n        width: 100%;\n        display: flex;\n        flex-direction: row;\n        justify-content: flex-start;\n        align-items: center;\n    }\n    #chatroom__title {\n        font-family: 'Noto Sans', sans-serif;\n        font-size: 1.9rem;\n        font-weight: 400;\n        margin-bottom: .2em;\n    }\n    #chatbot__status {\n        font-size: 0.90rem;\n    }\n    #chatbot__status p {\n        font-size: 1.05rem;\n    }\n    @media (min-width: 1024px) {\n        #chatroom__title {\n            font-size: 1.6rem;\n        }\n        #chatbot__status p {\n            font-size: 1.01rem;\n        }\n    }\n    .status-circle__icon {\n        margin-right: .4em;\n        font-size: 0.65rem;\n        \n    }\n    .status__online {\n        color: #1af033;\n    }\n    .status__offline {\n        color: #ff2929;\n    }\n    .widget-chatroom__header {\n        position: relative;\n        padding: .2em;\n        display: flex;\n        flex-direction: column;\n        justify-content: start;\n        align-items: start;\n    }\n    .widget__content,\n    .widget__content-left {\n        position: fixed;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n        transition: transform .2s ease-in-out;\n        box-shadow: -3px 0px 19px -3px rgba(0,0,0,0.4);\n        scrollbar-width: thin;\n        scrollbar-color: #c9c8c5 transparent;\n    }\n    @media (min-width: 1024px) {\n        .widget__content {\n            position: absolute;\n            width: 390px;\n            height: auto;\n            max-width: 400px;\n            top: auto;\n            left: auto;\n            right: -26px;\n            bottom: 40px;\n            border-radius: 15px;\n        }\n        .widget__content-left {\n            position: absolute;\n            width: 390px;\n            height: auto;\n            max-width: 400px;\n            top: auto;\n            right: auto;\n            left: -26px;\n            bottom: 40px;\n            border-radius: 15px;\n        }\n        .widget__header {\n            border-radius: 15px 15px 0 0;\n        }\n    }\n    .close-icon {\n        position: absolute;\n        margin: .2em;\n        right: .6em;\n        cursor: pointer;\n    }\n    .chevron-icon {\n        font-size: 1.4rem;\n        color: white;\n    }\n    .help-icon {\n        position: absolute;\n        right: .8em;\n        cursor: pointer;\n    }\n    .chatroom__wrapper {\n        font-family: 'Noto Sans', sans-serif;\n        height: 87%;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        justify-content: flex-end;\n        transition: transform .2s ease;\n        background: url(https://res.cloudinary.com/dskpbps9l/image/upload/v1698324746/ChatBudy.io/Increase_Your_Sales_25_yqxvac.png);\n        background-position: center center;\n        background-repeat: no-repeat;\n        background-size: cover;\n    }\n    @media (min-width: 1024px) {\n        .chatroom__wrapper {\n            height: 450px;\n            border-radius: 0 0 15px 15px;\n        }\n    }\n    .chatroom__container {\n        max-height: 95%;\n        width: 100%;\n        overflow-y: auto;\n        display: grid;\n        grid-template-columns: 1fr;\n        background-attachment: fixed;\n        transition: all 0.3s ease-in-out;\n    }\n    .chatroom__email-form-container,\n    .closed__convo_msg-container {\n        width: auto;\n        height: auto;\n        display: flex;\n        flex-direction: column;\n    }\n    .chatroom__chat {\n        display: inline-block;\n        max-width: 40%;\n        height: auto;\n        margin: 1.01em;\n        border-radius: 0 0 10px 10px;\n        font-size: 1.1rem;\n        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.05);\n    }\n    @media (min-width: 1024px) {\n        .chatroom__chat {\n            font-size: 1rem;\n        }\n    }\n    .chatroom__email-input-div,\n    .closed__convo_btn-div {\n        display: inline-block;\n        max-width: 50%;\n        height: auto;\n        margin: 1.01em 1.01em 0 1.01em;\n        padding: .5em;\n        border: 2px solid #0c64f2; \n        border-radius: 10px 10px 10px 0;\n    }\n    .chatroom__email-input {\n        width: 100%;\n        padding: .4em;\n        border-bottom: 1px solid #c9c8c5;\n        font-size: 0.90rem;\n        outline: none;\n    }\n    .set__input-error {\n        border-bottom: 2px solid red;\n    }\n    .chatroom__email-input:focus {\n        border-bottom: 1px solid #0c64f2;\n    }\n    .chatroom__submit-btn-div {\n        display: flex;\n        justify-content: space-between;\n        max-width: 50%;\n        height: auto;\n        margin: .3em 1.01em .5em 1.01em;\n        padding: .2em;\n    }\n    .chatroom__email-buttons,\n    .start__conversation-button {\n        padding: .4em;\n        border: 1px solid #0c64f2;\n        border-radius: 10px;\n        color: #0c64f2;\n        font-size: 0.95rem;\n        font-style: #0c64f2;\n    }\n    .chatroom__email-buttons:active {\n        border: 1px solid #c9c8c5;\n        color: #c9c8c5;\n        transform: scale(0.70);\n        transition: 0.2s all ease-in-out;\n    }\n    .chatroom__chat.left {\n        border-radius: 10px 10px 10px 0;\n        align-self: flex-start;\n        justify-self: flex-start;\n    }\n    .chatroom__chat.right {\n        color: white;\n        border-radius: 10px 10px 0 10px;\n        align-self: flex-end;\n        justify-self: flex-end;\n    }\n    .chatroom__chat span {\n        word-break: break-word;\n        display: inline-block;\n        max-width: 100%;\n        padding: .5em;\n    }\n    .chat__line-divider {\n        width: 90%;\n        height: 2px;\n        margin: .1em auto;\n        background-color: #c9c8c5;\n    }\n    .chat__input-divider {\n        width: 8%;\n        height: 2px;\n        margin: 0 auto;\n        background-color: #c9c8c5;\n    }\n    .chat__input {\n        height: auto;\n        max-height: 20%;\n        max-width: 79%;\n        overflow-y: auto;\n        padding: 1em;\n        color: #gray-500;\n        font-size: 1.1rem;\n        border: none;\n        outline: none;\n        resize: none;\n        white-space: pre-wrap;\n        word-wrap: break-word\n    }\n    @media (min-width: 1024px) {\n        .chat__input {\n            max-width: 100%;\n            max-height: 30%;\n            font-size: 1rem;\n        }\n    }\n    .chat__footer {\n        width: 100%;\n        padding: .4em .5em;\n        border-radius: 0 0 10px 10px;\n    }\n    .chat__footer h2 {\n        font-size: 0.70rem;\n        color: #6e6e6e;\n    }\n    .widget__content .chatroom__container ::-webkit-scrollbar {\n        width: 6px;\n    }\n    .widget__content .chatroom__container ::-webkit-scrollbar-track {\n        background-color: transparent;\n    } \n    .widget__content .chatroom__container ::-webkit-scrollbar-thumb {\n        margin: .2em;\n        background-color: transparent;\n        border-radius: 4px;\n    }\n    .widget__content .chat__input ::-webkit-scrollbar-track {\n        background-color: transparent;\n    } \n    .widget__content .chat__input ::-webkit-scrollbar-thumb {\n        background-color: transparent;\n    }\n    #loading {\n        width: 100%;\n        height: 100%;\n        margin: 6em 0;\n    }\n    .spinner {\n        width: 60px;\n        height: 60px;\n        margin: 0 auto;\n        border: 3px solid rgba(157, 158, 157, 0.3);\n        border-radius: 50%;\n        animation: spin 1s linear infinite;\n    }\n    .unread_chat_count__span{\n        position: absolute;\n        right: -3%;\n        bottom: 75%;\n        width: 24px;\n        height: 24px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        border-radius: 100%;\n        color: white;\n        font-size: 1.1rem;\n        background-color: #f75252;\n    }\n    @media (min-width: 1024px) {\n        .widget__content .chatroom__container ::-webkit-scrollbar-thumb {\n            margin: .2em;\n            background-color: #c9c8c5;\n            border-radius: 4px;\n        }\n    }\n    @keyframes spin {\n        0% { transform: rotate(0deg); }\n        100% { transform: rotate(360deg); }\n    }\n";export const openChat=async(n,t)=>{try{if(n&&!sessionStorage.getItem("convoClosed")&&sessionStorage.getItem("widgetLoaded")){const o=getCookie("visitor_jwt"),e=await fetch("http://localhost:8080/chat/auth-ws",{method:"post",headers:{"Content-Type":"application/json",Authorization:"Bearer "+o},body:JSON.stringify({user_hash:n})}),i=await e.json();if(i.visitor_not_found)t.close(),sessionStorage.removeItem("widgetLoaded"),localStorage.removeItem("chatbudy_state"),document.cookie="visitor_jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;",sessionStorage.setItem("convoClosed",!0);else if(i.wss_connection)return socket=new WebSocket(`ws://localhost:8080?id=${i.wss_connection}`),socket}}catch(n){console.log("ERROR opening the chat: ",n)}};export const getWSlink=n=>{if(n&&socket)return socket};export const stopChat=()=>{try{const n=getCookie("visitor_jwt");socket&&n&&socket.close()}catch(n){console.log("ERROR closing the chat: ",n)}};export const sendChat=n=>{if(n)if(""!==n.value){const t={senderType:"visitor",content:n.value};socket.send(JSON.stringify(t)),n.value="",sentIsTyping=!1}else n.value&&""!==n.value||(n.value="",sentIsTyping=!1)};export const EmitIsTyping=n=>{const t=JSON.stringify({type:"typing",status:!0});socket&&(""===n||sentIsTyping?""===n&&(sentIsTyping=!1):(socket.send(t),sentIsTyping=!0))};export const SetVisitorEmail=n=>{if(n||""===n){const t={type:"set-email",visitor_email:n};socket.send(JSON.stringify(t))}};export const SetupSSEconnection=async n=>{try{const t=getCookie("visitor_jwt");if(!t)return;const o=await fetch("http://localhost:8080/code/sse-auth",{method:"post",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({user_hash:n})}),e=await o.json();return e||void console.log("ERROR (500): Unable to provide live notification")}catch(n){console.log("ERROR setting up the widget connection: ",n)}};function getCookie(n){const t=window.parent.document.cookie.split("; ");for(let o=0;o<t.length;o++){const e=t[o].split("=");if(e[0]===n)return e[1]}return null}