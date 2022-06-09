<svelte:options accessors />

<script>
    import {getContext} from 'svelte';
    import LinkForm from './LinkForm.svelte';
    import AnchorForm from './AnchorForm.svelte';
    import LangForm from './LangForm.svelte';
    export let top;
    export let left;
    export let hidden = true;
    export let inlineToolbarOptions;
    export let formats = {};
    let linkForm, linkFormOpen;
    let langForm, langFormOpen;
    export let linkFormHasLink;
    export let langFormHasSpan;
    let anchorForm, anchorFormOpen, anchor;
    let headerLvl = getContext('headerLvl');
    $: formats.headerLevel = `fr-h${$headerLvl}`;
    function setFormat(command) {
        document.execCommand(command);
        formats[command] = document.queryCommandState(command);
        // The list-inserting commands are mutually exclusive.
        if (command === 'insertOrderedList' && formats['insertUnorderedList']) {
            formats['insertUnorderedList'] = false;
        } else if (
            command === 'insertUnorderedList' &&
            formats['insertOrderedList']
        ) {
            formats['insertOrderedList'] = false;
        }
    }
    function sanitize(ele) {
        // Prevents nesting of many spans and set the proper font class. Probably needs refactoring, for clarity's sake.
        let fontClass = ele.classList.contains('fr-text--lg')
            ? 'fr-text'
            : 'fr-text--lg';
        let fontClassHolder = ele.querySelector('span[class]');
        if (
            !fontClassHolder &&
            ele.parentNode.nodeName.toLowerCase() === 'span'
        ) {
            fontClassHolder = ele.parentNode;
        }
        if (fontClassHolder) {
            fontClass = fontClassHolder.classList.contains('fr-text--lg')
                ? 'fr-text'
                : 'fr-text--lg';
            if (
                fontClassHolder.textContent === ele.textContent &&
                fontClassHolder.contains(ele)
            ) {
                ele = fontClassHolder;
            } else if (
                fontClassHolder.textContent.length < ele.textContent.length &&
                ele.parentNode.nodeName.toLowerCase() === 'span'
            ) {
                ele.parentNode.replaceWith(ele);
            }
        }
        if (ele.children.length) {
            // Removes superfluous span, if there is any.
            ele.innerHTML = ele.innerHTML.replace(/<\/?span[^>]*>/g, '');
            // Despite the replace() working well, a empty node sometimes remains. If it is found, it is removed.
            if (
                ele.nextElementSibling &&
                ele.nextElementSibling.textContent === ''
            ) {
                ele.parentNode.removeChild(ele.nextElementSibling);
            }
        }
        ele.className = fontClass;
        return ele;
    }
    function setFontSize() {
        let selection = document.getSelection();
        if (selection) {
            let range = selection.getRangeAt(0);
            let span = document.createElement('span');
            span.appendChild(range.extractContents());
            range.insertNode(span);
            span = sanitize(span);
            document.getSelection().removeAllRanges();
            range.selectNode(span);
            document.getSelection().addRange(range);
            formats['fontSize'] = span.className !== 'fr-text';
        }
    }
    function preventBlur(e) {
        // inlineToolbar should not disappear on user's interactions.
        if (!e.target.matches('.fr-input')) e.preventDefault();
    }
</script>

<span
    class="svelte-inlinetoolbar fr-mt-1w"
    class:hidden
    style="top: {top}px; left: {left}px;"
    on:mousedown={preventBlur}
    class:minwidth={inlineToolbarOptions.includes('createLink') ||
        inlineToolbarOptions.includes('anchor') ||
        inlineToolbarOptions.includes('createLang')}
>
    <div
        class="fr-grid-row fr-px-3v"
        class:elements-disabled={linkFormOpen || anchorFormOpen || langFormOpen}
    >
        {#each [2, 3, 4] as headerLevel}
            {#if inlineToolbarOptions.includes('fr-h' + headerLevel)}
                <button
                    type="button"
                    on:click={() => headerLvl.set(headerLevel)}
                    class:isActive={formats.headerLevel ===
                        'fr-h' + headerLevel}
                    class="heading fr-text--bold"
                    disabled={linkFormOpen || anchorFormOpen || langFormOpen}
                >
                    T<sub class="fr-text--bold">{headerLevel}</sub>
                </button>
            {/if}
        {/each}
        {#if inlineToolbarOptions.includes('fontSize')}
            <button
                type="button"
                on:click={() => setFontSize()}
                class:isActive={formats.fontSize}
                disabled={linkFormOpen || anchorFormOpen || langFormOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                        d="M11.246 15H4.754l-2 5H.6L7 4h2l6.4 16h-2.154l-2-5zm-.8-2L8 6.885 5.554 13h4.892zM21 12.535V12h2v8h-2v-.535a4 4 0 1 1 0-6.93zM19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                        fill="rgba(0,0,145,1)"
                    /></svg
                >
                <div class="arrow" class:down={formats.fontSize} />
            </button>
        {/if}
        {#if inlineToolbarOptions.includes('bold')}
            <button
                type="button"
                on:click={() => setFormat('bold')}
                class:isActive={formats.bold}
                disabled={linkFormOpen || anchorFormOpen || langFormOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                        d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
                        fill="rgba(0,0,145,1)"
                    /></svg
                >
            </button>
        {/if}
        {#if inlineToolbarOptions.includes('italic')}
            <button
                type="button"
                on:click={() => setFormat('italic')}
                class:isActive={formats.italic}
                disabled={linkFormOpen || anchorFormOpen || langFormOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                        d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"
                        fill="rgba(0,0,145,1)"
                    /></svg
                >
            </button>
        {/if}
        {#if inlineToolbarOptions.includes('insertOrderedList')}
            <button
                type="button"
                on:click={() => setFormat('insertOrderedList')}
                class:isActive={formats.insertOrderedList}
                disabled={linkFormOpen || anchorFormOpen || langFormOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                        d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
                        fill="rgba(0,0,145,1)"
                    /></svg
                >
            </button>
        {/if}
        {#if inlineToolbarOptions.includes('insertUnorderedList')}
            <button
                type="button"
                on:click={() => setFormat('insertUnorderedList')}
                class:isActive={formats.insertUnorderedList}
                disabled={linkFormOpen || anchorFormOpen || langFormOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                        d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
                        fill="rgba(0,0,145,1)"
                    /></svg
                >
            </button>
        {/if}
        {#if inlineToolbarOptions.includes('createLink')}
            <button
                type="button"
                on:click={linkForm.toggleLinkForm}
                class:isActive={linkFormHasLink}
                class:form-opened={linkFormOpen}
                disabled={anchorFormOpen || langFormOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                        d="M17.657 14.828l-1.414-1.414L17.657 12A4 4 0 1 0 12 6.343l-1.414 1.414-1.414-1.414 1.414-1.414a6 6 0 0 1 8.485 8.485l-1.414 1.414zm-2.829 2.829l-1.414 1.414a6 6 0 1 1-8.485-8.485l1.414-1.414 1.414 1.414L6.343 12A4 4 0 1 0 12 17.657l1.414-1.414 1.414 1.414zm0-9.9l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
                        fill="rgba(0,0,145,1)"
                    /></svg
                >
            </button>
        {/if}
        {#if inlineToolbarOptions.includes('anchor')}
            <button
                type="button"
                on:click={anchorForm.toggleAnchorForm}
                class:isActive={$anchor}
                class:form-opened={anchorFormOpen}
                disabled={linkFormOpen || langFormOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                        d="M2.05 11H7v2H4.062A8.004 8.004 0 0 0 11 19.938V9.874A4.002 4.002 0 0 1 12 2a4 4 0 0 1 1 7.874v10.064A8.004 8.004 0 0 0 19.938 13H17v-2h4.95c.033.329.05.663.05 1 0 5.523-4.477 10-10 10S2 17.523 2 12c0-.337.017-.671.05-1zM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                        fill="rgba(0,0,145,1)"
                    /></svg
                >
            </button>
        {/if}
        {#if inlineToolbarOptions.includes('createLang')}
            <button
                type="button"
                on:click={langForm.toggleLangForm}
                class:isActive={langFormHasSpan}
                class:form-opened={langFormOpen}
                disabled={linkFormOpen || anchorFormOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 122.88 92.91"
                    width="20"
                    height="20"
                >
                    <path
                        fill="rgba(0,0,145,1)"
                        d="M20.15,83.63,31.63,73.4a2.89,2.89,0,0,1,1.91-.73h27.8a.92.92,0,0,0,.93-.93V65.9H68v5.84a6.71,6.71,0,0,1-6.68,6.68H34.62L19.3,92.07a2.87,2.87,0,0,1-4.9-2V78.42H6.69A6.71,6.71,0,0,1,0,71.74V28.59a6.76,6.76,0,0,1,6.69-6.68H43.35v5.75H6.69a1,1,0,0,0-.94.93V71.74a.91.91,0,0,0,.28.65,1,1,0,0,0,.66.28H17.27a2.88,2.88,0,0,1,2.88,2.88v8.08Zm.21-19.48L29.6,36.24h8.83l9.24,27.91H40.35L38.8,59.07H29.15l-1.51,5.08ZM30.79,53.24h6.37L34,41.81,30.79,53.24ZM76.63,13.35h8.7V11.11a.69.69,0,0,1,.69-.69h4.65a.68.68,0,0,1,.68.69v2.24h9.76a.68.68,0,0,1,.68.69V18.5a.68.68,0,0,1-.68.68H99.56a26.3,26.3,0,0,1-.91,3.88l0,.06a26.07,26.07,0,0,1-1.74,4.15,32.34,32.34,0,0,1-2.14,3.43c-.67,1-1.41,1.9-2.2,2.83a35.78,35.78,0,0,0,3.68,3.83,41.43,41.43,0,0,0,5.09,3.74.68.68,0,0,1,.21.94l-2.39,3.73a.69.69,0,0,1-1,.2,45.88,45.88,0,0,1-5.58-4.08l0,0a41.42,41.42,0,0,1-4-4.1C87.3,38.93,86.15,40,85,41l0,0c-1.36,1.12-2.79,2.2-4.47,3.36a.69.69,0,0,1-1-.17L77,40.53a.69.69,0,0,1,.17-1c1.66-1.14,3-2.19,4.36-3.28,1.16-1,2.28-2,3.49-3.16a44.82,44.82,0,0,1-2.77-4.45A28.84,28.84,0,0,1,80,22.9a.68.68,0,0,1,.47-.84l4.27-1.19a.68.68,0,0,1,.84.47A22.62,22.62,0,0,0,89,28.7L90.27,27a26.33,26.33,0,0,0,1.51-2.47l0,0A19.43,19.43,0,0,0,93,21.62a24,24,0,0,0,.66-2.44h-17a.69.69,0,0,1-.69-.68V14a.69.69,0,0,1,.69-.69Zm27,56.82L88.26,56.51H61.54a6.73,6.73,0,0,1-6.69-6.68V6.69a6.71,6.71,0,0,1,2-4.72l.2-.18A6.67,6.67,0,0,1,61.54,0h54.65a6.69,6.69,0,0,1,4.71,2l.19.2a6.69,6.69,0,0,1,1.79,4.51V49.83a6.73,6.73,0,0,1-6.69,6.68h-7.7V68.13a2.88,2.88,0,0,1-4.91,2ZM91.26,51.49l11.47,10.23V53.64a2.88,2.88,0,0,1,2.88-2.88h10.58a.92.92,0,0,0,.65-.28.91.91,0,0,0,.29-.65V6.69a1,1,0,0,0-.22-.58L116.84,6a1,1,0,0,0-.65-.29H61.54A.94.94,0,0,0,61,6L60.89,6a.92.92,0,0,0-.28.65V49.83a.92.92,0,0,0,.93.93H89.35a2.86,2.86,0,0,1,1.91.73Z"
                    />
                </svg>
            </button>
        {/if}
    </div>
    {#if !hidden}
        <!--This div is needed for svelte to properly remove the element when condition are not met -->
        <div>
            {#if inlineToolbarOptions.includes('anchor')}
                <AnchorForm
                    bind:this={anchorForm}
                    bind:toolbarHidden={hidden}
                    bind:open={anchorFormOpen}
                    bind:anchor
                />
            {/if}
            {#if inlineToolbarOptions.includes('createLink')}
                <LinkForm
                    bind:this={linkForm}
                    bind:toolbarHidden={hidden}
                    bind:open={linkFormOpen}
                    on:ExternalLinkAdded
                />
            {/if}
            {#if inlineToolbarOptions.includes('createLang')}
                <LangForm
                    bind:this={langForm}
                    bind:toolbarHidden={hidden}
                    bind:open={langFormOpen}
                    on:LangAttrAdded
                />
            {/if}
        </div>
    {/if}
</span>

<style lang="scss">
    :global(.svelte-inlinetoolbar) {
        button[disabled] {
            pointer-events: none;
        }
    }
    span {
        --color: #e3e3fe;
        position: absolute;
        box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.1),
            0 8px 16px -16px rgba(0, 0, 0, 0.32);
        transform: translate(-50%, 100%);
        background: var(--color);
        z-index: 3;
        max-height: 2.5rem;
        &.minwidth {
            min-width: 22rem;
        }
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
    .elements-disabled {
        cursor: not-allowed;
    }
    .fr-grid-row button {
        min-width: 2.5rem;
        min-height: 2.5rem;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000091;
        &:hover {
            background: #b9b9fb;
        }
    }
    .isActive,
    button:focus {
        background: #9393f8 !important;
    }
    .form-opened {
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
        display: none;
    }
    .heading sub {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
        bottom: -0.25em;
    }
</style>
