d={}
function handleMessage(request, sender, sendResponse) {
  console.log(request);
  
}

function sendToCtScript(v) {
  // console.log(v)
  for (const tab of v) {
    browser.tabs
      .sendMessage(tab.id, {"info": "replying!", "data": d})
  }
}

browser.runtime.onMessage.addListener(handleMessage);

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
      filter.close();
    };
    
  }

  function buildOverlay(d) {
    a = document.createElement("div");
    a.innerText="hi";

  }

  function handleReq (gotdata) {
    try {
        d = JSON.parse(gotdata)
        
        // console.log(d)
        if (Object.keys(d).length == 2 && Object.keys(d).includes("section")) {
            console.log(d)
            browser.tabs.query({"active": true}).then(sendToCtScript)
      
            
            // let executing = browser.tabs.executeScript(
            //   {"code": "console.log(" + JSON.stringify(d) + ")"}
            //   )
        }
    } catch {
        d={}
        // console.log(gotdata)
        console.log("hid 1 non json response")
    }
  }
  
  browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ["<all_urls>"], types: ["xmlhttprequest"] }, ["blocking"]
  );
  
