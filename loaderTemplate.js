//TODO: DEV env functions
function getCookie(name) {
    const cookieString = window.parent.document.cookie
    const cookies = cookieString.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return null;
}
function setCookie(name, value) {
    const cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    window.parent.document.cookie = cookieString;
}
// -------------------------------
/**
 * Set up the widget Iframe
 */
const SetupIframe = async (Iframe_element) => {
    try {
        // Define the initial HTML content
        const initialHTML = `<!DOCTYPE html></html>`;
        const token = getCookie("visitor_jwt");
        if (!token) {
            return;
        }
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
                    // const iframe_head_script = iframeDocument.createElement("script")
                    // iframe_head_script.src = "https://kit.fontawesome.com/76351f6769.js";
                    // iframe_head_script.crossOrigin = "anonymous";
                    // iframeDocument.head.appendChild(iframe_head_script)
                // <link rel="preconnect" href="https://fonts.googleapis.com">
                const verify_header = Array.from(document.head.getElementsByTagName('script')).some((script) => {
                    if(script.src === 'https://kit.fontawesome.com/76351f6769.js'){
                        return true;
                    } else {
                        return false;
                    }
                });
                if(!verify_header) {
                    console.log('installing....')
                }
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
                iframe_stylesheet.rel = "stylesheet";
                iframe_stylesheet.href = "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap";

                const iframe_script = iframeDocument.createElement("script")
                iframe_script.src = "https://chat-buddy-widget.vercel.app/chatBudy.js"
                iframe_script.type = "module"
                iframe_script.async = true
                iframeDocument.head.appendChild(iframe_link1)
                iframeDocument.head.appendChild(iframe_link2)
                iframeDocument.body.appendChild(iframe_script)
            }
        };
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
            const token = getCookie("visitor_jwt")
            if(!token){
                return;
            }
            // TODO: add credentials: true for PROD
            // make a request using the widget_id (user hash)
            const style_request = await fetch(`http://localhost:8080/code/style-${widget_id}`,{
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const style_data = await style_request.json();
            if(style_data){
                // set the styling in the localstorage
                localStorage.setItem('chatbudy_style', JSON.stringify(style_data.widget_style));
            }
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
        const newVisitor = {
            isoCode: visitor_data.info.country.iso_code,
            browser: navigator.userAgent
        }
        const visitor = await fetch(`http://localhost:8080/visitor/new-visitor-${widget_id}`,{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVisitor)
        });

        const data = await visitor.json()
        setCookie('visitor_jwt', data.visitorToken.jwtToken)
        return true
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
        const chat = {
            u_hash: widget_id
        }
        const token = getCookie('visitor_jwt');
        if(token){
            const start_chat = await fetch('http://localhost:8080/chat/new-room',{
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(chat)
            });

            if (!start_chat) {
                console.log('No chatrooms found...reset everything')
            }

            return true
        }

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
            // Create the iframe element with srcdoc
            const Iframe = document.createElement('iframe');
            // Setting up the Iframe in the document
            SetupIframe(Iframe);
            return
        }
        const response = await fetch(`http://localhost:8080/visitor/visitor-info`,{
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const new_visitor = await setNewVisitor(data, widget_id)
        const new_chat = await initiateChat(widget_id)
        if(new_chat && new_visitor){
            sessionStorage.setItem('widgetLoaded', true);
            const state_obj = JSON.stringify({access_id: widget_id})
            if(!localStorage.getItem('chatbudy_state')){
                localStorage.setItem('chatbudy_state', state_obj)
            }
            await GetWidgetStyle(widget_id);
            // Create the iframe element with srcdoc
            const Iframe = document.createElement('iframe');
            // Setting up the Iframe in the document
            SetupIframe(Iframe);
        }
    } catch(err){
        console.log('Load up sequence ERROR: ', err)
    }
};
// Initialize the Loader of the widget
const initializeLoader = async() => {
    let useraccess = '{{USER_HASH}}';
    // load visitor chat session + his info
    LoadUpsequence(useraccess);
}
document.addEventListener('DOMContentLoaded', () => {
    console.log('That was not working')
    initializeLoader();
});