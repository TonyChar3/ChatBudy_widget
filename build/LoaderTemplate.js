function getCookie(t){const e=window.parent.document.cookie.split("; ");for(let o=0;o<e.length;o++){const n=e[o].split("=");if(n[0]===t)return n[1]}return null}function setCookie(t,e){const o=`${encodeURIComponent(t)}=${encodeURIComponent(e)}`;window.parent.document.cookie=o}let useraccess="{{USER_HASH}}";const SetupIframe=async t=>{try{if(t){const e="<!DOCTYPE html></html>";if(!getCookie("visitor_jwt"))return;t.style.display="none",t.title="ChatBudy chat widget code",t.setAttribute("srcdoc",e),document.body.appendChild(t),t.onload=async()=>{const e=t.contentDocument;if(e){const t=e.createElement("script");t.src="https://kit.fontawesome.com/76351f6769.js",t.crossOrigin="anonymous",e.head.appendChild(t);const o=e.createElement("link");o.rel="preconnect",o.href="https://fonts.googleapis.com";const n=e.createElement("link");n.rel="preconnect",n.href="https://fonts.gstatic.com",n.crossOrigin=!0;const s=e.createElement("link");s.href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap",s.rel="stylesheet";const i=e.createElement("script");i.src="https://chat-buddy-widget.vercel.app/chatBudy.js",i.type="module",i.async=!0,e.head.appendChild(o),e.head.appendChild(n),e.head.appendChild(s),e.body.appendChild(i)}}}}catch(t){console.log("ERROR setting up the widget connection: ",t)}},GetWidgetStyle=async t=>{try{if(!localStorage.getItem("chatbudy_style")){const e=getCookie("visitor_jwt");if(!e)return;const o=await fetch(`http://localhost:8080/code/style-${t}`,{method:"get",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}),n=await o.json();n&&(localStorage.setItem("chatbudy_mode",JSON.stringify(n.widget_chat_mode)),localStorage.setItem("chatbudy_style",JSON.stringify(n.widget_style)))}}catch(t){console.log("ERROR setting up the widget style: ",t)}};export const setNewVisitor=async(t,e)=>{try{const o={isoCode:t.info.country.iso_code,browser:navigator.userAgent},n=await fetch(`http://localhost:8080/visitor/new-visitor-${e}`,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});return setCookie("visitor_jwt",(await n.json()).visitorToken.jwtToken),!0}catch(t){return console.log(t),!1}};export const initiateChat=async t=>{try{const e={user_hash:t},o=getCookie("visitor_jwt");if(o){return await fetch("http://localhost:8080/chat/new-room",{method:"post",headers:{"Content-Type":"application/json",Authorization:"Bearer "+o},body:JSON.stringify(e)})||console.log("No chatrooms found...reset everything"),!0}}catch(t){return console.log(t),!1}};export const LoadUpsequence=async t=>{try{if(sessionStorage.getItem("widgetLoaded")||sessionStorage.getItem("convoClosed"))return;const e=await fetch("http://localhost:8080/visitor/visitor-info",{method:"get",headers:{"Content-Type":"application/json"}}),o=await e.json(),n=await setNewVisitor(o,t);if(await initiateChat(t)&&n){sessionStorage.setItem("widgetLoaded",!0);const e=JSON.stringify({access_id:t});localStorage.getItem("chatbudy_state")||localStorage.setItem("chatbudy_state",e),await GetWidgetStyle(t);const o=document.createElement("iframe");SetupIframe(o)}}catch(t){console.log("Load up sequence ERROR: ",t)}};document.addEventListener("DOMContentLoaded",(()=>{const t=document.createElement("iframe");SetupIframe(t),LoadUpsequence(useraccess)}));