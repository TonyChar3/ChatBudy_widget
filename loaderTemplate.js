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


// Set up the Iframe
const SetupIframe = async (widget_id) => {
    try {
        const token = getCookie("visitor_jwt");
        if (!token) {
            return;
        }
        // Create the iframe element
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.title = "ChatBudy chat widget code";
        // Wait for the iframe to load
        iframe.onload = async () => {
            const iframeDocument = iframe.contentDocument;
            if (iframeDocument) {
                // Load your widget script or HTML content here
                // Example: Load an external script
                const script = iframeDocument.createElement("script");
                script.type = "module"
                script.src = "https://chat-buddy-widget.vercel.app/chatBudy.js"; // Replace with your widget script URL
                script.async = true;
                iframeDocument.body.appendChild(script);
                // You can also manipulate the iframe's content further if needed
                // Example: Modify the title of the iframe's document
                iframeDocument.title = "Widget ChatBudy:)";
            }
        };
        // Set the iframe's src attribute to load the content
        iframe.src = "https://chat-buddy-widget.vercel.app/chatBudy.js"; // Replace with your widget's URL
        // Append the iframe to the document
        document.body.appendChild(iframe);
        
    } catch (err) {
        console.log("ERROR setting up the widget connection: ", err);
    }
};

// Pre-load the links
const Pre_loadLinks = () => {
    // Preload the necessary resources
    const linksToPreload = [
        "https://kit.fontawesome.com/76351f6769.js",
        "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap",
    ];
    
    linksToPreload.forEach((link) => {
        const preloadLink = document.createElement("link");
        preloadLink.rel = "preload";
        preloadLink.href = link;
        document.head.appendChild(preloadLink);
    });
}

function initializeLoader(){
        let useraccess = '{{USER_HASH}}'
        Pre_loadLinks()
        LoadUpsequence(useraccess)
        SetupIframe(useraccess)
        // // Create the iframe element with srcdoc
        // const Iframe = document.createElement('iframe');
        // Iframe.style.display = "none";
        // Iframe.title = "ChatBudy chat widget code";
        // // Define the initial HTML content
        // const initialHTML = `
        //     <!DOCTYPE html>
        //     <html>
        //         <head>
        //             <script src="https://kit.fontawesome.com/76351f6769.js" crossorigin="anonymous"></script>
        //             <link rel="preconnect" href="https://fonts.googleapis.com">
        //             <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        //             <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&display=swap">
        //         </head>
        //         <body>
        //             <script type="module" src="https://chat-buddy-widget.vercel.app/chatBudy.js" async></script>
        //         </body>
        //     </html>
        // `;

        // // Set the srcdoc attribute to the initial HTML content
        // Iframe.setAttribute('srcdoc', initialHTML);
        // // Append the iframe to the body
        // document.body.appendChild(Iframe);
        // // Create a new document within the iframe
        // Iframe.onload = async () => {
        //     // You can now manipulate the content of the iframe if needed
        //     const iframeDocument = Iframe.contentDocument;

        //     if (iframeDocument) {
        //         // Example: Modify the title of the iframe's document
        //         iframeDocument.title = "New Title";
        //     }
        // }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeLoader();
});
