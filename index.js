(function() {
    let target = document.body;
    let newScript = document.createElement("script");
    newScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    target.appendChild(newScript);

    var _formatMarkdownForKeep = function () {
        const origContentDom = document.querySelectorAll(`[contenteditable="true"][spellcheck="true"]`)[1]
        let contentDom = document.getElementById('content-dialog')
        let left = 'calc(100% - 600px)'
        if (origContentDom) {
          clearInterval(_intervalMarkdownForKeep)
          left = origContentDom.getBoundingClientRect().left + origContentDom.getBoundingClientRect().width + 30 + 'px'
        }
        if (!contentDom) {
            contentDom = document.createElement("div");
            contentDom.id = 'content-dialog';
            contentDom.contentEditable = true;
            contentDom.addEventListener('focus', function(e) {
                // stop if clicking happens on the dom of rendering
                _formatMarkdownForKeep();
            })
            target.appendChild(contentDom);
            let styleDom = document.createElement("style");
            styleDom.innerText = `
        #content-dialog{
          position: fixed;
          top: 0;
          right: 0;
          left: ${left};
          z-index: 4000;
          background: white;
          color: black;
          padding: 10px;
          overflow: auto;
          bottom: 0;

        }
      `
            target.appendChild(styleDom);
        }
        if (origContentDom) {
            const newContentHtml = marked(origContentDom.innerText).trim();
            if (newContentHtml !== contentDom.innerHTML) contentDom.innerHTML = newContentHtml;
        } else {
            contentDom.remove();
        }
    }

    function debounce(callback, wait){
      let timerId;
      return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          callback(...args);
        }, wait);
      };
    }


    window.addEventListener('click', function(e) {
        // stop if clicking happens on the dom of rendering
        if (isTargetContentDom(e.target)) {
            e.stopPropagation();
            return;
        }
        _formatMarkdownForKeep();
    })

    function isTargetContentDom(startDom) {
        let targetDom = startDom
        while (targetDom) {
            if (targetDom && targetDom.id === 'content-dialog') {
                return true;
            }
            targetDom = targetDom.parentElement;
        }
        return false;
    }
    _intervalMarkdownForKeep = setInterval(_formatMarkdownForKeep, 200);
})()
