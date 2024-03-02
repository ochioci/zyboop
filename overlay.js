data = {}
hasData = false
browser.runtime.onMessage.addListener((request) => {
    // console.log("Message from the background script:");
    console.log(request);
    
    // console.log(matches)
    // for (i of request.data.section.content_resources) {
    //     console.log(i) //THE GUID CONTAINED IN THESE REQUESTS MATCHES THE QUESTIONS ON THE PAGE!!!!
    // }
    data = request.data.section.content_resources
    hasData = true
    // return Promise.resolve({ response: "Hi from content script" });
  });

console.log("init")
document.addEventListener("DOMContentLoaded", init)
function init () {
    a = setInterval(function(){
        const matches = document.querySelectorAll("div[content_resource_guid]");
        if (matches.length > 0 && hasData) {
            console.log(matches)
            console.log(data)
            clearInterval(a)
        }  
    }, 1000)
    console.log("sending msg")
    browser.runtime.sendMessage("hi from overlay.js")
}

function checkForLoad(e) {
    const matches = document.querySelectorAll("div[content_resource_guid]");
    if (matches.length > 0) {
        console.log(matches)
        console.log(data)
    }
}
