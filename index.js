// ==UserScript==
// @name         Google Keep Note format
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://keep.google.com/u/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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
        grid-auto-columns: minmax(600px, 1fr) 450px;
        box-sizing: border-box;
      }

      #content-dialog #content-dialog-close-btn {
        position: absolute;
        top: 0;
        right: 0;
        padding: 10px;
        margin: 0;
        background: black;
        color: white;
        height: 40px;
        width: 40px;
        cursor: pointer;
      }

      #content-dialog #content-dialog-close-btn:hover, #content-dialog #content-dialog-close-btn:focus{
        background: #333;
      }

      #content-dialog pre{
        border: 3px dotted var(--color-border);
        padding: 10px;
        margin-top: 7px;
        margin-bottom: 10px;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
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
          grid-auto-columns: minmax(800px, 1fr) 900px;
        }
      }

      @media only screen and (max-width: 1050px) {
        #content-dialog{
          grid-auto-columns: 1fr;
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

      if(keycode === 9 && isTargetContentDom(e.target))  { // TAB to switch color
        switchColor();
        stop = true;
      }

      if(stop){
        e.preventDefault();
        e.stopPropagation();
        contentDom.focus();
        return false;
      }
    })
  }

  let contentDom = document.getElementById('content-dialog');

  function _formatMarkdownForKeep(suppressError){
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
      // clean the dom
      contentDom.innerText = '';

      const articleContent = document.createElement('article');
      contentDom.append(articleContent)

      const newContentHtml = `<h2>${origTitleDom.innerText}</h2><hr />` + marked(origContentDom.innerText).trim();

      if (newContentHtml !== articleContent.innerHTML && document.activeElement.id !== 'content-dialog') {
          articleContent.innerHTML = newContentHtml;

          // append images
          const noteImages = origTitleDom.previousSibling.querySelectorAll('img');
          if (noteImages.length > 0) {
              const figureImages = document.createElement('figure');
              contentDom.append(figureImages)
              try {
                  for (const img of origTitleDom.previousSibling.querySelectorAll('img')) {
                      const newImg = document.createElement("div");
                      // newImg.innerHTML = `Loading Image...`;
                      parseAndInsertImageAsBase64(img.src, newImg);
                      figureImages.append(newImg)
                  }
              } catch (err) {}
          }
      }

      contentDom.focus();

      // force focus on the content dom to stop google keep from
      // doing the infinite scroll loader
      contentDom.addEventListener('blur', () => {
        contentDom.focus();
      })

      // add the close button
      const closeContentBtn = document.createElement('button');
      closeContentBtn.innerText = 'X'
      closeContentBtn.id = 'content-dialog-close-btn'
      closeContentBtn.addEventListener('click', () => {
        contentDom.remove();
      })
      articleContent.append(closeContentBtn)
    } else {
      // setTimeout(_formatMarkdownForKeep, 300);
      contentDom.remove();
      if(suppressError !== true){
        alert('Preview is not supported');
      }
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

  switchColor();

  // auto load the first time
  setTimeout(() => {
    _formatMarkdownForKeep(true);

    // listen on dom mutation
    // Callback function to execute when mutations are observed
    const _setupFormatButtonCallback = () => {
      let noteCloseBtns = []
      for(let button of document.querySelectorAll('[role="button"')){
        if(button.innerText.trim() === 'Close'){
          noteCloseBtns.push(button)
        }
      }

      // insert this button
      for(let noteCloseBtn of noteCloseBtns){
        if(noteCloseBtn && noteCloseBtn.parentElement.querySelectorAll('.format-markdown-modal-btn').length === 0){
          const formatButton = document.createElement('div');
          formatButton.innerText = 'Format'
          formatButton.className = `format-markdown-modal-btn ${noteCloseBtn.className}`
          formatButton.style.marginRight = 0;
          formatButton.style.background = 'red';
          formatButton.style.color = 'white';
          formatButton.addEventListener('click', _formatMarkdownForKeep)
          noteCloseBtn.parentElement.prepend(formatButton);
        }
      }
    }

    // Create an observer instance linked to the callback function
    // Start observing the target node for configured mutations
    const targetNode = document.querySelector('.notes-container');
    new MutationObserver(_setupFormatButtonCallback).observe(targetNode, {
      attributes: true,
      childList: true,
      subtree: false
    });
  }, 500);
})();
