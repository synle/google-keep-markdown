javascript:(function()%7B%2F%2F%20%3D%3DUserScript%3D%3D%0A%2F%2F%20%40name%20%20%20%20%20%20%20%20%20Google%20Keep%20Note%20format%0A%2F%2F%20%40namespace%20%20%20%20http%3A%2F%2Ftampermonkey.net%2F%0A%2F%2F%20%40version%20%20%20%20%20%200.1%0A%2F%2F%20%40description%20%20try%20to%20take%20over%20the%20world!%0A%2F%2F%20%40author%20%20%20%20%20%20%20You%0A%2F%2F%20%40match%20%20%20%20%20%20%20%20*%3A%2F%2Fkeep.google.com%2Fu%2F*%0A%2F%2F%20%40grant%20%20%20%20%20%20%20%20none%0A%2F%2F%20%3D%3D%2FUserScript%3D%3D%0A(function%20()%20%7B%0A%20%20%22use%20strict%22%3B%0A%20%20let%20target%20%3D%20document.body%3B%0A%20%20const%20isDarkMode%20%3D%20new%20Date().getHours()%20%3E%3D%2019%20%7C%7C%20new%20Date().getHours()%20%3C%3D%208%3B%0A%20%20let%20colorIdx%20%3D%200%3B%0A%20%20let%20styleDom%20%3D%20document.getElementById(%22style-dialog%22)%3B%0A%20%20if%20(!styleDom)%20%7B%0A%20%20%20%20styleDom%20%3D%20document.createElement(%22style%22)%3B%0A%20%20%20%20styleDom.id%20%3D%20%22style-dialog%22%3B%0A%20%20%20%20styleDom.innerText%20%3D%20%60%0A%20%20%20%20%20%20%3Aroot%7B%0A%20%20%20%20%20%20%20%20--color-bg%3A%20%23282a36%3B%0A%20%20%20%20%20%20%20%20--color-fg%3A%20%23f8f8f2%3B%0A%20%20%20%20%20%20%20%20--color-link%3A%20%2350fa7b%3B%0A%20%20%20%20%20%20%20%20--color-border%3A%20%2344475a%3B%0A%20%20%20%20%20%20%20%20--width-content%3A%20700px%3B%0A%20%20%20%20%20%20%20%20--width-image%3A%20300px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%7B%0A%20%20%20%20%20%20%20%20position%3A%20fixed%3B%0A%20%20%20%20%20%20%20%20top%3A%2010px%3B%0A%20%20%20%20%20%20%20%20bottom%3A%2010px%3B%0A%20%20%20%20%20%20%20%20left%3A%2010px%3B%0A%20%20%20%20%20%20%20%20right%3A%2010px%3B%0A%20%20%20%20%20%20%20%20z-index%3A%2040001%3B%0A%20%20%20%20%20%20%20%20background%3A%20var(--color-bg)%3B%0A%20%20%20%20%20%20%20%20color%3A%20var(--color-fg)%3B%0A%20%20%20%20%20%20%20%20padding%3A%2010px%2015px%3B%0A%20%20%20%20%20%20%20%20overflow%3A%20auto%3B%0A%20%20%20%20%20%20%20%20border%3A%205px%20solid%20var(--color-border)%3B%0A%20%20%20%20%20%20%20%20border-radius%3A%205px%3B%0A%20%20%20%20%20%20%20%20display%3A%20grid%3B%0A%20%20%20%20%20%20%20%20grid-template-columns%3A%201fr%20var(--width-image)%3B%0A%20%20%20%20%20%20%20%20box-sizing%3A%20border-box%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%23content-dialog%20button%7B%0A%20%20%20%20%20%20%20%20cursor%3A%20pointer%3B%0A%20%20%20%20%20%20%20%20opacity%3A%200.8%3B%0A%20%20%20%20%20%20%20%20border%3A%20none%3B%0A%20%20%20%20%20%20%20%20background%3A%20%23ccc%3B%0A%20%20%20%20%20%20%20%20padding%3A%2010px%2015px%3B%0A%20%20%20%20%20%20%20%20font-weight%3A%20bold%3B%0A%20%20%20%20%20%20%20%20margin-bottom%3A%2020px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20button%3Ahover%2C%20%23content-dialog%20button%3Afocus%7B%0A%20%20%20%20%20%20%20%20opacity%3A%201%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20.unselectable%20%7B%0A%20%20%20%20%20%20%20%20-webkit-user-select%3A%20none%3B%0A%20%20%20%20%20%20%20%20-webkit-touch-callout%3A%20none%3B%0A%20%20%20%20%20%20%20%20-moz-user-select%3A%20none%3B%0A%20%20%20%20%20%20%20%20-ms-user-select%3A%20none%3B%0A%20%20%20%20%20%20%20%20user-select%3A%20none%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20%23content-dialog-close-btn%20%7B%0A%20%20%20%20%20%20%20%20position%3A%20absolute%3B%0A%20%20%20%20%20%20%20%20top%3A%200%3B%0A%20%20%20%20%20%20%20%20right%3A%200%3B%0A%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20background%3A%20black%3B%0A%20%20%20%20%20%20%20%20color%3A%20white%3B%0A%20%20%20%20%20%20%20%20height%3A%2040px%3B%0A%20%20%20%20%20%20%20%20width%3A%2040px%3B%0A%20%20%20%20%20%20%20%20cursor%3A%20pointer%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20pre%7B%0A%20%20%20%20%20%20%20%20border%3A%203px%20dotted%20var(--color-border)%3B%0A%20%20%20%20%20%20%20%20padding%3A%2010px%3B%0A%20%20%20%20%20%20%20%20margin-top%3A%207px%3B%0A%20%20%20%20%20%20%20%20margin-bottom%3A%2010px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20pre%2C%20%23content-dialog%20code%2C%20%23content-dialog%20p%7B%0A%20%20%20%20%20%20%20%20text-overflow%3A%20ellipsis%3B%0A%20%20%20%20%20%20%20%20word-break%3A%20break-all%3B%0A%20%20%20%20%20%20%20%20overflow%3A%20hidden%3B%0A%20%20%20%20%20%20%20%20max-width%3A%20var(--width-content)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20p%7B%0A%20%20%20%20%20%20%20%20word-break%3A%20break-all%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20h1%7B%0A%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20margin-bottom%3A%2015px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20a%7B%0A%20%20%20%20%20%20%20%20color%3A%20var(--color-link)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20h2%2C%0A%20%20%20%20%20%20%23content-dialog%20h3%2C%0A%20%20%20%20%20%20%23content-dialog%20h4%2C%0A%20%20%20%20%20%20%23content-dialog%20h5%2C%0A%20%20%20%20%20%20%23content-dialog%20h6%7B%0A%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20margin-top%3A%200%3B%0A%20%20%20%20%20%20%20%20margin-bottom%3A%207px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20p%2C%20%23content-dialog%20pre%7B%0A%20%20%20%20%20%20%20%20margin-top%3A%200%3B%0A%20%20%20%20%20%20%20%20margin-bottom%3A%2020px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20figure%7B%0A%20%20%20%20%20%20%20%20margin%3A%200px%200px%200px%205px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20figure%20a%7B%0A%20%20%20%20%20%20%20%20display%3A%20block%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20figure%20a%20img%7B%0A%20%20%20%20%20%20%20%20width%3A%20100%25%3B%0A%20%20%20%20%20%20%20%20display%3A%20block%3B%0A%20%20%20%20%20%20%20%20margin%3A%200%20auto%2030px%200%3B%0A%20%20%20%20%20%20%20%20border-radius%3A%205px%3B%0A%20%20%20%20%20%20%20%20border%3A%203px%20solid%20var(--color-border)%3B%0A%20%20%20%20%20%20%20%20box-sizing%3A%20border-box%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20figure%20img%3Ahover%7B%0A%20%20%20%20%20%20%20%20border-color%3A%20var(--color-link)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20a%7B%0A%20%20%20%20%20%20%20%20cursor%3A%20pointer%3B%0A%20%20%20%20%20%20%20%20text-decoration%3A%20none%3B%0A%20%20%20%20%20%20%20%20opacity%3A%200.95%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23content-dialog%20a%3Ahover%7B%0A%20%20%20%20%20%20%20%20opacity%3A%201%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%23content-dialog.single-column%7B%0A%20%20%20%20%20%20%20%20grid-template-columns%3A%201fr%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%40media%20(max-width%3A%201050px)%20%7B%0A%20%20%20%20%20%20%20%20%3Aroot%7B%0A%20%20%20%20%20%20%20%20%20%20--width-content%3A%201050px%3B%0A%20%20%20%20%20%20%20%20%20%20--width-image%3A%20300px%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%23content-dialog%7B%0A%20%20%20%20%20%20%20%20%20%20grid-template-columns%3A%201fr%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%40media%20(min-width%3A%201200px)%20%7B%0A%20%20%20%20%20%20%20%20%3Aroot%7B%0A%20%20%20%20%20%20%20%20%20%20--width-content%3A%20700px%3B%0A%20%20%20%20%20%20%20%20%20%20--width-image%3A%20500px%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%40media%20(min-width%3A%201600px)%20%7B%0A%20%20%20%20%20%20%20%20%3Aroot%7B%0A%20%20%20%20%20%20%20%20%20%20--width-content%3A%20900px%3B%0A%20%20%20%20%20%20%20%20%20%20--width-image%3A%20700px%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%60%3B%0A%20%20%20%20target.appendChild(styleDom)%3B%0A%20%20%20%20let%20newScript%20%3D%20document.createElement(%22script%22)%3B%0A%20%20%20%20newScript.src%20%3D%20%22https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fmarked%2Fmarked.min.js%22%3B%0A%20%20%20%20target.appendChild(newScript)%3B%0A%20%20%20%20window.addEventListener(%22keydown%22%2C%20(e)%20%3D%3E%20%7B%0A%20%20%20%20%20%20let%20stop%20%3D%20false%3B%0A%20%20%20%20%20%20const%20keycode%20%3D%20parseInt(e.keyCode)%3B%0A%20%20%20%20%20%20if%20(keycode%20%3D%3D%3D%209%20%26%26%20isTargetContentDom(e.target))%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20TAB%20to%20switch%20color%0A%20%20%20%20%20%20%20%20switchColor()%3B%0A%20%20%20%20%20%20%20%20stop%20%3D%20true%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20if%20(stop)%20%7B%0A%20%20%20%20%20%20%20%20e.preventDefault()%3B%0A%20%20%20%20%20%20%20%20e.stopPropagation()%3B%0A%20%20%20%20%20%20%20%20contentDom.focus()%3B%0A%20%20%20%20%20%20%20%20return%20false%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D)%3B%0A%20%20%7D%0A%20%20let%20contentDom%20%3D%20document.getElementById(%22content-dialog%22)%3B%0A%20%20async%20function%20_formatMarkdownForKeep(suppressError)%20%7B%0A%20%20%20%20contentDom%20%3D%20document.getElementById(%22content-dialog%22)%3B%0A%20%20%20%20%2F%2F%20remove%20the%20previous%20dom%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20contentDom.remove()%3B%0A%20%20%20%20%20%20contentDom%20%3D%20null%3B%0A%20%20%20%20%7D%20catch%20(err)%20%7B%7D%0A%20%20%20%20const%20plainContentDoms%20%3D%20document.querySelectorAll(%0A%20%20%20%20%20%20%60%5Bcontenteditable%3D%22true%22%5D%5Bspellcheck%3D%22true%22%5D%60%0A%20%20%20%20)%3B%0A%20%20%20%20const%20origTitleDom%20%3D%20plainContentDoms%5B0%5D%3B%0A%20%20%20%20const%20origContentDom%20%3D%20plainContentDoms%5B1%5D%3B%0A%20%20%20%20const%20listItemsDoms%20%3D%20document.querySelectorAll(%0A%20%20%20%20%20%20%60%5Bcontenteditable%3D%22true%22%5D%5Baria-label%3D%22list%20item%22%5D%60%0A%20%20%20%20)%3B%0A%20%20%20%20let%20shouldBindData%20%3D%0A%20%20%20%20%20%20listItemsDoms.length%20%3E%200%20%7C%7C%20plainContentDoms.length%20%3E%200%3B%0A%20%20%20%20if%20(!contentDom)%20%7B%0A%20%20%20%20%20%20contentDom%20%3D%20document.createElement(%22div%22)%3B%0A%20%20%20%20%20%20contentDom.id%20%3D%20%22content-dialog%22%3B%0A%20%20%20%20%20%20contentDom.contentEditable%20%3D%20true%3B%0A%20%20%20%20%20%20%2F%2FcontentDom.addEventListener('blur'%2C%20()%20%3D%3E%20contentDom.remove())%0A%20%20%20%20%20%20contentDom.addEventListener(%22keydown%22%2C%20(e)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20let%20stop%20%3D%20false%3B%0A%20%20%20%20%20%20%20%20const%20keycode%20%3D%20parseInt(e.keyCode)%3B%0A%20%20%20%20%20%20%20%20if%20(keycode%20%3D%3D%3D%2027)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20escape%20key%0A%20%20%20%20%20%20%20%20%20%20contentDom.remove()%3B%0A%20%20%20%20%20%20%20%20%20%20stop%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20if%20(stop)%20%7B%0A%20%20%20%20%20%20%20%20%20%20e.preventDefault()%3B%0A%20%20%20%20%20%20%20%20%20%20e.stopPropagation()%3B%0A%20%20%20%20%20%20%20%20%20%20origContentDom.focus()%3B%0A%20%20%20%20%20%20%20%20%20%20return%20false%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20target.appendChild(contentDom)%3B%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20let%20isSingleColumn%20%3D%20true%3B%0A%0A%20%20%20%20if%20(shouldBindData)%20%7B%20%20%20%20%20%20%0A%20%20%20%20%20%20%2F%2F%20clean%20the%20dom%0A%20%20%20%20%20%20contentDom.innerText%20%3D%20%22%22%3B%0A%20%20%20%20%20%20const%20articleContent%20%3D%20document.createElement(%22article%22)%3B%0A%20%20%20%20%20%20contentDom.append(articleContent)%3B%0A%20%20%20%20%20%20%2F%2F%20force%20focus%20on%20the%20content%20dom%20to%20stop%20google%20keep%20from%0A%20%20%20%20%20%20%2F%2F%20doing%20the%20infinite%20scroll%20loader%0A%20%20%20%20%20%20contentDom.addEventListener(%22blur%22%2C%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20contentDom.focus()%3B%0A%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20let%20newContentHtml%3B%0A%20%20%20%20%20%20if%20(%0A%20%20%20%20%20%20%20%20document.querySelectorAll(%0A%20%20%20%20%20%20%20%20%20%20%60%5Bcontenteditable%3D%22true%22%5D%5Baria-label%3D%22list%20item%22%5D%60%0A%20%20%20%20%20%20%20%20).length%20%3E%200%0A%20%20%20%20%20%20)%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20is%20a%20list%20of%20checkboxes%0A%20%20%20%20%20%20%20%20newContentHtml%20%3D%20%5B%0A%20%20%20%20%20%20%20%20%20%20...document.querySelectorAll(%0A%20%20%20%20%20%20%20%20%20%20%20%20%60%5Bcontenteditable%3D%22true%22%5D%5Baria-label%3D%22list%20item%22%5D%60%0A%20%20%20%20%20%20%20%20%20%20)%2C%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%20%20.map((d)%20%3D%3E%20%60%3Cp%3E%24%7Bd.innerText.trim()%7D%3C%2Fp%3E%60)%0A%20%20%20%20%20%20%20%20%20%20.join(%22%22)%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(origContentDom.innerText.includes(%22%60%60%60%22))%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20is%20markdown%20content%0A%20%20%20%20%20%20%20%20newContentHtml%20%3D%20marked(origContentDom.innerText).trim()%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20is%20a%20plain%20text%0A%20%20%20%20%20%20%20%20newContentHtml%20%3D%20origContentDom.innerText%0A%20%20%20%20%20%20%20%20%20%20.replace(%2F%20%2Fg%2C%20%60%26nbsp%3B%60)%0A%20%20%20%20%20%20%20%20%20%20.replace(%2F%5Cn%2Fg%2C%20%22%3Cbr%20%2F%3E%22)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%2F%20append%20the%20content%0A%20%20%20%20%20%20newContentHtml%20%3D%0A%20%20%20%20%20%20%20%20%60%3Ch2%3E%24%7BorigTitleDom.innerText%7D%3C%2Fh2%3E%3Chr%20%2F%3E%60%20%2B%20newContentHtml%3B%0A%20%20%20%20%20%20if%20(%0A%20%20%20%20%20%20%20%20newContentHtml%20!%3D%3D%20articleContent.innerHTML%20%26%26%0A%20%20%20%20%20%20%20%20document.activeElement.id%20!%3D%3D%20%22content-dialog%22%0A%20%20%20%20%20%20)%20%7B%0A%20%20%20%20%20%20%20%20articleContent.innerHTML%20%3D%20newContentHtml%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20append%20images%0A%20%20%20%20%20%20%20%20let%20noteImages%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20noteImages%20%3D%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20...origTitleDom.previousSibling.querySelectorAll(%22img%22)%2C%0A%20%20%20%20%20%20%20%20%20%20%5D.reverse()%3B%0A%20%20%20%20%20%20%20%20%7D%20catch%20(err)%20%7B%0A%20%20%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20noteImages%20%3D%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20...origTitleDom.parentElement.parentElement.parentElement.querySelectorAll(%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22img%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D.reverse()%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(err)%20%7B%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20if%20(noteImages.length%20%3E%200)%20%7B%0A%20%20%20%20%20%20%20%20%20%20const%20figureImages%20%3D%20document.createElement(%22figure%22)%3B%0A%20%20%20%20%20%20%20%20%20%20figureImages.innerHTML%20%3D%20%60%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20id%3D'btnChangeImageListOrder'%20style%3D%22display%3A%20block%3B%20background%3A%20blue%3B%20color%3A%20white%3B%22%20class%3D%22unselectable%22%20contenteditable%3D%22false%22%3EChange%20Image%20Ordering%3C%2Fbutton%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch2%3E%24%7BnoteImages.length%7D%20Images%3C%2Fh2%3E%3Chr%20%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20id%3D%22contentDomImageList%22%3E%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%60%3B%0A%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20figure%20out%20if%20we%20need%20to%20add%20it%20to%20the%20second%20column%20or%20simply%20consolidate%20things%20into%20a%20single%20column%0A%20%20%20%20%20%20%20%20%20%20if(articleContent.innerText.length%20%3C%3D%205000)%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20too%20little%20text%2C%20put%20things%20in%20the%20same%20column%0A%20%20%20%20%20%20%20%20%20%20%20%20articleContent.append(figureImages)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20isSingleColumn%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20contentDom.append(figureImages)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20isSingleColumn%20%3D%20false%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20const%20contentDomImageList%20%3D%20figureImages.querySelector(%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%23contentDomImageList%22%0A%20%20%20%20%20%20%20%20%20%20)%3B%0A%20%20%20%20%20%20%20%20%20%20const%20btnChangeImageListOrder%20%3D%20figureImages.querySelector(%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%23btnChangeImageListOrder%22%0A%20%20%20%20%20%20%20%20%20%20)%3B%0A%20%20%20%20%20%20%20%20%20%20btnChangeImageListOrder.addEventListener(%22click%22%2C%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20noteImages%20%3D%20noteImages.reverse()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20_renderImages()%3B%0A%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20await%20_renderImages()%3B%0A%20%20%20%20%20%20%20%20%20%20async%20function%20_renderImages()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20contentDomImageList.innerText%20%3D%20%22%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20requestPromises%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20for%20(const%20img%20of%20noteImages)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20newImg%20%3D%20document.createElement(%22div%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20newImg.innerHTML%20%3D%20%60Loading%20Image...%60%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20requestPromises.push(%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20parseAndInsertImageAsBase64(img.src%2C%20newImg)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20contentDomImageList.append(newImg)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20await%20Promise.allSettled(requestPromises)%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20contentDom.classList.toggle('single-column'%2C%20isSingleColumn)%3B%0A%0A%20%20%20%20%20%20%2F%2F%20add%20the%20close%20button%0A%20%20%20%20%20%20const%20closeContentBtn%20%3D%20document.createElement(%22button%22)%3B%0A%20%20%20%20%20%20closeContentBtn.innerText%20%3D%20%22X%22%3B%0A%20%20%20%20%20%20closeContentBtn.id%20%3D%20%22content-dialog-close-btn%22%3B%0A%20%20%20%20%20%20closeContentBtn.addEventListener(%22click%22%2C%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20contentDom.remove()%3B%0A%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20closeContentBtn.classList.add(%22unselectable%22)%3B%0A%20%20%20%20%20%20closeContentBtn.contentEditable%20%3D%20%22false%22%3B%0A%20%20%20%20%20%20articleContent.append(closeContentBtn)%3B%0A%20%20%20%20%20%20%2F%2F%20button%20to%20change%20color%0A%20%20%20%20%20%20const%20toggleThemeBtn%20%3D%20document.createElement(%22button%22)%3B%0A%20%20%20%20%20%20toggleThemeBtn.innerText%20%3D%20%22Toggle%20Theme%22%3B%0A%20%20%20%20%20%20toggleThemeBtn.addEventListener(%22click%22%2C%20switchColor)%3B%0A%20%20%20%20%20%20articleContent.prepend(toggleThemeBtn)%3B%0A%20%20%20%20%20%20for%20(const%20anchor%20of%20contentDom.querySelectorAll(%22a%22))%20%7B%0A%20%20%20%20%20%20%20%20anchor.target%20%3D%20%22_blank%22%3B%0A%20%20%20%20%20%20%20%20anchor.contentEditable%20%3D%20false%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20contentDom.focus()%3B%0A%0A%20%20%20%20%20%20%2F%2F%20handling%20going%20back%20on%20url%2C%20remove%20the%20content%20dom%0A%20%20%20%20%20%20const%20popStateHandler%20%3D%20window.addEventListener('popstate'%2C%20(event)%20%3D%3E%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20contentDom.remove()%3B%0A%20%20%20%20%20%20%20%20window.removeEventListener('popstate'%2C%20popStateHandler)%3B%0A%20%20%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%2F%2F%20setTimeout(_formatMarkdownForKeep%2C%20300)%3B%0A%20%20%20%20%20%20contentDom.remove()%3B%0A%20%20%20%20%20%20if%20(suppressError%20!%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20%20%20alert(%22Preview%20is%20not%20supported%22)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20function%20switchColor()%20%7B%0A%20%20%20%20%2F%2F%20tab%20key%20or%20shift%0A%20%20%20%20var%20r%20%3D%20document.querySelector(%22%3Aroot%22)%3B%0A%20%20%20%20colorIdx%2B%2B%3B%0A%20%20%20%20if%20(colorIdx%20%25%202%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20%20%20%2F%2F%20dark%0A%20%20%20%20%20%20r.style.setProperty(%22--color-bg%22%2C%20%22%23282a36%22)%3B%0A%20%20%20%20%20%20r.style.setProperty(%22--color-fg%22%2C%20%22%23f8f8f2%22)%3B%0A%20%20%20%20%20%20r.style.setProperty(%22--color-link%22%2C%20%22%2350fa7b%22)%3B%0A%20%20%20%20%20%20r.style.setProperty(%22--color-border%22%2C%20%22%23f1fa8c%22)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%2F%2F%20light%0A%20%20%20%20%20%20r.style.setProperty(%22--color-bg%22%2C%20%22%23f8f8f2%22)%3B%0A%20%20%20%20%20%20r.style.setProperty(%22--color-fg%22%2C%20%22%23282a36%22)%3B%0A%20%20%20%20%20%20r.style.setProperty(%22--color-link%22%2C%20%22%23ff5555%22)%3B%0A%20%20%20%20%20%20r.style.setProperty(%22--color-border%22%2C%20%22%2344475a%22)%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20function%20toDataURL(url%2C%20callback)%20%7B%0A%20%20%20%20var%20xhr%20%3D%20new%20XMLHttpRequest()%3B%0A%20%20%20%20xhr.onload%20%3D%20function%20()%20%7B%0A%20%20%20%20%20%20var%20reader%20%3D%20new%20FileReader()%3B%0A%20%20%20%20%20%20reader.onloadend%20%3D%20function%20()%20%7B%0A%20%20%20%20%20%20%20%20callback(reader.result)%3B%0A%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%20%20reader.readAsDataURL(xhr.response)%3B%0A%20%20%20%20%7D%3B%0A%20%20%20%20xhr.open(%22GET%22%2C%20url)%3B%0A%20%20%20%20xhr.responseType%20%3D%20%22blob%22%3B%0A%20%20%20%20xhr.send()%3B%0A%20%20%7D%0A%0A%20%20function%20parseAndInsertImageAsBase64(url%2C%20newImg)%20%7B%0A%20%20%20%20return%20new%20Promise((resolve)%20%3D%3E%20%7B%0A%20%20%20%20%20%20let%20resolved%20%3D%20false%3B%0A%20%20%20%20%20%20toDataURL(url%2C%20function%20(dataUrl)%20%7B%0A%20%20%20%20%20%20%20%20newImg.innerHTML%20%3D%20%60%3Ca%20href%3D'%24%7Burl%7D'%20target%3D'_blank'%3E%3Cimg%20src%3D%22%24%7BdataUrl%7D%22%20altText%3D%22Doc%20Image%22%20%2F%3E%3C%2Fa%3E%60%3B%0A%20%20%20%20%20%20%20%20resolve()%3B%0A%20%20%20%20%20%20%20%20resolved%20%3D%20true%3B%0A%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20setTimeout(()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20(resolved%20%3D%3D%3D%20false)%20%7B%0A%20%20%20%20%20%20%20%20%20%20newImg.innerHTML%20%3D%20%60%3Ca%20href%3D'%24%7Burl%7D'%20target%3D'_blank'%3E%3Cimg%20src%3D%22%24%7Burl%7D%22%20altText%3D%22Doc%20Image%22%20%2F%3E%3C%2Fa%3E%60%3B%0A%20%20%20%20%20%20%20%20%20%20resolve()%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%2C%205000)%3B%0A%20%20%20%20%7D)%3B%0A%20%20%7D%0A%0A%20%20function%20isTargetContentDom(startDom)%20%7B%0A%20%20%20%20let%20targetDom%20%3D%20startDom%3B%0A%20%20%20%20while%20(targetDom)%20%7B%0A%20%20%20%20%20%20if%20(targetDom%20%26%26%20targetDom.id%20%3D%3D%3D%20%22content-dialog%22)%20%7B%0A%20%20%20%20%20%20%20%20return%20true%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20targetDom%20%3D%20targetDom.parentElement%3B%0A%20%20%20%20%7D%0A%20%20%20%20return%20false%3B%0A%20%20%7D%0A%20%20switchColor()%3B%0A%20%20%2F%2F%20auto%20load%20the%20first%20time%0A%20%20setTimeout(()%20%3D%3E%20%7B%0A%20%20%20%20_formatMarkdownForKeep(true)%3B%0A%20%20%20%20%2F%2F%20listen%20on%20dom%20mutation%0A%20%20%20%20%2F%2F%20Callback%20function%20to%20execute%20when%20mutations%20are%20observed%0A%20%20%20%20const%20_setupFormatButtonCallback%20%3D%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20let%20noteCloseBtns%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20for%20(let%20button%20of%20document.querySelectorAll('%5Brole%3D%22button%22'))%20%7B%0A%20%20%20%20%20%20%20%20if%20(button.innerText.trim()%20%3D%3D%3D%20%22Close%22)%20%7B%0A%20%20%20%20%20%20%20%20%20%20noteCloseBtns.push(button)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%2F%20insert%20this%20button%0A%20%20%20%20%20%20for%20(let%20noteCloseBtn%20of%20noteCloseBtns)%20%7B%0A%20%20%20%20%20%20%20%20if%20(%0A%20%20%20%20%20%20%20%20%20%20noteCloseBtn%20%26%26%0A%20%20%20%20%20%20%20%20%20%20noteCloseBtn.parentElement.querySelectorAll(%0A%20%20%20%20%20%20%20%20%20%20%20%20%22.format-markdown-modal-btn%22%0A%20%20%20%20%20%20%20%20%20%20).length%20%3D%3D%3D%200%0A%20%20%20%20%20%20%20%20)%20%7B%0A%20%20%20%20%20%20%20%20%20%20const%20formatButton%20%3D%20document.createElement(%22div%22)%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.innerText%20%3D%20%22Format%22%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.className%20%3D%20%60format-markdown-modal-btn%20%24%7BnoteCloseBtn.className%7D%60%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.style.marginRight%20%3D%200%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.style.background%20%3D%20%22red%22%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.style.color%20%3D%20%22white%22%3B%0A%20%20%20%20%20%20%20%20%20%20formatButton.addEventListener(%22click%22%2C%20_formatMarkdownForKeep)%3B%0A%20%20%20%20%20%20%20%20%20%20noteCloseBtn.parentElement.prepend(formatButton)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%3B%0A%20%20%20%20%2F%2F%20Create%20an%20observer%20instance%20linked%20to%20the%20callback%20function%0A%20%20%20%20%2F%2F%20Start%20observing%20the%20target%20node%20for%20configured%20mutations%0A%20%20%20%20const%20targetNode%20%3D%20document.querySelector(%22.notes-container%22)%3B%0A%20%20%20%20new%20MutationObserver(_setupFormatButtonCallback).observe(targetNode%2C%20%7B%0A%20%20%20%20%20%20attributes%3A%20true%2C%0A%20%20%20%20%20%20childList%3A%20true%2C%0A%20%20%20%20%20%20subtree%3A%20false%2C%0A%20%20%20%20%7D)%3B%0A%20%20%7D%2C%20500)%3B%0A%7D)()%3B%7D)()%3B
