let useraccess="{{USER_HASH}}";const SetupIframe=async t=>{try{if(t){const e="<!DOCTYPE html></html>";t.style.display="none",t.title="ChatBudy chat widget code",t.setAttribute("srcdoc",e),document.body.appendChild(t),t.onload=async()=>{const e=t.contentDocument;if(e){const t=e.createElement("script");t.src="https://kit.fontawesome.com/76351f6769.js",t.crossOrigin="anonymous",e.head.appendChild(t);const s=e.createElement("link");s.rel="preconnect",s.href="https://fonts.googleapis.com";const o=e.createElement("link");o.rel="preconnect",o.href="https://fonts.gstatic.com",o.crossOrigin=!0;const n=e.createElement("link");n.href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap",n.rel="stylesheet";const a=e.createElement("script");a.src="https://chat-buddy-widget.vercel.app/chatBudy.js",a.type="module",a.async=!0,e.head.appendChild(s),e.head.appendChild(o),e.head.appendChild(n),e.body.appendChild(a)}}}}catch(t){console.log("ERROR setting up the widget connection: ",t)}},GetWidgetStyle=async t=>{try{if(!sessionStorage.getItem("chatbudy_style")){const e=sessionStorage.getItem("visitor_hash"),s=await fetch(`https://chatbudy-api.onrender.com/code/style-${t}`,{method:"get",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}),o=await s.json();sessionStorage.setItem("chatbudy_style",JSON.stringify(o.widget_style));const n=document.createElement("iframe");SetupIframe(n)}}catch(t){console.log("ERROR setting up the widget style: ",t)}};export const setNewVisitor=async(t,e)=>{try{const s=await fetch(`https://chatbudy-api.onrender.com/visitor/new-visitor-${e}`,{method:"post",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({isoCode:t.info.country.iso_code,browser:navigator.userAgent})});return sessionStorage.setItem("visitor",JSON.stringify(s.data.visitor_hash)),!0}catch(t){return console.log(t),!1}};export const initiateChat=async t=>{try{return await fetch("https://chatbudy-api.onrender.com/chat/new-room",{method:"post",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({user_hash:t})})||console.log("No chatrooms found...reset everything"),!0}catch(t){return console.log(t),!1}};export const LoadUpsequence=async t=>{try{if(sessionStorage.getItem("widgetLoaded")||sessionStorage.getItem("convoClosed"))return;const e=await fetch("https://chatbudy-api.onrender.com/visitor/visitor-info",{method:"get",headers:{"Content-Type":"application/json"}}),s=await e.json(),o=await setNewVisitor(s,t),n=await initiateChat(t);if(o&&n){sessionStorage.setItem("widgetLoaded",!0);const e=JSON.stringify({access_id:t});await GetWidgetStyle(t),sessionStorage.getItem("chatbudy_state")||sessionStorage.setItem("chatbudy_state",e)}}catch(t){console.log("Load up sequence ERROR: ",t)}};window.addEventListener("load",(()=>{LoadUpsequence(useraccess);const t=document.createElement("iframe");SetupIframe(t)}));