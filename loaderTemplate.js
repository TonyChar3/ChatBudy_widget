//TODO: Temporary functions
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
* Set up a new visitor
*/
const setNewVisitor = async(visitor_data, widget_id) => {
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
const initiateChat = async(widget_id) => {
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
const LoadUpsequence = async(widget_id) => {
    try{
        if (sessionStorage.getItem('widgetLoaded') || sessionStorage.getItem('convoClosed')) {
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
            sessionStorage.setItem('chatbudy_state', state_obj)
        }
    } catch(err){
        console.log('Load up sequence ERROR: ', err)
    }
};

function initializeLoader(){
        let useraccess = '{{USER_HASH}}'
        LoadUpsequence(useraccess)
        // Create the iframe element with srcdoc
        const Iframe = document.createElement('iframe');
        Iframe.style.display = "none";
        Iframe.title = "ChatBudy chat widget code";
        // Define the initial HTML content
        const initialHTML = `
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://kit.fontawesome.com/76351f6769.js" crossorigin="anonymous"></script>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap">
                </head>
                <body>
                    <script type="module" src="https://chat-buddy-widget.vercel.app/chatBudy.js" async></script>
                </body>
            </html>
        `;

        // Set the srcdoc attribute to the initial HTML content
        Iframe.setAttribute('srcdoc', initialHTML);
        // Append the iframe to the body
        document.body.appendChild(Iframe);
        // Create a new document within the iframe
        Iframe.onload = async () => {
            // You can now manipulate the content of the iframe if needed
            const iframeDocument = Iframe.contentDocument;

            if (iframeDocument) {
                // Example: Modify the title of the iframe's document
                iframeDocument.title = "New Title";
            }
        }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeLoader();
});