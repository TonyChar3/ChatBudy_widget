let useraccess="{{USER_HASH}}";const SetupIframe=async t=>{try{if(t){const e="<!DOCTYPE html></html>";t.style.display="none",t.title="ChatBudy chat widget code",t.setAttribute("srcdoc",e),document.body.appendChild(t),t.onload=async()=>{const e=t.contentDocument;if(e){const t=e.createElement("script");t.src="https://kit.fontawesome.com/76351f6769.js",t.crossOrigin="anonymous",e.head.appendChild(t);const o=e.createElement("link");o.rel="preconnect",o.href="https://fonts.googleapis.com";const n=e.createElement("link");n.rel="preconnect",n.href="https://fonts.gstatic.com",n.crossOrigin=!0;const s=e.createElement("link");s.href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap",s.rel="stylesheet";const a=e.createElement("script");a.src="https://chat-buddy-widget.vercel.app/chatBudy.js",a.type="module",a.async=!0,e.head.appendChild(o),e.head.appendChild(n),e.head.appendChild(s),e.body.appendChild(a)}}}}catch(t){console.log("ERROR setting up the widget connection: ",t)}},GetWidgetStyle=async t=>{try{if(!localStorage.getItem("chatbudy_style")){const e=await fetch(`https://chatbudy-api.onrender.com/code/style-${t}`,{method:"get",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},credentials:"include"}),o=await e.json();o&&localStorage.setItem("chatbudy_style",JSON.stringify(o.widget_style))}}catch(t){console.log("ERROR setting up the widget style: ",t)}};export const setNewVisitor=async(t,e)=>{try{const o=await fetch(`https://chatbudy-api.onrender.com/visitor/new-visitor-${e}`,{method:"post",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({isoCode:t.info.country.iso_code,browser:navigator.userAgent})}),n=await o.json();return console.log(n),!0}catch(t){return console.log(t),!1}};export const initiateChat=async t=>{try{const e={user_hash:t};return await fetch("https://chatbudy-api.onrender.com/chat/new-room",{method:"post",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},credentials:"include",body:JSON.stringify(e)})||console.log("No chatrooms found...reset everything"),!0}catch(t){return console.log(t),!1}};export const LoadUpsequence=async t=>{try{if(sessionStorage.getItem("widgetLoaded")||sessionStorage.getItem("convoClosed"))return;const e=await fetch("https://chatbudy-api.onrender.com/visitor/visitor-info",{method:"get",headers:{"Content-Type":"application/json"}}),o=await e.json(),n=await setNewVisitor(o,t);if(await initiateChat(t)&&n){sessionStorage.setItem("widgetLoaded",!0);const e=JSON.stringify({access_id:t});localStorage.getItem("chatbudy_state")||localStorage.setItem("chatbudy_state",e),await GetWidgetStyle(t);const o=document.createElement("iframe");SetupIframe(o)}}catch(t){console.log("Load up sequence ERROR: ",t)}};document.addEventListener("DOMContentLoaded",(()=>{const t=document.createElement("iframe");SetupIframe(t),LoadUpsequence(useraccess)}));