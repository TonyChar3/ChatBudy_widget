
// class Loader {
//     constructor() {
//         this.widgetID = '{{USER_HASH}}';

//     }

//     async initializeLoader() {
//         // set up a new html document
//         const newHTMLDoc = `
//         <!DOCTYPE html>
//             <head>
//                 <script src="https://kit.fontawesome.com/76351f6769.js" crossorigin="anonymous"></script>
//                 <link rel="preconnect" href="https://fonts.googleapis.com">
//                 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//                 <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap">
//             </head>
//             <body>
//                 <script type="module" src="https://chat-buddy-widget.vercel.app/chatBudy.js" async></script>
//             </body>
//         </html>
//         `;
//         // set up the Iframe
//         this.Iframe = document.createElement('iframe');
//         this.Iframe.style.display = "none";
//         this.Iframe.title = "ChatBudy chat widget code"
//         this.Iframe.onload = () => {
//             const IframeDocument = this.Iframe.contentDocument;
//             IframeDocument.open();
//             IframeDocument.write(newHTMLDoc);
//             IframeDocument.close();
//         }
//         // append both of them together
//         document.body.appendChild(this.Iframe)
//         // execute the loadupsequence
//         this.LoadUpsequence(this.widgetID)
//     }

//     /**
//     * Get the visitor info once it loads up
//     */
//     LoadUpsequence = async(widget_id) => {
//         try{
//             if (sessionStorage.getItem('widgetLoaded') || sessionStorage.getItem('convoClosed')) {
//                 return
//             }
//             const response = await fetch(`http://localhost:8080/visitor/visitor-info`,{
//                 method: 'get',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const data = await response.json();

//             const new_visitor = await setNewVisitor(data, widget_id)
//             const new_chat = await initiateChat(widget_id)
//             if(new_chat && new_visitor){
//                 sessionStorage.setItem('widgetLoaded', true);
//             }
//         } catch(err){
//             console.log('Load up sequence ERROR: ', err)
//         }
//     };
//     /**
//     * Set up a new visitor
//     */
//     setNewVisitor = async(visitor_data, widget_id) => {
//         try{
//             const newVisitor = {
//                 isoCode: visitor_data.info.country.iso_code,
//                 browser: navigator.userAgent
//             }
//             const visitor = await fetch(`http://localhost:8080/visitor/new-visitor-${widget_id}`,{
//                 method: 'post',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(newVisitor)
//             });

//             const data = await visitor.json()
//             setCookie('visitor_jwt', data.visitorToken.jwtToken)
//             return true
//         } catch(err){
//             console.log(err)
//             return false
//         }

//     };
//     /**
//     * Create a new chat room - Salesman
//     */
//     initiateChat = async(widget_id) => {
//         try{
//         const chat = {
//             u_hash: widget_id
//         }
//         const token = getCookie('visitor_jwt');
//         if(token){
//             const start_chat = await fetch('http://localhost:8080/chat/new-room',{
//                 method: 'post',
//                 headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + token
//                 },
//                 body: JSON.stringify(chat)
//             });

//             if (!start_chat) {
//                 console.log('No chatrooms found...reset everything')
//             }

//             return true
//         }

//         } catch(err){
//         console.log(err);
//         return false
//         }
//     };
// }

// export const initializeWidgetLoader = () => {
//     const LoaderInstance = new Loader()
//     return LoaderInstance
//   }
  
//   initializeWidgetLoader();

function initializeLoader(){
        let useraccess = '{{USER_HASH}}'
        console.log(useraccess)
        // set up the Iframe
        let Iframe = document.createElement('iframe');
        Iframe.style.display = "none";
        Iframe.title = "ChatBudy chat widget code"
        Iframe.onload = () => {
            const IframeDocument = Iframe.contentDocument;
            IframeDocument.open();
            IframeDocument.write(newHTMLDoc);
            IframeDocument.close();
        }
        // append both of them together
        document.body.appendChild(Iframe)
}

document.addEventListener('DOMContentLoaded', function () {
    initializeLoader();
});