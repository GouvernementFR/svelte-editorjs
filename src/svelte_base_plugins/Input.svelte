<script>
    import InlineToolbar from './InlineToolbar.svelte';
    import {inlineToolbarActions} from './InlineToolbarActions';
    import {
        urlValidator,
        requiredValidator,
        minLengthValidator,
        maxLengthValidator,
        iframeValidator,
    } from './validators.js';
    import {
        isWordDocument,
        sanitizeWordDocument,
        isHtml,
        sanitizeHtml,
        insertHtml,
    } from './paste-utilities';

    export let text;
    export let html;
    export let placeholder = null;
    export let required;
    export let minlength;
    export let maxlength;
    export let url;
    export let iframe;
    export let classes;
    export let inlineToolbarOptions = false;
    export let isValid = true;
    export let nowrap = false;
    export let contenteditable;
    export let allowPaste = false;
    let inlineToolbar;
    let validityState;

    $: attributes = [
        {attr: required, validator: requiredValidator},
        {attr: minlength, validator: minLengthValidator},
        {attr: maxlength, validator: maxLengthValidator},
        {attr: url, validator: urlValidator},
        {attr: iframe, validator: iframeValidator},
    ];

    function checkValidity() {
        if (url) {
            formatUrl(text);
        }
        for (const obj of attributes) {
            if (obj.attr) {
                const check = obj.validator(text, obj.attr);
                if (check !== true) {
                    isValid = false;
                    validityState = check;
                    return;
                }
            }
        }
        isValid = true;
    }

    function conditionalAction(node, params) {
        if (inlineToolbarOptions) {
            return inlineToolbarActions(node, params);
        }
    }

    function formatUrl(link) {
        if (!link.startsWith('https://') && !link.startsWith('http://')) {
            text = 'https://' + text;
        }
    }

    function handlePaste(event) {
        const clipboardData = event.clipboardData || window.clipboardData;
        const string = clipboardData.getData('text/html');
        const parser = new DOMParser();
        const doc = parser.parseFromString(string, 'text/html');
        if (!allowPaste) {
            event.stopPropagation();
            event.preventDefault();
            if (isHtml(doc.documentElement)) {
                const html = sanitizeHtml(doc);
                insertHtml(html);
                triggerUpdate();
            } else {
                document.execCommand(
                    'insertText',
                    false,
                    clipboardData.getData('text/plain')
                );
                triggerUpdate();
            }
        } else if (isWordDocument(doc)) {
            const successfulSanitization = sanitizeWordDocument(doc);
            if (successfulSanitization) {
                event.preventDefault();
                event.stopPropagation();
                triggerUpdate();
            }
        }
    }

    function triggerUpdate() {
        html = contenteditable.innerHTML;
        text = contenteditable.textContent;
    }

    function onKeyUp(e) {
        // Resets innerHtml when there is no textContent. Needed for some browsers.
        if (e.code !== 'Backspace' && e.code !== 'Delete') {
            return;
        }
        if (text === '') {
            html = '';
        }
    }
</script>

<svelte:window on:submit|capture={checkValidity} />

<div class="svelte-input" on:paste={handlePaste}>
    <div
        contenteditable="true"
        {placeholder}
        bind:textContent={text}
        bind:innerHTML={html}
        class={classes}
        class:invalid={!isValid}
        class:nowrap
        use:conditionalAction={inlineToolbar}
        bind:this={contenteditable}
        on:keyup={onKeyUp}
    />
    {#if inlineToolbarOptions}
        <InlineToolbar
            {inlineToolbarOptions}
            bind:this={inlineToolbar}
            on:ExternalLinkAdded={triggerUpdate}
            on:LangAttrAdded={triggerUpdate}
        />
    {/if}
    {#if !isValid}
        <span class="fr-error-text fr-text--xs">
            {validityState}
        </span>
    {/if}
</div>

<style lang="scss">
    :global(.svelte-input a) {
        text-decoration: none;
        cursor: inherit;
        box-shadow: var(--link-underline);
        color: inherit;
    }

    .svelte-input {
        position: relative;
        flex-basis: 100%;

        div {
            max-height: inherit !important;

            &:focus:not(.no-focus) {
                outline-offset: 2px !important;
                outline-width: 2px !important;
                outline-color: #0a76f6 !important;
                outline-style: solid !important;
            }
        }

        .fr-input {
            background-color: var(--background-default-grey) !important;
        }
    }

    [contenteditable] {
        outline-width: 1px !important;
        outline-offset: 0;

        &:empty:before {
            content: attr(placeholder);
            color: #6a6a6a;
        }
    }

    .validation-hint {
        color: var(--text-default-error);
        padding: 6px 0;
    }

    .invalid {
        outline-color: var(--border-plain-error) !important;
        outline-style: solid !important;
    }

    .nowrap {
        white-space: nowrap;
        overflow: hidden;
    }

    .svelte-input__not-writable {
        pointer-events: none;

        &:focus {
            outline: none !important;
        }
    }

    :global(span[lang]) {
        border-bottom: 2px dotted #000091;
        text-decoration: none;
    }
</style>
