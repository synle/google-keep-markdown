(function(){
  let target = document.body;
  const isDarkMode = new Date().getHours() >= 19 || new Date().getHours() <= 8;
  let colorIdx = isDarkMode ? 1: 0;// default is dark
  let styleDom = document.getElementById('style-dialog');
  if(!styleDom){
    styleDom = document.createElement("style");
    styleDom.id= 'style-dialog'
    styleDom.innerText = `
      :root{
        --color-bg: #282a36;
        --color-fg: #f8f8f2;
        --color-link: #50fa7b;
        --color-border: #44475a;
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
        border: 3px solid var(--color-border);
        border-radius: 5px
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

      #content-dialog img{
        max-height: 550px;
        display: block;
        margin: 0 auto 30px 0;
        border-radius: 5px;
        border: 2px solid  var(--color-border)
      }
    `
    target.appendChild(styleDom); 

    let newScript = document.createElement("script");
    newScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    target.appendChild(newScript);

    window.addEventListener('keydown', (e) =>{ 
      let stop = false;

      const keycode = parseInt(e.keyCode);

      if(keycode === 9 || keycode === 16)  {
        switchColor();

        contentDom.focus();

        stop = true;
      }

      if(stop){
        e.preventDefault();
        e.stopPropagation();

        origContentDom.focus();
        return false;
      }
    })
  }

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
        let stop = false;

        const keycode = parseInt(e.keyCode);
        if(keycode === 27){
          // escape key
          contentDom.remove();
          stop = true;
          
        }

        if(stop){
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
      if(newContentHtml !== contentDom.innerHTML && document.activeElement.id !== 'content-dialog'){
        contentDom.innerHTML = newContentHtml;

        // append images
        try{
          for(const img of origTitleDom.previousSibling.querySelectorAll('img')){
            const newImg = document.createElement("div");
            newImg.innerHTML = `<a href="${img.src}"><img src="${img.src}" altText="Doc Image" /></a>`;
            contentDom.append(newImg)
          }
        } catch(err){

        }
      }
      

      contentDom.focus();
    } else {
      setTimeout(_formatMarkdownForKeep, 300);
    }
  }

  function switchColor(){
    // tab key or shift
    var r = document.querySelector(':root');
    colorIdx++;
    if(colorIdx % 2 === 0){
      // dark
      r.style.setProperty('--color-bg', '#282a36');
      r.style.setProperty('--color-fg', '#f8f8f2');
      r.style.setProperty('--color-link', '#50fa7b');
      r.style.setProperty('--color-border', '#44475a');  
    } else {
      // light
      r.style.setProperty('--color-bg', '#f8f8f2');
      r.style.setProperty('--color-fg', '#282a36');
      r.style.setProperty('--color-link', '#ff5555');
      r.style.setProperty('--color-border', '#44475a');
    }
  }

  switchColor();

  setTimeout(_formatMarkdownForKeep, 300);
})()
