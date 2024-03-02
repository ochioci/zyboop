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
            handleOverlay(matches, data)
        }  
    }, 1000)
    console.log("sending msg")
    browser.runtime.sendMessage("hi from overlay.js")
}

function handleOverlay(matches, data) {
    answerElem = document.createElement('div')
    answerElem.style.backgroundColor = "cyan";
    answerElem.style.position = "absolute";
    console.log("!!!!")
    qs = []
    toDisplay = []
    for (d of data) {
        // console.log("aaa")
        if ('payload' in d) {
            if ('questions' in d.payload) {
                for (q of d.payload.questions) {
                    qs.push(q)
                }
            }
        }
    }
    for (q of qs) {
        if ('text' in q) {
            txt = ''
            ans = []
            for (t of q.text) {
                if ('text' in t) {
                    txt += t.text
                }
                
                // console.log(txt)
                if ('answers' in q) {ans=q.answers}
                if ('choices' in q) {
                    for (c of q.choices) {
                        if (c.correct && 'label' in c) {
                            ltxt = ''
                            for (l of c.label) {
                                if ('text' in l) {
                                    ltxt += l.text
                                }
                            }
                            ans.push(ltxt)
                        }
                    }
                }
            }
            toDisplay.push({txt, ans})
            console.log({txt, ans})
        }
    }

    for (z of toDisplay) {
        qElem = document.createElement('div')
        qElem.innerText = z.txt
        aElem = document.createElement('div')
        aElem.innerText = z.ans
        qElem.style.color = "darkgrey"
        answerElem.appendChild(qElem)
        answerElem.appendChild(aElem)
    }
    answerElem.style.zIndex = "1000000"
    document.body.appendChild(answerElem)
}
