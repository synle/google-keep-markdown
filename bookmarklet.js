javascript:(function()%7B%2F%2F%20%3D%3DUserScript%3D%3D%0A%2F%2F%20%40name%20%20%20%20%20%20%20%20%20Google%20Keep%20Note%20format%0A%2F%2F%20%40namespace%20%20%20%20http%3A%2F%2Ftampermonkey.net%2F%0A%2F%2F%20%40version%20%20%20%20%20%200.1%0A%2F%2F%20%40description%20%20try%20to%20take%20over%20the%20world!%0A%2F%2F%20%40author%20%20%20%20%20%20%20You%0A%2F%2F%20%40match%20%20%20%20%20%20%20%20*%3A%2F%2Fkeep.google.com%2Fu%2F*%0A%2F%2F%20%40grant%20%20%20%20%20%20%20%20none%0A%2F%2F%20%3D%3D%2FUserScript%3D%3D%0A%0A(function()%20%7B%0A%20%20%20%20'use%20strict'%3B%0A%0A%20%20%20%20let%20target%20%3D%20document.body%3B%0A%20%20const%20isDarkMode%20%3D%20new%20Date().getHours()%20%3E%3D%2019%20%7C%7C%20new%20Date().getHours()%20%3C%3D%208%3B%0A%20%20let%20colorIdx%20%3D%200%3B%0A%20%20let%20styleDom%20%3D%20document.getElementById('style-dialog')%3B%0A%20%20if(!styleDom)%7B%0A%20%20%20%20styleDom%20%3D%20document.createElement(%22style%22)%3B%0A%20%20%20%20styleDom.id%3D%20'style-dialog'%0A%20%20%20%20styleDom.innerText%20%3D%20%60%0A%20%20%20%20%20%20%3Aroot%7B%0A%20%20%20%20%20%20%20%20--color-bg%3A%20%23282a36%3B%0A%20%20%20%20%20%20%20%20--color-fg%3A%20%23f8f8f2%3B%0A%20%20%20%20%20%20%20%20--color-link%3A%20%2350fa7b%3B%0A%20%20%20%20%20%20%20%20--color-border%3A%20%2344475a%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%7B%0A%20%20%20%20%20%20%20%20position%3A%20fixed%3B%0A%20%20%20%20%20%20%20%20top%3A%2010px%3B%0A%20%20%20%20%20%20%20%20bottom%3A%2010px%3B%0A%20%20%20%20%20%20%20%20left%3A%2010px%3B%0A%20%20%20%20%20%20%20%20right%3A%2010px%3B%0A%20%20%20%20%20%20%20%20z-index%3A%2040001%3B%0A%20%20%20%20%20%20%20%20background%3A%20var(--color-bg)%3B%0A%20%20%20%20%20%20%20%20color%3A%20var(--color-fg)%3B%0A%20%20%20%20%20%20%20%20padding%3A%2020px%2025px%3B%0A%20%20%20%20%20%20%20%20overflow%3A%20auto%3B%0A%20%20%20%20%20%20%20%20border%3A%205px%20solid%20var(--color-border)%3B%0A%20%20%20%20%20%20%20%20border-radius%3A%205px%3B%0A%20%20%20%20%20%20%20%20display%3A%20grid%3B%0A%20%20%20%20%20%20%20%20grid-template-columns%3A%20minmax(600px%2C%201fr)%20450px%3B%0A%20%20%20%20%20%20%20%20box-sizing%3A%20border-box%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20%23content-dialog-close-btn%20%7B%0A%20%20%20%20%20%20%20%20position%3A%20absolute%3B%0A%20%20%20%20%20%20%20%20top%3A%200%3B%0A%20%20%20%20%20%20%20%20right%3A%200%3B%0A%20%20%20%20%20%20%20%20padding%3A%2010px%3B%0A%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20background%3A%20black%3B%0A%20%20%20%20%20%20%20%20color%3A%20white%3B%0A%20%20%20%20%20%20%20%20height%3A%2040px%3B%0A%20%20%20%20%20%20%20%20width%3A%2040px%3B%0A%20%20%20%20%20%20%20%20cursor%3A%20pointer%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20%23content-dialog-close-btn%3Ahover%2C%20%23content-dialog%20%23content-dialog-close-btn%3Afocus%7B%0A%20%20%20%20%20%20%20%20background%3A%20%23333%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20pre%7B%0A%20%20%20%20%20%20%20%20border%3A%203px%20dotted%20var(--color-border)%3B%0A%20%20%20%20%20%20%20%20padding%3A%2010px%3B%0A%20%20%20%20%20%20%20%20margin-top%3A%207px%3B%0A%20%20%20%20%20%20%20%20margin-bottom%3A%2010px%3B%0A%20%20%20%20%20%20%20%20text-overflow%3A%20ellipsis%3B%0A%20%20%20%20%20%20%20%20word-break%3A%20break-all%3B%0A%20%20%20%20%20%20%20%20overflow%3A%20hidden%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20h1%7B%0A%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20margin-bottom%3A%2015px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20a%7B%0A%20%20%20%20%20%20%20%20color%3A%20var(--color-link)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20h2%2C%0A%20%20%20%20%20%20%23content-dialog%20h3%2C%0A%20%20%20%20%20%20%23content-dialog%20h4%2C%0A%20%20%20%20%20%20%23content-dialog%20h5%2C%0A%20%20%20%20%20%20%23content-dialog%20h6%7B%0A%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20p%2C%20%23content-dialog%20pre%7B%0A%20%20%20%20%20%20%20%20margin-top%3A%200%3B%0A%20%20%20%20%20%20%20%20margin-bottom%3A%2020px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20figure%7B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20figure%20img%7B%0A%20%20%20%20%20%20%20%20width%3A%20100%25%3B%0A%20%20%20%20%20%20%20%20display%3A%20block%3B%0A%20%20%20%20%20%20%20%20margin%3A%200%20auto%2030px%200%3B%0A%20%20%20%20%20%20%20%20border-radius%3A%205px%3B%0A%20%20%20%20%20%20%20%20border%3A%203px%20solid%20var(--color-border)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20figure%20img%3Ahover%7B%0A%20%20%20%20%20%20%20%20border-color%3A%20var(--color-link)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20a%7B%0A%20%20%20%20%20%20%20%20cursor%3A%20pointer%3B%0A%20%20%20%20%20%20%20%20text-decoration%3A%20none%3B%0A%20%20%20%20%20%20%20%20opacity%3A%200.7%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20a%3Ahover%7B%0A%20%20%20%20%20%20%20%20opacity%3A%201%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%40media%20(max-width%3A%201050px)%20%7B%0A%20%20%20%20%20%20%20%20%23content-dialog%7B%0A%20%20%20%20%20%20%20%20%20%20grid-template-columns%3A%201fr%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%40media%20(min-width%3A%201200px)%20%7B%0A%20%20%20%20%20%20%20%20%23content-dialog%7B%0A%20%20%20%20%20%20%20%20%20%20grid-template-columns%3A%201fr%20600px%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%40media%20(min-width%3A%201600px)%20%7B%0A%20%20%20%20%20%20%20%20%23content-dialog%7B%0A%20%20%20%20%20%20%20%20%20%20grid-template-columns%3A%201fr%20900px%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%60%0A%20%20%20%20target.appendChild(styleDom)%3B%0A%0A%20%20%20%20let%20newScript%20%3D%20document.createElement(%22script%22)%3B%0A%20%20%20%20newScript.src%20%3D%20%22https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fmarked%2Fmarked.min.js%22%3B%0A%20%20%20%20target.appendChild(newScript)%3B%0A%0A%20%20%20%20window.addEventListener('keydown'%2C%20(e)%20%3D%3E%7B%0A%20%20%20%20%20%20let%20stop%20%3D%20false%3B%0A%0A%20%20%20%20%20%20const%20keycode%20%3D%20parseInt(e.keyCode)%3B%0A%0A%20%20%20%20%20%20if(keycode%20%3D%3D%3D%209%20%26%26%20isTargetContentDom(e.target))%20%20%7B%20%2F%2F%20TAB%20to%20switch%20color%0A%20%20%20%20%20%20%20%20switchColor()%3B%0A%20%20%20%20%20%20%20%20stop%20%3D%20true%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20if(stop)%7B%0A%20%20%20%20%20%20%20%20e.preventDefault()%3B%0A%20%20%20%20%20%20%20%20e.stopPropagation()%3B%0A%20%20%20%20%20%20%20%20contentDom.focus()%3B%0A%20%20%20%20%20%20%20%20return%20false%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D)%0A%20%20%7D%0A%0A%20%20let%20contentDom%20%3D%20document.getElementById('content-dialog')%3B%0A%0A%20%20async%20function%20_formatMarkdownForKeep(suppressError)%7B%0A%20%20%20%20const%20origTitleDom%20%3Ddocument.querySelectorAll(%60%5Bcontenteditable%3D%22true%22%5D%5Bspellcheck%3D%22true%22%5D%60)%5B0%5D%0A%20%20%20%20const%20origContentDom%20%3Ddocument.querySelectorAll(%60%5Bcontenteditable%3D%22true%22%5D%5Bspellcheck%3D%22true%22%5D%60)%5B1%5D%0A%20%20%20%20contentDom%20%3D%20document.getElementById('content-dialog')%3B%0A%0A%20%20%20%20let%20shouldBindData%20%3D%20false%3B%0A%20%20%20%20try%7B%0A%20%20%20%20%20%20shouldBindData%20%3D%20origContentDom%20%26%26%20origContentDom.innerText.trim().length%20%3E%200%3B%0A%20%20%20%20%7Dcatch(err)%7B%7D%0A%0A%0A%20%20%20%20let%20width%20%3D%20600%3B%0A%20%20%20%20if(shouldBindData)%7B%0A%20%20%20%20%20%20width%20%3D%20origContentDom.offsetWidth%20%2B%2040%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if(!contentDom)%7B%0A%20%20%20%20%20%20contentDom%20%3D%20document.createElement(%22div%22)%3B%0A%20%20%20%20%20%20contentDom.id%20%3D%20'content-dialog'%3B%0A%20%20%20%20%20%20contentDom.contentEditable%20%3D%20true%0A%20%20%20%20%20%20%2F%2FcontentDom.addEventListener('blur'%2C%20()%20%3D%3E%20contentDom.remove())%0A%20%20%20%20%20%20contentDom.addEventListener('keydown'%2C%20(e)%20%3D%3E%7B%0A%20%20%20%20%20%20%20%20let%20stop%20%3D%20false%3B%0A%0A%20%20%20%20%20%20%20%20const%20keycode%20%3D%20parseInt(e.keyCode)%3B%0A%20%20%20%20%20%20%20%20if(keycode%20%3D%3D%3D%2027)%7B%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20escape%20key%0A%20%20%20%20%20%20%20%20%20%20contentDom.remove()%3B%0A%20%20%20%20%20%20%20%20%20%20stop%20%3D%20true%3B%0A%0A%20%20%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%20%20if(stop)%7B%0A%20%20%20%20%20%20%20%20%20%20e.preventDefault()%3B%0A%20%20%20%20%20%20%20%20%20%20e.stopPropagation()%3B%0A%0A%20%20%20%20%20%20%20%20%20%20origContentDom.focus()%3B%0A%20%20%20%20%20%20%20%20%20%20return%20false%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D)%0A%20%20%20%20%20%20target.appendChild(contentDom)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if(shouldBindData)%7B%0A%20%20%20%20%20%20%2F%2F%20clean%20the%20dom%0A%20%20%20%20%20%20contentDom.innerText%20%3D%20''%3B%0A%0A%20%20%20%20%20%20const%20articleContent%20%3D%20document.createElement('article')%3B%0A%20%20%20%20%20%20contentDom.append(articleContent)%0A%0A%20%20%20%20%20%20%2F%2F%20force%20focus%20on%20the%20content%20dom%20to%20stop%20google%20keep%20from%0A%20%20%20%20%20%20%2F%2F%20doing%20the%20infinite%20scroll%20loader%0A%20%20%20%20%20%20contentDom.addEventListener('blur'%2C%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20contentDom.focus()%3B%0A%20%20%20%20%20%20%7D)%0A%0A%20%20%20%20%20%20let%20newContentHtml%20%3D%20origContentDom.innerText.includes('%60%60%60')%0A%20%20%20%20%20%20%20%20%20%20%3F%20marked(origContentDom.innerText).trim()%0A%20%20%20%20%20%20%20%20%20%20%3A%20origContentDom.innerText.trim().replace(%2F%5Cn%2Fg%2C%20'%3Cbr%20%2F%3E')%0A%0A%20%20%20%20%20%20newContentHtml%20%3D%20%60%3Ch2%3E%24%7BorigTitleDom.innerText%7D%3C%2Fh2%3E%3Chr%20%2F%3E%60%20%2B%20newContentHtml%0A%0A%20%20%20%20%20%20if%20(newContentHtml%20!%3D%3D%20articleContent.innerHTML%20%26%26%20document.activeElement.id%20!%3D%3D%20'content-dialog')%20%7B%0A%20%20%20%20%20%20%20%20%20%20articleContent.innerHTML%20%3D%20newContentHtml%3B%0A%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20append%20images%0A%20%20%20%20%20%20%20%20%20%20const%20noteImages%20%3D%20origTitleDom.previousSibling.querySelectorAll('img')%3B%0A%20%20%20%20%20%20%20%20%20%20if%20(noteImages.length%20%3E%200)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20figureImages%20%3D%20document.createElement('figure')%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20contentDom.append(figureImages)%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20requestPromises%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(const%20img%20of%20origTitleDom.previousSibling.querySelectorAll('img'))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20newImg%20%3D%20document.createElement(%22div%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20newImg.innerHTML%20%3D%20%60Loading%20Image...%60%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20requestPromises.push(parseAndInsertImageAsBase64(img.src%2C%20newImg))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20figureImages.append(newImg)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20await%20Promise.allSettled(requestPromises)%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%2F%2F%20add%20the%20close%20button%0A%20%20%20%20%20%20const%20closeContentBtn%20%3D%20document.createElement('button')%3B%0A%20%20%20%20%20%20closeContentBtn.innerText%20%3D%20'X'%0A%20%20%20%20%20%20closeContentBtn.id%20%3D%20'content-dialog-close-btn'%0A%20%20%20%20%20%20closeContentBtn.addEventListener('click'%2C%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20contentDom.remove()%3B%0A%20%20%20%20%20%20%7D)%0A%20%20%20%20%20%20articleContent.append(closeContentBtn)%0A%0A%20%20%20%20%20%20for(const%20anchor%20of%20contentDom.querySelectorAll('a'))%7B%0A%20%20%20%20%20%20%20%20anchor.target%20%3D%20'_blank'%0A%20%20%20%20%20%20%20%20anchor.contentEditable%20%3D%20false%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20contentDom.focus()%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%2F%2F%20setTimeout(_formatMarkdownForKeep%2C%20300)%3B%0A%20%20%20%20%20%20contentDom.remove()%3B%0A%20%20%20%20%20%20if(suppressError%20!%3D%3D%20true)%7B%0A%20%20%20%20%20%20%20%20alert('Preview%20is%20not%20supported')%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20function%20switchColor()%7B%0A%20%20%20%20%2F%2F%20tab%20key%20or%20shift%0A%20%20%20%20var%20r%20%3D%20document.querySelector('%3Aroot')%3B%0A%20%20%20%20colorIdx%2B%2B%3B%0A%20%20%20%20if(colorIdx%20%25%202%20%3D%3D%3D%200)%7B%0A%20%20%20%20%20%20%2F%2F%20dark%0A%20%20%20%20%20%20r.style.setProperty('--color-bg'%2C%20'%23282a36')%3B%0A%20%20%20%20%20%20r.style.setProperty('--color-fg'%2C%20'%23f8f8f2')%3B%0A%20%20%20%20%20%20r.style.setProperty('--color-link'%2C%20'%2350fa7b')%3B%0A%20%20%20%20%20%20r.style.setProperty('--color-border'%2C%20'%23f1fa8c')%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%2F%2F%20light%0A%20%20%20%20%20%20r.style.setProperty('--color-bg'%2C%20'%23f8f8f2')%3B%0A%20%20%20%20%20%20r.style.setProperty('--color-fg'%2C%20'%23282a36')%3B%0A%20%20%20%20%20%20r.style.setProperty('--color-link'%2C%20'%23ff5555')%3B%0A%20%20%20%20%20%20r.style.setProperty('--color-border'%2C%20'%2344475a')%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20function%20toDataURL(url%2C%20callback)%20%7B%0A%20%20%20%20var%20xhr%20%3D%20new%20XMLHttpRequest()%3B%0A%20%20%20%20xhr.onload%20%3D%20function()%20%7B%0A%20%20%20%20%20%20var%20reader%20%3D%20new%20FileReader()%3B%0A%20%20%20%20%20%20reader.onloadend%20%3D%20function()%20%7B%0A%20%20%20%20%20%20%20%20callback(reader.result)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20reader.readAsDataURL(xhr.response)%3B%0A%20%20%20%20%7D%3B%0A%20%20%20%20xhr.open('GET'%2C%20url)%3B%0A%20%20%20%20xhr.responseType%20%3D%20'blob'%3B%0A%20%20%20%20xhr.send()%3B%0A%20%20%7D%0A%0A%20%20function%20parseAndInsertImageAsBase64(url%2C%20newImg)%7B%0A%20%20%20%20return%20new%20Promise(resolve%20%3D%3E%20%7B%0A%20%20%20%20%20%20toDataURL(url%2C%20function(dataUrl)%20%7B%0A%20%20%20%20%20%20%20%20newImg.innerHTML%20%3D%20%60%3Ca%20href%3D'%24%7Burl%7D'%3E%3Cimg%20src%3D%22%24%7BdataUrl%7D%22%20altText%3D%22Doc%20Image%22%20%2F%3E%3C%2Fa%3E%60%3B%0A%20%20%20%20%20%20%20%20resolve()%3B%0A%20%20%20%20%20%20%7D)%0A%20%20%20%20%7D)%0A%20%20%7D%0A%0A%20%20function%20isTargetContentDom(startDom)%20%7B%0A%20%20%20%20%20%20let%20targetDom%20%3D%20startDom%0A%20%20%20%20%20%20while%20(targetDom)%20%7B%0A%20%20%20%20%20%20%20%20%20%20if%20(targetDom%20%26%26%20targetDom.id%20%3D%3D%3D%20'content-dialog')%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20targetDom%20%3D%20targetDom.parentElement%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20return%20false%3B%0A%20%20%7D%0A%0A%20%20switchColor()%3B%0A%0A%20%20%2F%2F%20auto%20load%20the%20first%20time%0A%20%20setTimeout(()%20%3D%3E%20%7B%0A%20%20%20%20_formatMarkdownForKeep(true)%3B%0A%0A%20%20%20%20%2F%2F%20listen%20on%20dom%20mutation%0A%20%20%20%20%2F%2F%20Callback%20function%20to%20execute%20when%20mutations%20are%20observed%0A%20%20%20%20const%20_setupFormatButtonCallback%20%3D%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20let%20noteCloseBtns%20%3D%20%5B%5D%0A%20%20%20%20%20%20for(let%20button%20of%20document.querySelectorAll('%5Brole%3D%22button%22'))%7B%0A%20%20%20%20%20%20%20%20if(button.innerText.trim()%20%3D%3D%3D%20'Close')%7B%0A%20%20%20%20%20%20%20%20%20%20noteCloseBtns.push(button)%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%2F%2F%20insert%20this%20button%0A%20%20%20%20%20%20for(let%20noteCloseBtn%20of%20noteCloseBtns)%7B%0A%20%20%20%20%20%20%20%20if(noteCloseBtn%20%26%26%20noteCloseBtn.parentElement.querySelectorAll('.format-markdown-modal-btn').length%20%3D%3D%3D%200)%7B%0A%20%20%20%20%20%20%20%20%20%20const%20formatButton%20%3D%20document.createElement('div')%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.innerText%20%3D%20'Format'%0A%20%20%20%20%20%20%20%20%20%20formatButton.className%20%3D%20%60format-markdown-modal-btn%20%24%7BnoteCloseBtn.className%7D%60%0A%20%20%20%20%20%20%20%20%20%20formatButton.style.marginRight%20%3D%200%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.style.background%20%3D%20'red'%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.style.color%20%3D%20'white'%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.addEventListener('click'%2C%20_formatMarkdownForKeep)%0A%20%20%20%20%20%20%20%20%20%20noteCloseBtn.parentElement.prepend(formatButton)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20Create%20an%20observer%20instance%20linked%20to%20the%20callback%20function%0A%20%20%20%20%2F%2F%20Start%20observing%20the%20target%20node%20for%20configured%20mutations%0A%20%20%20%20const%20targetNode%20%3D%20document.querySelector('.notes-container')%3B%0A%20%20%20%20new%20MutationObserver(_setupFormatButtonCallback).observe(targetNode%2C%20%7B%0A%20%20%20%20%20%20attributes%3A%20true%2C%0A%20%20%20%20%20%20childList%3A%20true%2C%0A%20%20%20%20%20%20subtree%3A%20false%0A%20%20%20%20%7D)%3B%0A%20%20%7D%2C%20500)%3B%0A%7D)()%3B%7D)()%3B
