<svelte:options accessors/>
<script>
    import LinkForm from './LinkForm.svelte'
    export let top
    export let left
    export let hidden = true
    export let inlineToolbarOptions
    export let formats = {}
    let linkForm
    let linkFormOpen

    function setFormat(command) {
        document.execCommand(command);
        formats[command] = document.queryCommandState(command)
    }

    function sanitize(ele) {
        // Prevents nesting of many spans and set the proper font class. Probably needs refactoring, for clarity's sake.
        let fontClass = ele.classList.contains("fr-text--lg") ? 'fr-text' : 'fr-text--lg'
        let fontClassHolder = ele.querySelector("span[class]")
        if (!fontClassHolder && ele.parentNode.nodeName.toLowerCase() === "span") {
            fontClassHolder = ele.parentNode
        }
        if (fontClassHolder) {
            fontClass = fontClassHolder.classList.contains("fr-text--lg") ? 'fr-text' : 'fr-text--lg'
            if (fontClassHolder.textContent === ele.textContent && fontClassHolder.contains(ele)) {
                ele = fontClassHolder
            } else if (fontClassHolder.textContent.length < ele.textContent.length && ele.parentNode.nodeName.toLowerCase() === "span") {
                ele.parentNode.replaceWith(ele)
            }
        }

        if (ele.children.length) {
            // Removes superfluous span, if there is any.
            ele.innerHTML = ele.innerHTML.replace(/<\/?span[^>]*>/g, "")
            // Despite the replace() working well, a empty node sometimes remains. If it is found, it is removed.
            if (ele.nextElementSibling && ele.nextElementSibling.textContent === "") {
                ele.parentNode.removeChild(ele.nextElementSibling)
            }
        }
        ele.className = fontClass
        return ele
    }


    function setFontSize() {
        let selection = document.getSelection();
        if (selection) {
            let range = selection.getRangeAt(0)
            let span = document.createElement('span')
            span.appendChild(range.extractContents())
            range.insertNode(span)
            span = sanitize(span)
            document.getSelection().removeAllRanges()
            range.selectNode(span)
            document.getSelection().addRange(range)
            formats["fontSize"] = span.className !== "fr-text"
        }
    }


    function preventBlur(e) {
        // inlineToolbar should not disappear on user's interactions.
        if (!e.target.matches(".fr-input")) e.preventDefault()
    }



</script>

<span class="fr-mt-1w" class:hidden style="top: {top}px; left: {left}px;" on:mousedown={preventBlur}>
    <div class="fr-grid-row fr-px-3v">
        {#if inlineToolbarOptions.includes("fontSize")}
        <button type="button" on:click={() => setFontSize()} class:isActive={formats.fontSize} disabled="{linkFormOpen}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M11.246 15H4.754l-2 5H.6L7 4h2l6.4 16h-2.154l-2-5zm-.8-2L8 6.885 5.554 13h4.892zM21 12.535V12h2v8h-2v-.535a4 4 0 1 1 0-6.93zM19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                    fill="rgba(0,0,145,1)"/></svg>
            <div class="arrow" class:down={formats.fontSize}></div>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("bold")}
        <button type="button" on:click={() => setFormat("bold")} class:isActive={formats.bold} disabled="{linkFormOpen}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("italic")}
        <button type="button" on:click={() => setFormat("italic")} class:isActive={formats.italic} disabled="{linkFormOpen}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("insertOrderedList")}
        <button type="button" on:click={() => setFormat("insertOrderedList")}
                class:isActive={formats.insertOrderedList} disabled="{linkFormOpen}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("insertUnorderedList")}
        <button type="button" on:click={() => setFormat("insertUnorderedList")}
                class:isActive={formats.insertUnorderedList} disabled="{linkFormOpen}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("createLink")}
        <button type="button" on:click={linkForm.toggleLinkForm} class:linkform-open={linkFormOpen}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M17.657 14.828l-1.414-1.414L17.657 12A4 4 0 1 0 12 6.343l-1.414 1.414-1.414-1.414 1.414-1.414a6 6 0 0 1 8.485 8.485l-1.414 1.414zm-2.829 2.829l-1.414 1.414a6 6 0 1 1-8.485-8.485l1.414-1.414 1.414 1.414L6.343 12A4 4 0 1 0 12 17.657l1.414-1.414 1.414 1.414zm0-9.9l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
    </div>
    {#if inlineToolbarOptions.includes("createLink")}
    <LinkForm bind:this={linkForm} bind:toolbarHidden={hidden} bind:open={linkFormOpen}/>
    {/if}
</span>

<style lang="scss">

  span {
    --color: #e3e3fe;
    position: absolute;
    box-shadow: 0 2px 8px 2px rgba(22, 22, 22, 0.08),
    0 2px 8px -4px rgba(22, 22, 22, 0.08);
    transform: translate(-50%, 100%);
    background: var(--color);
    z-index: 1;
    max-height: 2.5rem;
    min-width : 19.5rem;

    &:before {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      border-left: 0.5rem solid transparent;
      border-right: 0.5rem solid transparent;
      border-bottom: 0.5rem solid var(--color);
      left: 50%;
      transform: translate(-50%, -100%);
    }
  }

  .fr-grid-row button {
    min-width: 2.5rem;
    min-height: 2.5rem;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #b9b9fb;
    }
  }

  .isActive, button:focus {
    background: #9393f8!important;
  }

  .linkform-open {
    box-shadow: inset 0 -4px 0 -2px #000091;
  }

  .arrow {
    width: 0;
    height: 0;
    margin-left: 0.125rem;
    border-left: 0.25rem solid transparent;
    border-right: 0.25rem solid transparent;
    border-bottom: 0.25rem solid black;

    &.down {
      border-bottom: none;
      border-top: 0.25rem solid black;
    }
  }


  .hidden {
    display: none
  }

</style>
