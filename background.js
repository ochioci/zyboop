function listener(details) {
    // console.log(details)
    let decoder = new TextDecoder("utf-8");
    let filter = browser.webRequest.filterResponseData(details.requestId);
    gotdata = ""
    filter.ondata = (event) => {
        
        // console.log(event)
        let str = decoder.decode(event.data, {stream: true});
        gotdata += str
        // console.log(str)
    //   console.log(`filter.ondata received ${event.data.byteLength} bytes`);
      filter.write(event.data);
    //   console.log(d)
    };
    filter.onstop = (event) => {
        handleReq(gotdata)
        // console.log(event)
      // The extension should always call filter.close() or filter.disconnect()
      // after creating the StreamFilter, otherwise the response is kept alive forever.
      // If processing of the response data is finished, use close. If any remaining
      // response data should be processed by Firefox, use disconnect.
      filter.close();
    };
    
  }

  function handleReq (gotdata) {
    d = {}
    try {
        d = JSON.parse(gotdata)
        // console.log(d)
        if (Object.keys(d).length == 2 && Object.keys(d).includes("section")) {
            console.log(d)
        }
    } catch {
        // console.log(gotdata)
        console.log("hid 1 non json response")
    }
  }
  
  browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ["<all_urls>"], types: ["xmlhttprequest"] }, ["blocking"]
  );
  