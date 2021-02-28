(function(){
  let target = document.body;
  let newScript = document.createElement("script");
  newScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
  target.appendChild(newScript);


  function _formatMarkdownForKeep(){
    const origContentDom =document.querySelectorAll(`[contenteditable="true"][spellcheck="true"]`)[1]
    let contentDom = document.getElementById('content-dialog')

    let width = 600;
    if(origContentDom){
      width = origContentDom.offsetWidth + 40;
    }

    if(!contentDom){
      contentDom = document.createElement("div");
      contentDom.id = 'content-dialog';
      target.appendChild(contentDom);  

      let styleDom = document.createElement("style");
      styleDom.innerText = `
        #content-dialog{
          position: fixed;
          top: 0;
          right: 0;
          left: calc(100% - ${width}px);
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

    if(origContentDom){
      const newContentHtml = marked(origContentDom.innerText).trim();
      if(newContentHtml !== contentDom.innerHTML)
        contentDom.innerHTML = newContentHtml;
    } else {
      contentDom.remove();
      // clearInterval(_intervalMarkdownForKeep)
    }
  }

  let _intervalMarkdownForKeep = setInterval(_formatMarkdownForKeep, 1000);
})()
