<svelte:options accessors/>
<script>
    import Input from './svelte_base_components/Input.svelte'
    export let data
    let quoteInputIsValid
    let authorInputIsValid

    $: data.isValid = quoteInputIsValid && authorInputIsValid

    const quoteInput = {
        required: true,
        placeholder: "*Texte de la citation",
        minlength: 10,
        maxlength: 30,
        inlineToolbarOptions: ['insertOrderedList','insertUnorderedList', 'createLink']
    };

    const authorInput = {
        required: true,
        placeholder: "Auteur",
        classes: "fr-text",
        nowrap:true,
        inlineToolbarOptions: ['fontSize', 'bold', 'italic']
    };
</script>

<figure class="fr-quote">
    <blockquote cite="[À MODIFIER - https://lien-vers-la-source.fr]">
        <Input {...quoteInput} bind:value={data.quote} bind:isValid={quoteInputIsValid}/>
    </blockquote>
    <figcaption>
        <Input {...authorInput} bind:value={data.author} bind:isValid={authorInputIsValid}/>
        <ul class="fr-quote__source">
            <li>
                <cite>Ouvrage</cite>
            </li>
            <li>Détail 1</li>
            <li>Détail 2</li>
            <li>Détail 3</li>
            <li>
                <a target="_blank" href="[À MODIFIER - Lien vers la sources ou des infos complémentaires]">Détail 4</a>
            </li>
        </ul>
    </figcaption>
</figure>


