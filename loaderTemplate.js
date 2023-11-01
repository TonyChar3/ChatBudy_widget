//TODO: DEV env functions
// function getCookie(name) {
//     const cookieString = window.parent.document.cookie
//     const cookies = cookieString.split('; ');
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].split('=');
//       if (cookie[0] === name) {
//         return cookie[1];
//       }
//     }
//     return null;
// }
// function setCookie(name, value) {
//     const cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
//     window.parent.document.cookie = cookieString;
// }
// -------------------------------
let useraccess = '{{USER_HASH}}';
/**
 * Set up the widget Iframe
 */
const SetupIframe = async (Iframe_element) => {
    try {
        if(Iframe_element){
            // Define the initial HTML content
            const initialHTML = `<!DOCTYPE html></html>`;
            Iframe_element.style.display = "none";
            Iframe_element.title = "ChatBudy chat widget code";
            // Set the srcdoc attribute to the initial HTML content
            Iframe_element.setAttribute('srcdoc', initialHTML);
            // Append the iframe to the body
            document.body.appendChild(Iframe_element);
            // Wait for the iframe to load
            Iframe_element.onload = async () => {
                // You can now manipulate the content of the iframe if needed
                const iframeDocument = Iframe_element.contentDocument;
                if (iframeDocument) {
                    /**
                     * Setting up Google Fonts & Font awesome for the widget
                     */
                    // <script src="https://kit.fontawesome.com/76351f6769.js" crossorigin="anonymous"></script>
                    const iframe_head_script = iframeDocument.createElement("script")
                    iframe_head_script.src = "https://kit.fontawesome.com/76351f6769.js";
                    iframe_head_script.crossOrigin = "anonymous";
                    iframeDocument.head.appendChild(iframe_head_script)
                    // <link rel="preconnect" href="https://fonts.googleapis.com">
                    const iframe_link1 = iframeDocument.createElement("link")
                    iframe_link1.rel = "preconnect";
                    iframe_link1.href = "https://fonts.googleapis.com";
                    // <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    const iframe_link2 = iframeDocument.createElement("link")
                    iframe_link2.rel = "preconnect";
                    iframe_link2.href = "https://fonts.gstatic.com";
                    iframe_link2.crossOrigin = true;
                    // <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap">
                    const iframe_stylesheet = iframeDocument.createElement("link")
                    iframe_stylesheet.href = "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap";
                    iframe_stylesheet.rel = "stylesheet";

                    const iframe_script = iframeDocument.createElement("script")
                    iframe_script.src = "https://chat-buddy-widget.vercel.app/chatBudy.js"
                    iframe_script.type = "module"
                    iframe_script.async = true
                    iframeDocument.head.appendChild(iframe_link1)
                    iframeDocument.head.appendChild(iframe_link2)
                    iframeDocument.head.appendChild(iframe_stylesheet)
                    iframeDocument.body.appendChild(iframe_script)
                }
            };
        }
    } catch (err) {
        console.log("ERROR setting up the widget connection: ", err);
    }
};
/**
 * Get the widget style to set it in the local storage
 */
const GetWidgetStyle = async(widget_id) => {
    try{
        if(!localStorage.getItem('chatbudy_style')){
            // TODO: to be removed for production
            // get the jwt token
            // TODO: add credentials: true for PROD
            console.log('requesting style..')
            // make a request using the widget_id (user hash)
            const style_request = await fetch(`https://chatbudy-api.onrender.com/code/style-${widget_id}`,{
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const style_data = await style_request.json();
            // set the styling in the localstorage
            localStorage.setItem('chatbudy_style', JSON.stringify(style_data.widget_style));
            // successful?? -> set the returned object in the local storage
        }
    } catch(err){
        console.log('ERROR setting up the widget style: ', err);
    }
}
/**
* Set up a new visitor
*/
export const setNewVisitor = async(visitor_data, widget_id) => {
    try{
        await fetch(`https://chatbudy-api.onrender.com/visitor/new-visitor-${widget_id}`,{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                isoCode: visitor_data.info.country.iso_code,
                browser: navigator.userAgent
            })
        });
    } catch(err){
        console.log(err)
        return false
    }

};
/**
* Create a new chat room - Salesman
*/
export const initiateChat = async(widget_id) => {
    try{
        const start_chat = await fetch('https://chatbudy-api.onrender.com/chat/new-room',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                user_hash: widget_id
            })
        });

        if (!start_chat) {
            console.log('No chatrooms found...reset everything')
        }

        return true

    } catch(err){
        console.log(err);
        return false
    }
};
/**
* Get the visitor info once it loads up
*/
export const LoadUpsequence = async(widget_id) => {
    try{
        if (sessionStorage.getItem('widgetLoaded') || sessionStorage.getItem('convoClosed')) {
            return
        }
        const response = await fetch(`https://chatbudy-api.onrender.com/visitor/visitor-info`,{
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        await Promise.all([
            setNewVisitor(data, widget_id),
            initiateChat(widget_id),
            GetWidgetStyle(widget_id)
        ]);
        sessionStorage.setItem('widgetLoaded', true);
        const state_obj = JSON.stringify({access_id: widget_id})
        if(!localStorage.getItem('chatbudy_state')){
            localStorage.setItem('chatbudy_state', state_obj)
        }
        // Create the iframe element with srcdoc
        const Iframe = document.createElement('iframe');
        // Setting up the Iframe in the document
        await SetupIframe(Iframe);
    } catch(err){
        console.log('Load up sequence ERROR: ', err)
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // load visitor chat session + his info
    LoadUpsequence(useraccess);
    // Create the iframe element with srcdoc
    const Iframe = document.createElement('iframe');
    // Setting up the Iframe in the document
    SetupIframe(Iframe);
});