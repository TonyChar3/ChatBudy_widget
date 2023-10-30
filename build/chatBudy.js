import{styles,openChat,stopChat,sendChat,EmitIsTyping,SetVisitorEmail,getWSlink,SetupSSEconnection}from"./asset.js";import{LoadUpsequence}from"./LoaderTemplate.js";class SalezyWidget{constructor(t=`${JSON.parse(localStorage.getItem("chatbudy_style")).position}`){this.position=t,this.style=JSON.parse(localStorage.getItem("chatbudy_style")),this.ask_email_copy=this.style.greeting_message,this.ask_email_page=!0,this.widgetID=JSON.parse(localStorage.getItem("chatbudy_state")).access_id,this.adminStatus=!1,this.DOMLoaded=!1,this.mute_sound=!1,this.open=!1,this.visitor={},this.unreadChatCount=0,this.SSElink=null,this.initialize(),this.injectWidgetStyles(),this.LoadUpsequence=LoadUpsequence.bind(this),this.openChat=openChat.bind(this),this.stopChat=stopChat.bind(this),this.sendChat=sendChat.bind(this),this.EmitIsTyping=EmitIsTyping.bind(this),this.SetVisitorEmail=SetVisitorEmail.bind(this),this.getWSlink=getWSlink.bind(this)}position="";open=!1;info=!1;widgetContent=null;async initialize(){const t=document.createElement("div");t.classList.add("main__container"),t.style.position="fixed",t.style.zIndex="20","right"===this.position?t.classList.add("widget-position__right"):t.classList.add("widget-position__left"),window.parent.document.body.appendChild(t),this.mainWidgetContainer=t;const e=document.createElement("audio");e.setAttribute("id","notification_sound"),e.setAttribute("src","https://res.cloudinary.com/dskpbps9l/video/upload/v1698331731/ChatBudy.io/notifications-sound-chatbudy1_w5vh0i.mp3"),this.notification_sound=e;const i=document.createElement("button");switch(i.classList.add("widget-button__container"),i.style.backgroundColor=`${this.style.main_color}`,this.style.shape){case"square":i.style.borderRadius="15px";break;case"circle":i.style.borderRadius="50%"}this.buttonContainer=i;const s=document.createElement("div");s.innerHTML='<i class="fa-regular fa-messages-question"></i>',s.classList.add("widget__icon"),s.style.color=""+("light"===this.style.font_color?"white":"#3f3f46"),s.addEventListener("click",this.toggleOpen.bind(this)),this.widgetIcon=s;const n=document.createElement("div");n.innerHTML='<i class="fa-sharp fa-light fa-paper-plane-top"></i>',n.classList.add("widget__icon","widget__hidden"),n.style.color=""+("light"===this.style.font_color?"white":"#3f3f46"),n.addEventListener("click",(()=>{this.sendChat(this.chat_room_input),this.chat_room_input.value=""})),this.sendIcon=n;const o=document.createElement("span");o.textContent=this.unreadChatCount,o.classList.add("unread_chat_count__span"),this.unreadChatCountSpan=o,i.appendChild(this.widgetIcon),i.appendChild(this.sendIcon),this.widgetContainer=document.createElement("div"),"right"===this.position?this.widgetContainer.classList.add("widget__content"):this.widgetContainer.classList.add("widget__content-left"),this.widgetContainer.classList.add("content__hidden"),document.addEventListener("DOMContentLoaded",(()=>{this.DOMLoaded||(this.handleSSEConnection(),this.DOMLoaded=!0)})),this.createWidgetContent(),t.appendChild(this.widgetContainer),t.appendChild(i)}createWidgetContent(){this.widgetContainer.innerHTML=`\n      <div style="background-color: ${this.style.main_color}; color: ${"light"===this.style.font_color?"white":"#3f3f46"};" class="widget__header">\n        <div class="header-icons__container">\n          <span class="mute-notification-icon">\n            <i class="fa-solid fa-bell${this.mute_sound?"-slash":""}"></i>\n          </span>\n          <span class="close-icon">\n            <i class="fa-solid fa-arrow-right-from-arc"></i>\n          </span>\n        </div>\n        <div id="chatbot__status">\n          <h3 id="chatroom__title">${this.style.admin_name}</h3>\n          <p><i class="fa-solid fa-circle status-circle__icon ${this.adminStatus?"status__online":"status__offline"}"></i>${this.adminStatus?"Online":"Offline"}</p>\n        </div>\n      </div>\n    `;const t=document.createElement("div");t.classList.add("chatroom__wrapper");const e=document.createElement("div");e.classList.add("chatroom__container");const i=document.createElement("textarea");i.setAttribute("id","chat-room__input"),i.setAttribute("type","text"),i.setAttribute("placeholder","chat..."),i.classList.add("chat__input");const s=document.createElement("div");s.classList.add("chat__line-divider");const n=document.createElement("div");n.classList.add("chat__input-divider");const o=document.createElement("div"),a=document.createElement("div"),d=document.createElement("h2");d.textContent="powered by ChatBüdy 💬",o.classList.add("chat__footer"),a.appendChild(d),o.appendChild(a),t.appendChild(e),t.appendChild(s),t.appendChild(i),t.appendChild(n),t.appendChild(o),this.chatRoomContainer=e,this.chatRoomPage=t;const l=document.createElement("div");l.setAttribute("id","loading"),l.style.display="block";const r=document.createElement("div");r.classList.add("spinner"),r.style.borderTopColor=this.style.main_color,l.appendChild(r),this.loadingAnimationDIV=l,this.loadingAnimationDIV.style.display="none",this.chatRoomContainer.appendChild(l),this.widgetContainer.appendChild(t);const c=this.widgetContainer.querySelector(".mute-notification-icon"),h=this.widgetContainer.querySelector(".fa-arrow-right-from-arc"),m=this.widgetContainer.querySelector("#chat-room__input");this.chat_room_input=m,this.chat_input_divider=n,this.mute_button=c,this.close_button=h,this.chat_room_input.addEventListener("input",(t=>this.EmitIsTyping(t.target.value))),this.close_button.addEventListener("click",this.toggleOpen.bind(this)),this.mute_button.addEventListener("click",(()=>{this.mute_sound=!this.mute_sound;const t=this.mute_button.querySelector("i");this.mute_sound?(t.classList.remove("fa-bell"),t.classList.add("fa-bell-slash")):(t.classList.remove("fa-bell-slash"),t.classList.add("fa-bell"))})),this.chat_input_divider.classList.add("widget__hidden"),this.chat_room_input.classList.add("widget__hidden"),this.SSEhandler()}injectWidgetStyles(){const t=document.createElement("style");t.innerHTML=styles.replace(/^\s+|\n/gm,""),window.parent.document.head.appendChild(t)}hanldeChatStyles(t,e){const i=document.createElement("div"),s=document.createElement("span");i.classList.add("chatroom__chat"),"..."===t?(i.classList.add("left"),i.classList.add("is_typing_chat"),s.innerText=`${t}`,i.appendChild(s)):t&&e&&(i.classList.add("agent"===t?"left":"right"),i.style.backgroundColor="agent"===t?"#d1d1d1":`${this.style.main_color}`,i.style.color="visitor"===t&&"light"===this.style.font_color?"white":"#3f3f46",s.innerText=`${e}`,i.appendChild(s)),this.chatRoomContainer.appendChild(i),requestAnimationFrame((()=>{this.chatRoomContainer.scrollTop=this.chatRoomContainer.scrollHeight}))}VisitorEmailSubmit(){const t=this.chatroom__email_input.value.replace(/[^\w\s@.\-]/gi,"");/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)&&""!==this.chatroom__email_input.value?(this.chatroom__email_input.classList.remove("set__input-error"),this.SetVisitorEmail(t),this.chatroom__email_input.value=""):(this.chatroom__email_input.value="",this.chatroom__email_input.style.borderBottom="1px solid #E94E77")}OfflineVisitorEmailSubmit(){let t=this.chatRoomContainer.querySelector("#error_message");t&&t.remove();const e=this.chatroom__email_input.value.replace(/[^\w\s@.\-]/gi,"");/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)&&""!==this.chatroom__email_input.value?(this.chatroom__email_input.style.borderBottom="1px solid #6C2E9C",this.offline__textarea_input.style.border="2px solid #6C2E9C",this.chatroom__email_input.value="",this.offline__textarea_input.value="",this.emailFormContainer&&(this.emailFormContainer.style.display="none"),this.OfflineSuccessState(),localStorage.setItem("chatbudy_offline-email-sent",!0)):(this.chatroom__email_input.value="",this.chatroom__email_input.style.borderBottom="1px solid #E94E77",this.offline__textarea_input.style.border="1px solid #E94E77",this.ErrorChatStyle("Missing credentials. Please enter your email and a message :)"))}NopeSubmitEmail(){this.chatroom__email_input.value="",this.SetVisitorEmail("")}EmailFormState(){localStorage.getItem("chatbudy_offline-email-sent")&&this.OfflineSuccessState();const t=document.createElement("div"),e=document.createElement("span");t.classList.add("greeting-offline__chat"),t.classList.add("left"),t.style.backgroundColor="#d1d1d1",t.style.color="#3f3f46",e.innerText=this.adminStatus?`${this.ask_email_copy}`:"We are currently unavaible right now, please provide your email and we will get back to you as soon as possible 🙃!",t.appendChild(e);const i=document.createElement("div");i.classList.add("chatroom__email-input-div"),i.style.border=`2px solid ${this.style.main_color}`;const s=document.createElement("input");s.setAttribute("type","text"),s.setAttribute("placeholder","email@adress.com"),s.classList.add("chatroom__email-input"),s.addEventListener("focus",(()=>{s.style.borderBottomColor=`${this.style.main_color}`}));const n=document.createElement("textarea");n.classList.add("offline__textarea-input"),n.setAttribute("placeholder","Your message..."),n.style.border=`2px solid ${this.style.main_color}`,i.appendChild(s);const o=document.createElement("div");o.classList.add("chatroom__submit-btn-div");const a=document.createElement("button");a.innerText="submit 👍",a.classList.add("chatroom__email-buttons"),a.style.border=`1px solid ${this.style.main_color}`,a.style.color=`${this.style.main_color}`;const d=document.createElement("button");d.classList.add("chatroom__email-buttons"),d.innerText="I refuse 👎",d.style.border=`1px solid ${this.style.main_color}`,d.style.color=`${this.style.main_color}`;const l=document.createElement("button");l.classList.add("chatroom__email-buttons"),l.innerText="Submit 💬",l.style.border=`1px solid ${this.style.main_color}`,l.style.color=`${this.style.main_color}`;const r=document.createElement("button");r.classList.add("chatroom__email-buttons"),r.innerText="Cancel ❌",r.style.border=`1px solid ${this.style.main_color}`,r.style.color=`${this.style.main_color}`,this.adminStatus?(o.appendChild(a),o.appendChild(d)):(o.appendChild(l),o.appendChild(r)),this.chatroom__offline_submit=l,this.chatroom__offline_cancel=r,this.chatroom__sure_btn=a,this.chatroom__nope_btn=d,this.chatroom__email_input=s,this.offline__textarea_input=n;const c=document.createElement("div");c.classList.add("chatroom__email-form-container"),this.emailFormContainer=c,this.emailFormContainer.appendChild(t),this.emailFormContainer.appendChild(i),this.adminStatus||this.emailFormContainer.appendChild(n),this.emailFormContainer.appendChild(o),this.chatRoomContainer.appendChild(this.emailFormContainer),this.chatroom__offline_submit.addEventListener("click",this.OfflineVisitorEmailSubmit.bind(this)),this.chatroom__offline_cancel.addEventListener("click",this.toggleOpen.bind(this)),this.chatroom__sure_btn.addEventListener("click",this.VisitorEmailSubmit.bind(this)),this.chatroom__nope_btn.addEventListener("click",this.NopeSubmitEmail.bind(this)),requestAnimationFrame((()=>{this.chatRoomContainer.scrollTop=this.chatRoomContainer.scrollHeight}))}ErrorChatStyle(t){const e=document.createElement("div"),i=document.createElement("span");e.setAttribute("id","error_message"),e.classList.add("chatroom__chat"),e.classList.add("left"),e.style.backgroundColor="white",e.style.border="1px solid #E94E77",e.style.color="#E94E77",i.innerText=`${t}`,e.appendChild(i),this.chatRoomContainer.appendChild(e),requestAnimationFrame((()=>{this.chatRoomContainer.scrollTop=this.chatRoomContainer.scrollHeight}))}ErrorState(){}OfflineSuccessState(){const t=document.createElement("div"),e=document.createElement("span");t.classList.add("success-offline__chat"),t.classList.add("left"),t.style.backgroundColor="#d1d1d1",t.style.color="#3f3f46",e.innerText="✅ Success! Your question has been sent to our support team. Please check your inbox for our reply. Thank you for reaching out!",t.appendChild(e),this.chatRoomContainer.appendChild(t),requestAnimationFrame((()=>{this.chatRoomContainer.scrollTop=this.chatRoomContainer.scrollHeight}))}ConversationClosed(){const t=document.createElement("div"),e=document.createElement("span");t.classList.add("chatroom__chat"),t.classList.add("left"),t.style.backgroundColor="#d1d1d1",t.style.color="#3f3f46",e.innerText="The conversation was closed by the admin, Thank you for you visit 👋",t.appendChild(e);const i=document.createElement("div");i.classList.add("closed__convo_btn-div");const s=document.createElement("button");s.innerText="New conversation",s.style.border=`1px solid ${this.style.main_color}`,s.style.color=`${this.style.main_color}`,s.style.fontSize="1.2rem",s.classList.add("start__conversation-button"),i.appendChild(s),this.startNewConvoBtn=s;const n=document.createElement("div");n.classList.add("closed__convo_msg-container"),this.closedConversationMsgContainer=n,this.closedConversationMsgContainer.appendChild(t),this.closedConversationMsgContainer.appendChild(i),this.chatRoomContainer.appendChild(this.closedConversationMsgContainer),this.startNewConvoBtn.addEventListener("click",(()=>{sessionStorage.removeItem("convoClosed"),this.LoadUpsequence(this.widgetID),this.toggleOpen(this)}))}ManageChatStyle(t){const{text:e,sender_type:i,type:s,status:n}=t;if("..."===s&&!0===n){let t;this.hanldeChatStyles(s),clearTimeout(t),t=setTimeout((()=>{const t=this.chatRoomContainer.querySelector(".is_typing_chat");t&&this.chatRoomContainer.removeChild(t)}),6e3)}else if("admin-status"===s)this.adminStatus=!!n;else{const t=this.chatRoomContainer.querySelector(".is_typing_chat");t&&this.chatRoomContainer.removeChild(t),this.hanldeChatStyles(i,e)}}async WebSocketHandler(t){if(t){const t=await openChat(this.widgetID,this.SSElink);if(t)return t.addEventListener("open",(()=>{})),t.addEventListener("message",(t=>{const e=JSON.parse(t.data);Array.isArray(e)?(this.loadingAnimationDIV.style.display="none",this.emailFormContainer&&(this.emailFormContainer.style.display="none"),this.chat_input_divider.classList.remove("widget__hidden"),this.chat_room_input.classList.remove("widget__hidden"),e.forEach((t=>{this.ManageChatStyle(t)}))):"ask-email"===e.type?(this.loadingAnimationDIV.style.display="none",this.EmailFormState()):(this.loadingAnimationDIV.style.display="none",this.chat_input_divider.classList.remove("widget__hidden"),this.chat_room_input.classList.remove("widget__hidden"),this.ManageChatStyle(e))})),t.addEventListener("error",(t=>{console.error("WebSocket error:",t)})),()=>{t.close()};t||(this.loadingAnimationDIV.style.display="none",this.ConversationClosed(),this.DOMLoaded=!1)}}handleUnreadChatState(){this.unreadChatCountSpan.textContent=this.unreadChatCount,this.unreadChatCount>0&&this.mainWidgetContainer.appendChild(this.unreadChatCountSpan)}async SSEhandler(){const t=await SetupSSEconnection(this.widgetID);t&&(this.SSElink=new EventSource(t.sse_link,{withCredentials:!0}),this.SSElink.addEventListener("message",(t=>{const e=JSON.parse(t.data);"admin-status"===e.type&&(this.adminStatus=e.data),e>0?(this.mute_sound||this.notification_sound.play(),this.unreadChatCountSpan.textContent=e,this.buttonContainer.appendChild(this.unreadChatCountSpan)):this.buttonContainer.contains(this.unreadChatCountSpan)&&this.buttonContainer.removeChild(this.unreadChatCountSpan)})),this.SSElink.addEventListener("error",(t=>{console.error("SSE Error:",t),this.SSElink.close()})))}toggleOpen(){this.open=!this.open,this.open?("left"===this.position&&(this.mainWidgetContainer.classList.remove("widget-position__left"),this.mainWidgetContainer.classList.add("widget-open__left"),this.buttonContainer.classList.add("widget-button__open")),this.widgetContainer.style.zIndex=30,this.buttonContainer.style.zIndex=50,this.SSElink&&this.SSElink.close(),this.WebSocketHandler(this.widgetID),this.widgetIcon.classList.add("widget__hidden"),this.sendIcon.classList.remove("widget__hidden"),this.loadingAnimationDIV.style.display="block",this.widgetContainer.classList.remove("content__hidden")):(this.createWidgetContent(),"left"===this.position&&(this.mainWidgetContainer.classList.remove("widget-open__left"),this.mainWidgetContainer.classList.add("widget-position__left"),this.buttonContainer.classList.remove("widget-button__open")),this.widgetContainer.style.removeProperty("z-index"),this.buttonContainer.style.removeProperty("z-index"),this.widgetIcon.classList.remove("widget__hidden"),this.sendIcon.classList.add("widget__hidden"),this.widgetContainer.classList.add("content__hidden"),this.stopChat(this.widgetID))}}export const initializeWidget=()=>new SalezyWidget;new SalezyWidget;