(function(){
  let target = document.body;
  let styleDom = document.getElementById('style-dialog');
  if(!styleDom){
    styleDom = document.createElement("style");
    styleDom.innerText = `
      :root{
        --color-bg: #282a36;
        --color-fg: #f8f8f2;
        --color-link: #50fa7b;
      }

      #content-dialog{
        position: fixed;
        top: 10px;
        bottom: 10px;
        left: 10px;
        right: 10px;
        z-index: 40001;
        background: var(--color-bg);
        color: var(--color-fg);
        padding: 20px 25px;
        overflow: auto;
      }

      #content-dialog h1{
        padding: 0;
        margin: 0;
        margin-bottom: 15px;
        border-bottom: 2px solid var(--color-fg)
      }

      #content-dialog a{
        color: var(--color-link);
      }

      #content-dialog h2,
      #content-dialog h3,
      #content-dialog h4,
      #content-dialog h5,
      #content-dialog h6{
        padding: 0;
        margin: 0;
      }

      #content-dialog p, #content-dialog pre{
        margin-top: 0;
        margin-bottom: 20px;
      }
    `
    target.appendChild(styleDom); 
  }

  let newScript = document.createElement("script");
  newScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
  target.appendChild(newScript);

  let contentDom = document.getElementById('content-dialog');

  function _formatMarkdownForKeep(){
    const origTitleDom =document.querySelectorAll(`[contenteditable="true"][spellcheck="true"]`)[0]
    const origContentDom =document.querySelectorAll(`[contenteditable="true"][spellcheck="true"]`)[1]
    contentDom = document.getElementById('content-dialog');

    let shouldBindData = false;
    try{
      shouldBindData = origContentDom && origContentDom.innerText.trim().length > 0;
    }catch(err){}
    

    let width = 600;
    if(shouldBindData){
      width = origContentDom.offsetWidth + 40;
    }

    if(!contentDom){
      contentDom = document.createElement("div");
      contentDom.id = 'content-dialog';
      contentDom.contentEditable = true
      //contentDom.addEventListener('blur', () => contentDom.remove())
      contentDom.addEventListener('keydown', (e) =>{ 
        if(parseInt(e.keyCode) === 27){
          // escape key
          contentDom.remove();
          e.preventDefault();
          e.stopPropagation();

          origContentDom.focus();
          return false;
        }
      })
      target.appendChild(contentDom);  
    }

    if(shouldBindData){
      const newContentHtml = marked(`# ${origTitleDom.innerText}\n` + origContentDom.innerText).trim();
      if(newContentHtml !== contentDom.innerHTML && document.activeElement.id !== 'content-dialog')
        contentDom.innerHTML = newContentHtml;
      contentDom.focus();
    } else {
      contentDom.remove();
    }
  }

  try{
    _formatMarkdownForKeep();
  } catch(err){}
  setTimeout(_formatMarkdownForKeep, 300);
})()
