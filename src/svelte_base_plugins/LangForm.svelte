<script>
    import {tick, createEventDispatcher, onDestroy} from 'svelte';
    import {langValidator} from './validators.js';

    export let open = false;
    export let toolbarHidden;
    export let langAttr;
    let input;
    let inputContent = '';
    let inputIsValid;
    let errorMsg;
    let trueSelection;

    const dispatch = createEventDispatcher();

    onDestroy(() => {
        open = false;
        if (trueSelection) {
            restoreSelection();
            setCaretToEndofSel();
        }
    });

    function saveCurrentSelections() {
        /*
         Sets a background color on the selection, because that selection will be lost once the LangForm input will get
         the focus (and the user should always sees what he is editing)
         */
        const selection = document.getSelection();
        trueSelection =
            selection.rangeCount === 0 ? null : selection.getRangeAt(0);
    }

    function restoreSelection() {
        const selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(trueSelection);
        // Removes the fake selection background added in formInit()
        document.execCommand('removeFormat');
    }

    function formInit() {
        const langNode = getLangNode() || false;
        if (langNode) {
            selectWholeLang(langNode);
            langAttr = langNode.getAttribute('lang');
            inputContent = langAttr;
        }
        document.execCommand('hiliteColor', false, '#d4ecff');
        const selection = document.getSelection();
        trueSelection =
            selection.rangeCount === 0 ? null : selection.getRangeAt(0);
        inputIsValid = true;
    }

    export async function toggleLangForm() {
        open = !open;
        if (open) {
            saveCurrentSelections();
            formInit();
            // Updates the DOM instantly
            await tick();
            input.focus();
            input.select();
        } else {
            restoreSelection();
        }
    }

    function hideToolbar() {
        if (open) {
            toolbarHidden = true;
        }
    }

    function getFirefoxBadSelection() {
        /*
         Helps with some edges cases seen on firefox. E.g. double click to select.
         */
        const a = trueSelection.startContainer.nextSibling;
        const b = trueSelection.endContainer.previousSibling;
        let badSelection = false;
        if (
            a &&
            b &&
            a.isSameNode(b) &&
            a.childNodes.length === 1 &&
            a.firstChild.tagName === 'DIV' &&
            a.firstChild.hasAttribute("lang")
        ) {
            badSelection = a.firstChild;
        }
        return badSelection;
    }

    function getLangNode() {
        let nodes = [
            trueSelection.startContainer,
            trueSelection.endContainer,
            trueSelection.startContainer.parentNode,
            trueSelection.endContainer.parentNode,
        ];
        return (
            getFirefoxBadSelection() ||
            nodes.find((node) => node.tagName === 'DIV' && node.hasAttribute("lang"))
        );
    }

    function createLang() {
        errorMsg = langValidator(inputContent);
        inputIsValid = errorMsg === true;
        if (inputIsValid) {
            // Creates the div element
            const langNode = document.createElement('div');
            langNode.textContent = trueSelection.toString();
            langNode.setAttribute('lang', inputContent);

            // Restores the selection & removes any div it may contains
            restoreSelection();
            removeLang();

            // Retrieve the current range, replace its contents with the div element
            const range = document.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(langNode);
            trueSelection.selectNode(langNode);
            dispatch('LangAttrAdded');
        }
    }

    function hasEnterBeenPressed(e) {
        if (e.code.toLowerCase() === 'enter') {
            createLang();
            e.preventDefault();
        }
    }

    function selectWholeLang(langNode) {
        /*
         Only a small part of the hyperlang text may have been selected. This extends the selection to include the
         whole element
         */
        const newRange = document.createRange();
        newRange.selectNode(langNode);
        const compareStarts = newRange.compareBoundaryPoints(
            Range.START_TO_START,
            trueSelection
        );
        const compareEnds = newRange.compareBoundaryPoints(
            Range.END_TO_END,
            trueSelection
        );
        if (compareStarts <= 0 && compareEnds >= 0) {
            trueSelection.selectNode(langNode);
        } else if (compareStarts === -1) {
            trueSelection.setStartBefore(langNode);
        } else {
            trueSelection.setEndAfter(langNode);
        }
    }

    function removeLang() {
        /*
        Simplest might be to retrieve the parent contenteditable, get all the div that have a lang attribute, and then isolate
        the right one with Selection.containsNode() ?
         */
        const textNode = document.createTextNode(trueSelection.toString());
        const range = document.getSelection().getRangeAt(0);
        const wrapper = document.getSelection().anchorNode.parentElement;

        if (wrapper.tagName === 'DIV' && wrapper.hasAttribute("lang")) wrapper.remove();

        range.deleteContents();
        range.insertNode(textNode);
        trueSelection.selectNode(textNode);
    }

    function deleteLang() {
        restoreSelection();
        removeLang();
        hideToolbar();
    }

    function setCaretToEndofSel() {
        // Moves the cursor to the end of the current selection.
        const selection = document.getSelection();
        if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
</script>

<div class="langform" class:open>
    <p class="fr-text--xs">Champ obligatoire</p>
    <label class="fr-label" for="text-input-text"
        >Référence du code de langage</label
    >
    <span class="fr-hint-text">2 caractères alphabétiques</span>
    <input
        class="fr-input"
        type="text"
        placeholder="en"
        id="text-input-text"
        autocomplete="off"
        name="text-input-text"
        class:fr-input--error={!inputIsValid}
        bind:value={inputContent}
        bind:this={input}
        on:blur={hideToolbar}
        on:keydown={hasEnterBeenPressed}
    />
    <p class="text-desc-error" class:fr-error-text={!inputIsValid}>
        {errorMsg}
    </p>
    <div class="fr-grid-row fr-mt-2w">
        {#if langAttr}
            <button
                class="fr-btn fr-btn--secondary fr-col fr-mr-2w"
                type="button"
                on:click={deleteLang}
                >Supprimer
            </button>
        {/if}
        <button class="fr-btn fr-col" type="button" on:click={createLang}
            >Sauvegarder
        </button>
    </div>
</div>

<style lang="scss">
    .langform {
        display: none;
        flex-direction: column;
        background-color: #f5f5ff;
        padding: 1rem 1.5rem 1.5rem;
        box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.1),
            0 8px 16px -16px rgba(0, 0, 0, 0.32);

        &.open {
            display: flex;
        }

        .fr-grid-row {
            flex-wrap: nowrap;
        }

        .text-desc-error {
            display: none;
        }

        .fr-error-text {
            display: flex;
            font-size: 0.75rem;
            line-height: 1.25rem;
            margin-top: 1rem;
            margin-bottom: 0;
            font-weight: normal;
        }

        p:first-child {
            font-weight: normal;

            &:before {
                content: '*';
                color: #d80600;
                margin-right: 0.25rem;
            }
        }

        .fr-input {
            background-color: var(--background-default-grey);
        }

        .fr-btn {
            justify-content: center;
        }

        .fr-btn--secondary {
            color: #ce0500;
            box-shadow: inset 0 0 0 1px #ce0500;
        }

        .fr-label {
            font-size: 14px;
            font-weight: normal;

            &:after {
                content: '*';
                color: #d80600;
                margin-left: 0.25rem;
            }
        }
    }
</style>
