data = {}
currentQ = 0
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
    answerElem.style.backgroundColor = "darkgrey";
    answerElem.style.border = "5px solid lightgrey"
    answerElem.style.borderRadius = "10px"
    answerElem.style.padding = "10px"
    answerElem.style.position = "fixed";
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
                                try {
                                    if ('text' in l) {
                                        ltxt += l.text + "\n"
                                    }
                                }
                                catch {
                                    ltxt = c.label
                                    // console.log("oops")
                                    // console.log(c.label)
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

    for (let i = 0; i < toDisplay.length; i++) {
        o = ""
        for (x of toDisplay[i].ans) {
            o += x + "\n"
        } 
        toDisplay[i].ans = o;
    }
    leftButton = document.createElement("button")
    leftButton.innerText = "<-"
    leftButton.id = "leftButton"
    rightButton = document.createElement("button")
    rightButton.id = "rightButton"
    rightButton.innerText = "->"
    qArea = document.createElement("div")
    qArea.id = "qArea"
    aArea = document.createElement("div")
    aArea.id = "aArea"

    leftButton.addEventListener("click", prevAnswer)
    rightButton.addEventListener("click", nextAnswer)

    qArea.innerText = "Q: " +toDisplay[0].txt
    aArea.innerText = "A: " +toDisplay[0].ans

    // qArea.style.fontSize = "20pt";
    qArea.style.fontSize = "10pt";
    qArea.style.color = "forestgreen";
    aArea.style.fontSize = "15pt";
    aArea.style.color = "darkred";
    // aArea.style.fontSize = "25pt";

    answerElem.appendChild(leftButton)
    answerElem.appendChild(rightButton)
    answerElem.appendChild(qArea)
    answerElem.appendChild(aArea)
    
    answerElem.style.zIndex = "1000000"
    document.body.appendChild(answerElem)
    console.log(answerElem)
}

function prevAnswer(e) {
    if (currentQ > 0) {
        currentQ--
        qArea.innerText = "Q: " + toDisplay[currentQ].txt
        aArea.innerText = "A: " +toDisplay[currentQ].ans
    }
}
function nextAnswer(e) {
    if (currentQ < toDisplay.length -1 ) {
        currentQ++
        qArea.innerText = "Q: " + toDisplay[currentQ].txt
        aArea.innerText = "A: " +toDisplay[currentQ].ans
    }
}
