function saveData(result) {
    if (result.url.includes("zybook")) {
        logReq(result);
    }
}

function logReq(result) {
    const decoder = new TextDecoder("utf-8");
    let filter = browser.webRequest.filterResponseData(result.requestId);
    filter.ondata = (event) => {
        let str = decoder.decode(event.data, { stream: true });
        console.log(str);
        filter.close();
        return;
      };
      return;
      
    
}
// browser.webRequest.onBeforeRequest.addListener(listener, reqFilter, ['blocking']);
// browser.webRequest.onCompleted.addListener(
//     saveData,
//     {
//         urls: ["<all_urls>"],
//         types: ['xmlhttprequest']
//     });

browser.webRequest.onBeforeRequest.addListener(logReq, {urls: ["<all_urls>"]}, ['requestBody']);