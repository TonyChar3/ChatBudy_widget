import{styles,openChat,stopChat,sendChat,EmitIsTyping,SetVisitorEmail,getWSlink,SetupSSEconnection}from"./asset.js";import{LoadUpsequence}from"./LoaderTemplate.js";class SalezyWidget{constructor(t=`${JSON.parse(localStorage.getItem("chatbudy_style")).position}`){this.position=t,this.style=JSON.parse(localStorage.getItem("chatbudy_style")),this.ask_email_copy=this.style.greeting_message,this.ask_email_page=!0,this.widgetID=JSON.parse(localStorage.getItem("chatbudy_state")).access_id,this.adminStatus=!1,this.DOMLoaded=!1,this.mute_sound=!1,this.open=!1,this.visitor={},this.unreadChatCount=0,this.SSElink=null,this.initialize(),this.injectWidgetStyles(),this.LoadUpsequence=LoadUpsequence,this.LoadUpsequence(),this.openChat=openChat,this.openChat(),this.stopChat=stopChat,this.stopChat(),this.sendChat=sendChat,this.sendChat(),this.EmitIsTyping=EmitIsTyping,this.EmitIsTyping(),this.SetVisitorEmail=SetVisitorEmail,this.SetVisitorEmail(),this.getWSlink=getWSlink,this.getWSlink()}position="";open=!1;info=!1;widgetContent=null;async initialize(){const t=document.createElement("div");t.classList.add("main__container"),t.style.position="fixed",t.style.zIndex="20","right"===this.position?t.classList.add("widget-position__right"):t.classList.add("widget-position__left"),window.parent.document.body.appendChild(t),this.mainWidgetContainer=t;const e=document.createElement("audio");e.setAttribute("id","notification_sound"),e.setAttribute("src","https://res.cloudinary.com/dskpbps9l/video/upload/v1698331731/ChatBudy.io/notifications-sound-chatbudy1_w5vh0i.mp3"),this.notification_sound=e;const i=document.createElement("button");switch(i.classList.add("widget-button__container"),i.style.backgroundColor=`${this.style.main_color}`,this.style.shape){case"square":i.style.borderRadius="15px";break;case"circle":i.style.borderRadius="50%"}this.buttonContainer=i;const n=document.createElement("div");n.innerHTML='<i class="fa-regular fa-messages-question"></i>',n.classList.add("widget__icon"),n.style.color=""+("light"===this.style.font_color?"white":"#3f3f46"),n.addEventListener("click",this.toggleOpen.bind(this)),this.widgetIcon=n;const s=document.createElement("div");s.innerHTML='<i class="fa-sharp fa-light fa-paper-plane-top"></i>',s.classList.add("widget__icon","widget__hidden"),s.style.color=""+("light"===this.style.font_color?"white":"#3f3f46"),s.addEventListener("click",(()=>{this.sendChat(this.chat_room_input),this.chat_room_input.value=""})),this.sendIcon=s;const a=document.createElement("span");a.textContent=this.unreadChatCount,a.classList.add("unread_chat_count__span"),this.unreadChatCountSpan=a,i.appendChild(this.widgetIcon),i.appendChild(this.sendIcon),this.widgetContainer=document.createElement("div"),"right"===this.position?this.widgetContainer.classList.add("widget__content"):this.widgetContainer.classList.add("widget__content-left"),this.widgetContainer.classList.add("content__hidden"),document.addEventListener("DOMContentLoaded",(()=>{this.DOMLoaded||(this.handleSSEConnection(),this.DOMLoaded=!0)})),this.createWidgetContent(),t.appendChild(this.widgetContainer),t.appendChild(i)}createWidgetContent(){this.widgetContainer.innerHTML=`\n      <div style="background-color: ${this.style.main_color}; color: ${"light"===this.style.font_color?"white":"#3f3f46"};" class="widget__header">\n        <div class="header-icons__container">\n          <span class="close-icon">\n            <i class="fa-solid fa-arrow-right-from-arc"></i>\n          </span>\n        </div>\n        <div id="chatbot__status">\n          <h3 id="chatroom__title">${this.style.admin_name}</h3>\n          <p><i class="fa-solid fa-circle status-circle__icon ${this.adminStatus?"status__online":"status__offline"}"></i>${this.adminStatus?"Online":"Offline"}</p>\n        </div>\n      </div>\n    `;const t=document.createElement("div");t.classList.add("chatroom__wrapper");const e=document.createElement("div");e.classList.add("chatroom__container");const i=document.createElement("textarea");i.setAttribute("id","chat-room__input"),i.setAttribute("type","text"),i.setAttribute("placeholder","chat..."),i.classList.add("chat__input");const n=document.createElement("div");n.classList.add("chat__line-divider");const s=document.createElement("div");s.classList.add("chat__input-divider");const a=document.createElement("div"),o=document.createElement("div"),d=document.createElement("h2");d.textContent="powered by ChatBüdy 💬",a.classList.add("chat__footer"),o.appendChild(d),a.appendChild(o),t.appendChild(e),t.appendChild(n),t.appendChild(i),t.appendChild(s),t.appendChild(a),this.chatRoomContainer=e,this.chatRoomPage=t;const l=document.createElement("div");l.setAttribute("id","loading"),l.style.display="block";const h=document.createElement("div");h.classList.add("spinner"),h.style.borderTopColor=this.style.main_color,l.appendChild(h),this.loadingAnimationDIV=l,this.loadingAnimationDIV.style.display="none",this.chatRoomContainer.appendChild(l),this.widgetContainer.appendChild(t);const c=this.widgetContainer.querySelector(".fa-arrow-right-from-arc"),r=this.widgetContainer.querySelector("#chat-room__input");this.chat_room_input=r,this.chat_input_divider=s,this.close_button=c,this.chat_room_input.addEventListener("input",(t=>this.EmitIsTyping(t.target.value))),this.close_button.addEventListener("click",this.toggleOpen.bind(this)),this.chat_input_divider.classList.add("widget__hidden"),this.chat_room_input.classList.add("widget__hidden")}injectWidgetStyles(){const t=document.createElement("style");t.innerHTML=styles.replace(/^\s+|\n/gm,""),window.parent.document.head.appendChild(t)}hanldeChatStyles(t,e){const i=document.createElement("div"),n=document.createElement("span");i.classList.add("chatroom__chat"),"..."===t?(i.classList.add("left"),i.classList.add("is_typing_chat"),n.innerText=`${t}`,i.appendChild(n)):t&&e&&(i.classList.add("agent"===t?"left":"right"),i.style.backgroundColor="agent"===t?"#d1d1d1":`${this.style.main_color}`,i.style.color="visitor"===t&&"light"===this.style.font_color?"white":"#3f3f46",n.innerText=`${e}`,i.appendChild(n)),this.chatRoomContainer.appendChild(i),requestAnimationFrame((()=>{this.chatRoomContainer.scrollTop=this.chatRoomContainer.scrollHeight}))}handleEmailSubmit(){const t=this.chatroom__email_input.value.replace(/[^\w\s@.\-]/gi,"");/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)&&""!==this.chatroom__email_input.value?(this.chatroom__email_input.classList.remove("set__input-error"),this.SetVisitorEmail(t),this.chatroom__email_input.value=""):(this.chatroom__email_input.value="",this.chatroom__email_input.classList.add("set__input-error"))}handleNopeSubmitEmail(){this.chatroom__email_input.value="",this.SetVisitorEmail("")}handleEmailFormState(){const t=document.createElement("div"),e=document.createElement("span");t.classList.add("chatroom__chat"),t.classList.add("left"),t.style.backgroundColor="#d1d1d1",t.style.color="#3f3f46",e.innerText=`${this.ask_email_copy}`,t.appendChild(e);const i=document.createElement("div");i.classList.add("chatroom__email-input-div"),i.style.border=`2px solid ${this.style.main_color}`;const n=document.createElement("input");n.setAttribute("type","text"),n.setAttribute("placeholder","email@adress.com"),n.classList.add("chatroom__email-input"),n.addEventListener("focus",(()=>{n.style.borderBottomColor=`${this.style.main_color}`})),i.appendChild(n);const s=document.createElement("div");s.classList.add("chatroom__submit-btn-div");const a=document.createElement("button"),o=document.createElement("button");a.innerText="sure 👍",o.innerText="nope 👎",a.classList.add("chatroom__email-buttons"),a.style.border=`1px solid ${this.style.main_color}`,a.style.color=`${this.style.main_color}`,o.classList.add("chatroom__email-buttons"),o.style.border=`1px solid ${this.style.main_color}`,o.style.color=`${this.style.main_color}`,s.appendChild(a),s.appendChild(o),this.chatroom__sure_btn=a,this.chatroom__nope_btn=o,this.chatroom__email_input=n;const d=document.createElement("div");d.classList.add("chatroom__email-form-container"),this.emailFormContainer=d,this.emailFormContainer.appendChild(t),this.emailFormContainer.appendChild(i),this.emailFormContainer.appendChild(s),this.chatRoomContainer.appendChild(this.emailFormContainer),this.chatroom__sure_btn.addEventListener("click",this.handleEmailSubmit.bind(this)),this.chatroom__nope_btn.addEventListener("click",this.handleNopeSubmitEmail.bind(this)),requestAnimationFrame((()=>{this.chatRoomContainer.scrollTop=this.chatRoomContainer.scrollHeight}))}handleConvoClosedMsg(){const t=document.createElement("div"),e=document.createElement("span");t.classList.add("chatroom__chat"),t.classList.add("left"),e.innerText="The conversation was closed by the admin, Thank you for you visit 👋",t.appendChild(e);const i=document.createElement("div");i.classList.add("closed__convo_btn-div");const n=document.createElement("button");n.innerText="New conversation 💬",n.classList.add("start__conversation-button"),i.appendChild(n),this.startNewConvoBtn=n;const s=document.createElement("div");s.classList.add("closed__convo_msg-container"),this.closedConversationMsgContainer=s,this.closedConversationMsgContainer.appendChild(t),this.closedConversationMsgContainer.appendChild(i),this.chatRoomContainer.appendChild(this.closedConversationMsgContainer),this.startNewConvoBtn.addEventListener("click",(()=>{sessionStorage.removeItem("convoClosed"),this.LoadUpsequence(this.widgetID),this.toggleOpen(this)}))}getChat(t){const{text:e,sender_type:i,type:n,status:s}=t;if("..."===n&&!0===s){let t;this.hanldeChatStyles(n),clearTimeout(t),t=setTimeout((()=>{const t=this.chatRoomContainer.querySelector(".is_typing_chat");t&&this.chatRoomContainer.removeChild(t)}),6e3)}else if("admin-status"===n)this.adminStatus=!!s;else{const t=this.chatRoomContainer.querySelector(".is_typing_chat");t&&this.chatRoomContainer.removeChild(t),this.hanldeChatStyles(i,e)}}async handleChatRoomState(t){if(t){const t=await openChat(this.widgetID,this.SSElink);if(t)return t.addEventListener("open",(()=>{})),t.addEventListener("message",(t=>{const e=JSON.parse(t.data);Array.isArray(e)?(this.loadingAnimationDIV.style.display="none",this.emailFormContainer&&(this.emailFormContainer.style.display="none"),this.chat_input_divider.classList.remove("widget__hidden"),this.chat_room_input.classList.remove("widget__hidden"),e.forEach((t=>{this.getChat(t)}))):"ask-email"===e.type?(this.loadingAnimationDIV.style.display="none",this.handleEmailFormState()):(this.loadingAnimationDIV.style.display="none",this.chat_input_divider.classList.remove("widget__hidden"),this.chat_room_input.classList.remove("widget__hidden"),this.getChat(e))})),t.addEventListener("error",(t=>{console.error("WebSocket error:",t)})),()=>{t.close()};t||(this.loadingAnimationDIV.style.display="none",this.handleConvoClosedMsg(),this.DOMLoaded=!1)}}handleUnreadChatState(){this.unreadChatCountSpan.textContent=this.unreadChatCount,this.unreadChatCount>0&&this.mainWidgetContainer.appendChild(this.unreadChatCountSpan)}async handleSSEConnection(){const t=await SetupSSEconnection(this.widgetID);t&&(this.SSElink=new EventSource(t.sse_link,{withCredentials:!0}),this.SSElink.addEventListener("message",(t=>{const e=JSON.parse(t.data);e>0?(this.mute_sound||this.notification_sound.play(),this.unreadChatCountSpan.textContent=e,this.buttonContainer.appendChild(this.unreadChatCountSpan)):this.buttonContainer.contains(this.unreadChatCountSpan)&&this.buttonContainer.removeChild(this.unreadChatCountSpan)})),this.SSElink.addEventListener("error",(t=>{console.error("SSE Error:",t),this.SSElink.close()})))}toggleOpen(){this.open=!this.open,this.open?("left"===this.position&&(this.mainWidgetContainer.classList.remove("widget-position__left"),this.mainWidgetContainer.classList.add("widget-open__left"),this.buttonContainer.classList.add("widget-button__open")),this.widgetContainer.style.zIndex=30,this.buttonContainer.style.zIndex=50,this.SSElink&&this.SSElink.close(),this.handleChatRoomState(this.widgetID),this.widgetIcon.classList.add("widget__hidden"),this.sendIcon.classList.remove("widget__hidden"),this.loadingAnimationDIV.style.display="block",this.widgetContainer.classList.remove("content__hidden")):(this.createWidgetContent(),this.handleSSEConnection(),"left"===this.position&&(this.mainWidgetContainer.classList.remove("widget-open__left"),this.mainWidgetContainer.classList.add("widget-position__left"),this.buttonContainer.classList.remove("widget-button__open")),this.widgetContainer.style.removeProperty("z-index"),this.buttonContainer.style.removeProperty("z-index"),this.widgetIcon.classList.remove("widget__hidden"),this.sendIcon.classList.add("widget__hidden"),this.widgetContainer.classList.add("content__hidden"),this.stopChat(this.widgetID))}}export const initializeWidget=()=>new SalezyWidget;new SalezyWidget;