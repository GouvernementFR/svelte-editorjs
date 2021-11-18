<svelte:options accessors/>
<script>
    import Input from './svelte_base_components/Input.svelte'
    export let data

    let headerInputIsValid

    $: data.isValid = headerInputIsValid

    const headerInput = {
        required: true,
        placeholder: "*Insérer un titre",
        classes: "fr-h3",
        inlineToolbarOptions: ["fr-h2","fr-h3","fr-h4"]
    };

</script>

<Input {...headerInput} bind:value={data.header} bind:isValid={headerInputIsValid}/>
