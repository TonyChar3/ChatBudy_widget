let n,a=!1;const l=`
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
        background-color: #0c64f2;
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
        max-height: 90%;
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
`,p=async t=>{try{if(sessionStorage.getItem("widgetLoaded")||sessionStorage.getItem("convoClosed"))return;const e=await(await fetch("http://localhost:8080/visitor/visitor-info",{method:"get",headers:{"Content-Type":"application/json"}})).json(),i=await c(e,t);await d(t)&&i&&sessionStorage.setItem("widgetLoaded",!0)}catch(o){console.log("Load up sequence ERROR: ",o)}},c=async(t,o)=>{try{const e={isoCode:t.info.country.iso_code,browser:navigator.userAgent},r=await(await fetch(`http://localhost:8080/visitor/new-visitor-${o}`,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json();return h("visitor_jwt",r.visitorToken.jwtToken),!0}catch(e){return console.log(e),!1}},d=async t=>{try{const o={u_hash:t},e=s("visitor_jwt");if(e)return await fetch("http://localhost:8080/chat/new-room",{method:"post",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify(o)})||console.log("No chatrooms found...reset everything"),!0}catch(o){return console.log(o),!1}},m=async(t,o)=>{try{if(t&&!sessionStorage.getItem("convoClosed")&&sessionStorage.getItem("widgetLoaded")){const e=s("visitor_jwt"),r=await(await fetch("http://localhost:8080/chat/auth-ws",{method:"post",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({user_hash:t})})).json();if(r.visitor_not_found)o.close(),sessionStorage.removeItem("widgetLoaded"),document.cookie="visitor_jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;",sessionStorage.setItem("convoClosed",!0);else if(r.wss_connection)return n=new WebSocket(`ws://localhost:8080?id=${r.wss_connection}`),n}}catch(e){console.log("ERROR opening the chat: ",e)}},g=t=>{if(t&&n)return n},_=()=>{try{const t=s("visitor_jwt");n&&t&&n.close()}catch(t){console.log("ERROR closing the chat: ",t)}},u=t=>{if(t)if(t.value!==""){const o={senderType:"visitor",content:t.value};n.send(JSON.stringify(o)),t.value="",a=!1}else(!t.value||t.value==="")&&(t.value="",a=!1)},f=t=>{const o=JSON.stringify({type:"typing",status:!0});n&&(t!==""&&!a?(n.send(o),a=!0):t===""&&(a=!1))},w=t=>{if(t||t===""){const o={type:"set-email",visitor_email:t};n.send(JSON.stringify(o))}},b=async t=>{try{const o=s("visitor_jwt");if(!o)return;const i=await(await fetch("http://localhost:8080/widget/sse-auth",{method:"post",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({user_access:t})})).json();if(!i){console.log("ERROR (500): Unable to provide live notification");return}return i}catch(o){console.log("ERROR setting up the widget connection: ",o)}};function h(t,o){const e=`${encodeURIComponent(t)}=${encodeURIComponent(o)}`;document.cookie=e}function s(t){const e=document.cookie.split("; ");for(let i=0;i<e.length;i++){const r=e[i].split("=");if(r[0]===t)return r[1]}return null}export{f as E,p as L,w as S,u as a,l as b,b as c,g,m as o,_ as s};
