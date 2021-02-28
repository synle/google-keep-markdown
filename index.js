(function(){
  let target = document.body;
  const isDarkMode = new Date().getHours() >= 19 || new Date().getHours() <= 8;
  let colorIdx = 0;
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
        border: 5px solid var(--color-border);
        border-radius: 5px;
        display: grid;
        grid-template-columns: minmax(600px, 1fr) 450px;
        box-sizing: border-box;
      }

      #content-dialog pre{
        border: 1px solid var(--color-border);
        padding: 10px;
        margin-top: 5px;
        margin-bottom: 10px;
      }

      #content-dialog h1{
        padding: 0;
        margin: 0;
        margin-bottom: 15px;
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

      #content-dialog figure{

      }

      #content-dialog figure img{
        width: 100%;
        display: block;
        margin: 0 auto 30px 0;
        border-radius: 5px;
        border: 2px solid  var(--color-border)
      }

      @media only screen and (min-width: 1600px) {
        #content-dialog{
          grid-template-columns: minmax(800px, 1fr) 900px;
        }
      }

      @media only screen and (max-width: 1050px) {
        #content-dialog{
          grid-template-columns: 1fr;
        }
      }
    `
    target.appendChild(styleDom); 

    let newScript = document.createElement("script");
    newScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    target.appendChild(newScript);

    window.addEventListener('keydown', (e) =>{ 
      let stop = false;

      const keycode = parseInt(e.keyCode);

      if(keycode === 9)  {
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
      const articleContent = document.createElement('article');
      contentDom.append(articleContent)
      const figureImages = document.createElement('figure');
        contentDom.append(figureImages)

      const newContentHtml = `<h2>${origTitleDom.innerText}</h2><hr />` + marked(origContentDom.innerText).trim();
      if(newContentHtml !== articleContent.innerHTML && document.activeElement.id !== 'content-dialog'){
        articleContent.innerHTML = newContentHtml;

        // append images
        try{
          for(const img of origTitleDom.previousSibling.querySelectorAll('img')){
            const newImg = document.createElement("div");
            // newImg.innerHTML = `Loading Image...`;
            parseAndInsertImageAsBase64(img.src, newImg);
            figureImages.append(newImg)
          }
        } catch(err){

        }
      }
      

      contentDom.focus();
    } else {
      // setTimeout(_formatMarkdownForKeep, 300);
      contentDom.remove();
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
      r.style.setProperty('--color-border', '#f1fa8c');  
    } else {
      // light
      r.style.setProperty('--color-bg', '#f8f8f2');
      r.style.setProperty('--color-fg', '#282a36');
      r.style.setProperty('--color-link', '#ff5555');
      r.style.setProperty('--color-border', '#44475a');
    }
  }

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  function parseAndInsertImageAsBase64(url, newImg){
    toDataURL(url, function(dataUrl) {
      newImg.innerHTML = `<img src="${dataUrl}" altText="Doc Image" />`;
    })
  }

  switchColor();

  setTimeout(_formatMarkdownForKeep, 300);
})()
