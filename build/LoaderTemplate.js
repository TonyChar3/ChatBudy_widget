let useraccess="{{USER_HASH}}";const SetupIframe=async e=>{try{if(e){const t="<!DOCTYPE html></html>";e.style.display="none",e.title="ChatBudy chat widget code",e.setAttribute("srcdoc",t),document.body.appendChild(e),e.onload=async()=>{const t=e.contentDocument;if(t){const e=t.createElement("script");e.src="https://kit.fontawesome.com/76351f6769.js",e.crossOrigin="anonymous",t.head.appendChild(e);const o=t.createElement("link");o.rel="preconnect",o.href="https://fonts.googleapis.com";const s=t.createElement("link");s.rel="preconnect",s.href="https://fonts.gstatic.com",s.crossOrigin=!0;const n=t.createElement("link");n.href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap",n.rel="stylesheet";const a=t.createElement("script");a.src="https://chat-buddy-widget.vercel.app/chatBudy.js",a.type="module",a.async=!0,t.head.appendChild(o),t.head.appendChild(s),t.head.appendChild(n),t.body.appendChild(a)}}}}catch(e){console.log("ERROR setting up the widget connection: ",e)}},GetWidgetStyle=async e=>{try{if(!localStorage.getItem("chatbudy_style")){console.log("requesting style..");const t=await fetch(`https://chatbudy-api.onrender.com/code/style-${e}`,{method:"get",headers:{"Content-Type":"application/json"},credentials:"include"}),o=await t.json();localStorage.setItem("chatbudy_style",JSON.stringify(o.widget_style));const s=document.createElement("iframe");await SetupIframe(s)}}catch(e){console.log("ERROR setting up the widget style: ",e)}};export const setNewVisitor=async(e,t)=>{try{return await fetch(`https://chatbudy-api.onrender.com/visitor/new-visitor-${t}`,{method:"post",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({isoCode:e.info.country.iso_code,browser:navigator.userAgent})}),!0}catch(e){return console.log(e),!1}};export const initiateChat=async e=>{try{return await fetch("https://chatbudy-api.onrender.com/chat/new-room",{method:"post",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({user_hash:e})})||console.log("No chatrooms found...reset everything"),!0}catch(e){return console.log(e),!1}};export const LoadUpsequence=async e=>{try{if(sessionStorage.getItem("widgetLoaded")||sessionStorage.getItem("convoClosed"))return;const t=await fetch("https://chatbudy-api.onrender.com/visitor/visitor-info",{method:"get",headers:{"Content-Type":"application/json"}}),o=await t.json(),[s,n]=await Promise.all([setNewVisitor(o,e),initiateChat(e)]);if(s&&n){sessionStorage.setItem("widgetLoaded",!0);const t=JSON.stringify({access_id:e});await GetWidgetStyle(e),localStorage.getItem("chatbudy_state")||localStorage.setItem("chatbudy_state",t)}}catch(e){console.log("Load up sequence ERROR: ",e)}};document.addEventListener("DOMContentLoaded",(async()=>{if(LoadUpsequence(useraccess),sessionStorage.getItem("widgetLoaded")){const e=document.createElement("iframe");SetupIframe(e)}}));