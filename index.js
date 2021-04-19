// ==UserScript==
// @name         Google Keep Note format
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://keep.google.com/u/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let target = document.body;
  const isDarkMode = new Date().getHours() >= 19 || new Date().getHours() <= 8;
  let colorIdx = 0;
  let styleDom = document.getElementById("style-dialog");
  if (!styleDom) {
    styleDom = document.createElement("style");
    styleDom.id = "style-dialog";
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
        padding: 10px 15px;
        overflow: auto;
        border: 5px solid var(--color-border);
        border-radius: 5px;
        display: grid;
        grid-template-columns: minmax(600px, 1fr) 450px;
        box-sizing: border-box;
      }

      #content-dialog button{
        cursor: pointer;
        opacity: 0.8;
        border: none;
        background: #ccc;
        padding: 10px 15px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      #content-dialog button:hover, #content-dialog button:focus{
        opacity: 1;
      }
      #content-dialog .unselectable {
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      #content-dialog #content-dialog-close-btn {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        background: black;
        color: white;
        height: 40px;
        width: 40px;
        cursor: pointer;
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
        margin-top: 0;
        margin-bottom: 7px;
      }
      #content-dialog p, #content-dialog pre{
        margin-top: 0;
        margin-bottom: 20px;
      }
      #content-dialog figure{
        margin: 0px 0px 0px 5px;
      }
      #content-dialog figure a{
        display: block;
      }
      #content-dialog figure a img{
        width: 100%;
        display: block;
        margin: 0 auto 30px 0;
        border-radius: 5px;
        border: 3px solid var(--color-border);
        box-sizing: border-box;
      }
      #content-dialog figure img:hover{
        border-color: var(--color-link);
      }
      #content-dialog a{
        cursor: pointer;
        text-decoration: none;
        opacity: 0.95;
      }
      #content-dialog a:hover{
        opacity: 1;
      }
      @media (max-width: 1050px) {
        #content-dialog{
          grid-template-columns: 1fr;
        }
      }
      @media (min-width: 1200px) {
        #content-dialog{
          grid-template-columns: 1fr 600px;
        }
      }
      @media (min-width: 1600px) {
        #content-dialog{
          grid-template-columns: 1fr 900px;
        }
      }
    `;
    target.appendChild(styleDom);

    let newScript = document.createElement("script");
    newScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    target.appendChild(newScript);

    window.addEventListener("keydown", (e) => {
      let stop = false;

      const keycode = parseInt(e.keyCode);

      if (keycode === 9 && isTargetContentDom(e.target)) {
        // TAB to switch color
        switchColor();
        stop = true;
      }

      if (stop) {
        e.preventDefault();
        e.stopPropagation();
        contentDom.focus();
        return false;
      }
    });
  }

  let contentDom = document.getElementById("content-dialog");

  async function _formatMarkdownForKeep(suppressError) {
    contentDom = document.getElementById("content-dialog");

    // remove the previous dom
    try{
        contentDom.remove();
        contentDom = null;
    } catch(err){}

    const plainContentDoms = document.querySelectorAll(
      `[contenteditable="true"][spellcheck="true"]`
    );
    const origTitleDom = plainContentDoms[0];
    const origContentDom = plainContentDoms[1];
    const listItemsDoms = document.querySelectorAll(
      `[contenteditable="true"][aria-label="list item"]`
    );

    let shouldBindData =
      listItemsDoms.length > 0 || plainContentDoms.length > 0;

    if (!contentDom) {
      contentDom = document.createElement("div");
      contentDom.id = "content-dialog";
      contentDom.contentEditable = true;
      //contentDom.addEventListener('blur', () => contentDom.remove())
      contentDom.addEventListener("keydown", (e) => {
        let stop = false;

        const keycode = parseInt(e.keyCode);
        if (keycode === 27) {
          // escape key
          contentDom.remove();
          stop = true;
        }

        if (stop) {
          e.preventDefault();
          e.stopPropagation();

          origContentDom.focus();
          return false;
        }
      });
      target.appendChild(contentDom);
    }

    if (shouldBindData) {
      // clean the dom
      contentDom.innerText = "";

      const articleContent = document.createElement("article");
      contentDom.append(articleContent);

      // force focus on the content dom to stop google keep from
      // doing the infinite scroll loader
      contentDom.addEventListener("blur", () => {
        contentDom.focus();
      });

      let newContentHtml;
      if (
        document.querySelectorAll(
          `[contenteditable="true"][aria-label="list item"]`
        ).length > 0
      ) {
        // is a list of checkboxes
        newContentHtml = [
          ...document.querySelectorAll(
            `[contenteditable="true"][aria-label="list item"]`
          ),
        ]
          .map((d) => `<p>${d.innerText.trim()}</p>`)
          .join("");
      } else if (origContentDom.innerText.includes("```")) {
        // is markdown content
        newContentHtml = marked(origContentDom.innerText).trim();
      } else {
        // is a plain text
        newContentHtml = origContentDom.innerText
          .replace(/ /g, `&nbsp;`)
          .replace(/\n/g, "<br />");
      }

      // append the content
      newContentHtml =
        `<h2>${origTitleDom.innerText}</h2><hr />` + newContentHtml;

      if (
        newContentHtml !== articleContent.innerHTML &&
        document.activeElement.id !== "content-dialog"
      ) {
        articleContent.innerHTML = newContentHtml;

        // append images
        let noteImages = [];
        try{
          noteImages = [...origTitleDom.previousSibling.querySelectorAll("img")].reverse();
        }catch(err){}
        if (noteImages.length > 0) {
          const figureImages = document.createElement("figure");
          figureImages.innerHTML= `
              <button id='btnChangeImageListOrder' style="display: block; background: blue; color: white;" class="unselectable" contenteditable="false">Change Image Ordering</button>
              <div id="contentDomImageList"></div>
          `
          contentDom.append(figureImages);

          const contentDomImageList = figureImages.querySelector('#contentDomImageList');
          const btnChangeImageListOrder = figureImages.querySelector('#btnChangeImageListOrder');
          btnChangeImageListOrder.addEventListener('click', () => {
              noteImages = noteImages.reverse();
              _renderImages();              
          })

          await _renderImages();

          async function _renderImages(){
              contentDomImageList.innerText = '';
              const requestPromises = [];
              for (const img of noteImages) {
                const newImg = document.createElement("div");
                // newImg.innerHTML = `Loading Image...`;
                requestPromises.push(parseAndInsertImageAsBase64(img.src, newImg));
                contentDomImageList.append(newImg);
              }
              await Promise.allSettled(requestPromises);
          }
        }
      }

      // add the close button
      const closeContentBtn = document.createElement("button");
      closeContentBtn.innerText = "X";
      closeContentBtn.id = "content-dialog-close-btn";
      closeContentBtn.addEventListener("click", () => {
        contentDom.remove();
      });
      closeContentBtn.classList.add('unselectable');
      closeContentBtn.contentEditable = "false"
      articleContent.append(closeContentBtn);


      // button to change color
      const toggleThemeBtn = document.createElement("button");
      toggleThemeBtn.innerText = "Toggle Theme";
      toggleThemeBtn.addEventListener("click", switchColor);
      articleContent.prepend(toggleThemeBtn);
      

      for (const anchor of contentDom.querySelectorAll("a")) {
        anchor.target = "_blank";
        anchor.contentEditable = false;
      }

      contentDom.focus();
    } else {
      // setTimeout(_formatMarkdownForKeep, 300);
      contentDom.remove();
      if (suppressError !== true) {
        alert("Preview is not supported");
      }
    }
  }

  function switchColor() {
    // tab key or shift
    var r = document.querySelector(":root");
    colorIdx++;
    if (colorIdx % 2 === 0) {
      // dark
      r.style.setProperty("--color-bg", "#282a36");
      r.style.setProperty("--color-fg", "#f8f8f2");
      r.style.setProperty("--color-link", "#50fa7b");
      r.style.setProperty("--color-border", "#f1fa8c");
    } else {
      // light
      r.style.setProperty("--color-bg", "#f8f8f2");
      r.style.setProperty("--color-fg", "#282a36");
      r.style.setProperty("--color-link", "#ff5555");
      r.style.setProperty("--color-border", "#44475a");
    }
  }

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  function parseAndInsertImageAsBase64(url, newImg) {
    return new Promise((resolve) => {
      let resolved = false;

      toDataURL(url, function (dataUrl) {
        newImg.innerHTML = `<a href='${url}' target='_blank'><img src="${dataUrl}" altText="Doc Image" /></a>`;
        resolve();
        resolved = true;
      });

      setTimeout(
        () => {
          if(resolved === false){
            newImg.innerHTML = `<a href='${url}' target='_blank'><img src="${url}" altText="Doc Image" /></a>`;
            resolve();
          }
        }, 5000
      )
    });
  }

  function isTargetContentDom(startDom) {
    let targetDom = startDom;
    while (targetDom) {
      if (targetDom && targetDom.id === "content-dialog") {
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
      let noteCloseBtns = [];
      for (let button of document.querySelectorAll('[role="button"')) {
        if (button.innerText.trim() === "Close") {
          noteCloseBtns.push(button);
        }
      }

      // insert this button
      for (let noteCloseBtn of noteCloseBtns) {
        if (
          noteCloseBtn &&
          noteCloseBtn.parentElement.querySelectorAll(
            ".format-markdown-modal-btn"
          ).length === 0
        ) {
          const formatButton = document.createElement("div");
          formatButton.innerText = "Format";
          formatButton.className = `format-markdown-modal-btn ${noteCloseBtn.className}`;
          formatButton.style.marginRight = 0;
          formatButton.style.background = "red";
          formatButton.style.color = "white";
          formatButton.addEventListener("click", _formatMarkdownForKeep);
          noteCloseBtn.parentElement.prepend(formatButton);
        }
      }
    };

    // Create an observer instance linked to the callback function
    // Start observing the target node for configured mutations
    const targetNode = document.querySelector(".notes-container");
    new MutationObserver(_setupFormatButtonCallback).observe(targetNode, {
      attributes: true,
      childList: true,
      subtree: false,
    });
  }, 500);
})();
