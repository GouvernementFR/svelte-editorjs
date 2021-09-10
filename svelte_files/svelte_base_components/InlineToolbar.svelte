<svelte:options accessors/>
<script>
    import {tick} from 'svelte';

    export let top
    export let left
    export let hidden = true
    export let inlineToolbarOptions
    export let formats = {}


    function setFormat(command) {
        document.execCommand(command);
        formats[command] = document.queryCommandState(command)
    }


    function normalize(ele) {
        // todo
    }


    async function setFontSize() {
        // todo
    }


</script>

<span class="fr-mt-1w" class:hidden style="top: {top}px; left: {left}px;" on:blur>
    <div class="fr-grid-row">
        {#if inlineToolbarOptions.includes("fontSize")}
        <button type="button" on:click={() => setFontSize()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M11.246 15H4.754l-2 5H.6L7 4h2l6.4 16h-2.154l-2-5zm-.8-2L8 6.885 5.554 13h4.892zM21 12.535V12h2v8h-2v-.535a4 4 0 1 1 0-6.93zM19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("bold")}
        <button type="button" on:click={() => setFormat("bold")} class:isActive={formats.bold}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("italic")}
        <button type="button" on:click={() => setFormat("italic")} class:isActive={formats.italic}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("insertOrderedList")}
        <button type="button" on:click={() => setFormat("insertOrderedList")}
                class:isActive={formats.insertOrderedList}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("insertUnorderedList")}
        <button type="button" on:click={() => setFormat("insertUnorderedList")}
                class:isActive={formats.insertUnorderedList}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
        {#if inlineToolbarOptions.includes("createLink")}
        <button type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path fill="none"
                                                                                                     d="M0 0h24v24H0z"/><path
                    d="M17.657 14.828l-1.414-1.414L17.657 12A4 4 0 1 0 12 6.343l-1.414 1.414-1.414-1.414 1.414-1.414a6 6 0 0 1 8.485 8.485l-1.414 1.414zm-2.829 2.829l-1.414 1.414a6 6 0 1 1-8.485-8.485l1.414-1.414 1.414 1.414L6.343 12A4 4 0 1 0 12 17.657l1.414-1.414 1.414 1.414zm0-9.9l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
                    fill="rgba(0,0,145,1)"/></svg>
        </button>
        {/if}
    </div>
</span>

<style>

    span {
        --color: #e3e3fe;
        position: absolute;
        box-shadow: 0 2px 8px 2px rgba(22, 22, 22, 0.08),
        0 2px 8px -4px rgba(22, 22, 22, 0.08);
        transform: translate(-50%, 100%);
        background: var(--color);
        z-index: 1;
    }

    span:before {
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

    button {
        width: 2rem;
        height: 2rem;
        background-color: transparent;
    }

    button:hover {
        background: #b9b9fb;
    }


    .isActive, button:focus {
        background: #9393f8;
    }

    .hidden {
        display: none
    }
</style>
