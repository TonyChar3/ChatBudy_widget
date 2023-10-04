function getCookie(t){const e=window.parent.document.cookie.split("; ");for(let o=0;o<e.length;o++){const n=e[o].split("=");if(n[0]===t)return n[1]}return null}function setCookie(t,e){const o=`${encodeURIComponent(t)}=${encodeURIComponent(e)}`;window.parent.document.cookie=o}let useraccess="{{USER_HASH}}";const SetupIframe=async t=>{try{if(t){const e="<!DOCTYPE html></html>";if(!getCookie("visitor_jwt"))return;t.style.display="none",t.title="ChatBudy chat widget code",t.setAttribute("srcdoc",e),document.body.appendChild(t),t.onload=async()=>{const e=t.contentDocument;if(e){const t=e.createElement("link");t.rel="preconnect",t.href="https://fonts.googleapis.com";const o=e.createElement("link");o.rel="preconnect",o.href="https://fonts.gstatic.com",o.crossOrigin=!0;const n=e.createElement("link");n.rel="stylesheet",n.href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap";const s=e.createElement("script");s.src="https://chat-buddy-widget.vercel.app/chatBudy.js",s.type="module",s.async=!0,e.head.appendChild(t),e.head.appendChild(o),e.body.appendChild(s)}}}}catch(t){console.log("ERROR setting up the widget connection: ",t)}},GetWidgetStyle=async t=>{try{if(!localStorage.getItem("chatbudy_style")){const e=getCookie("visitor_jwt");if(!e)return;const o=await fetch(`http://localhost:8080/code/style-${t}`,{method:"get",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}),n=await o.json();n&&localStorage.setItem("chatbudy_style",JSON.stringify(n.widget_style))}}catch(t){console.log("ERROR setting up the widget style: ",t)}};export const setNewVisitor=async(t,e)=>{try{const o={isoCode:t.info.country.iso_code,browser:navigator.userAgent},n=await fetch(`http://localhost:8080/visitor/new-visitor-${e}`,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});return setCookie("visitor_jwt",(await n.json()).visitorToken.jwtToken),!0}catch(t){return console.log(t),!1}};export const initiateChat=async t=>{try{const e={u_hash:t},o=getCookie("visitor_jwt");if(o){return await fetch("http://localhost:8080/chat/new-room",{method:"post",headers:{"Content-Type":"application/json",Authorization:"Bearer "+o},body:JSON.stringify(e)})||console.log("No chatrooms found...reset everything"),!0}}catch(t){return console.log(t),!1}};export const LoadUpsequence=async t=>{try{if(sessionStorage.getItem("widgetLoaded")||sessionStorage.getItem("convoClosed"))return;const e=await fetch("http://localhost:8080/visitor/visitor-info",{method:"get",headers:{"Content-Type":"application/json"}}),o=await e.json(),n=await setNewVisitor(o,t);if(await initiateChat(t)&&n){sessionStorage.setItem("widgetLoaded",!0);const e=JSON.stringify({access_id:t});localStorage.getItem("chatbudy_state")||localStorage.setItem("chatbudy_state",e),await GetWidgetStyle(t);const o=document.createElement("iframe");SetupIframe(o)}}catch(t){console.log("Load up sequence ERROR: ",t)}};document.addEventListener("DOMContentLoaded",(()=>{const t=document.createElement("iframe");SetupIframe(t),LoadUpsequence(useraccess)}));