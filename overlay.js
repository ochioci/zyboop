browser.runtime.onMessage.addListener((request) => {
    // console.log("Message from the background script:");
    console.log(request);
    for (i of request.data.section.content_resources) {
        console.log(i) //THE GUID CONTAINED IN THESE REQUESTS MATCHES THE QUESTIONS ON THE PAGE!!!!
    }
    // return Promise.resolve({ response: "Hi from content script" });
  });

console.log("init")
document.addEventListener("DOMContentLoaded", init)
function init () {
    console.log("sending msg")
    browser.runtime.sendMessage("hi from overlay.js")
}
