<svelte:options accessors />

<script>
    import {setContext} from 'svelte';
    import {writable} from 'svelte/store';
    import Input from '../svelte_base_plugins/Input.svelte';
    export let data;

    let anchor = writable(data.anchor ?? '');
    setContext('anchor', anchor);

    $: data.anchor = $anchor;

    const paragraphConfig = {
        allowPaste: true,
        inlineToolbarOptions: [
            'insertOrderedList',
            'insertUnorderedList',
            'italic',
            'bold',
            'createLink',
            'anchor',
            'createLang',
        ],
    };
</script>

{#if $anchor}
    <p class="fr-badge fr-badge--info">ÉLÉMENT ANCRÉ</p>
{/if}
<Input {...paragraphConfig} bind:html={data.text} />
