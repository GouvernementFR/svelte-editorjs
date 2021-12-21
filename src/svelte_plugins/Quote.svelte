<svelte:options accessors />

<script>
  import Input from "../svelte_base_plugins/Input.svelte";

  export let data;
  let quoteInputIsValid;

  $: data.isValid = quoteInputIsValid;

  $: data.metadata = data.metadata ?? {};

  const quoteInput = {
    required: true,
    placeholder: "*Citation",
  };

  const authorInput = {
    placeholder: "Auteur",
    classes: "fr-text",
    nowrap: true,
  };

  const metadataInput = {
    placeholder: "Ajouter des informations contextuelles",
    classes: "fr-text fr-text--xs",
    inlineToolbarOptions: ["bold", "italic"],
  };
</script>

<figure class="fr-quote">
  <blockquote>
    <Input
      {...quoteInput}
      bind:text={data.quote}
      bind:isValid={quoteInputIsValid}
    />
  </blockquote>
  <figcaption>
    <Input {...authorInput} bind:text={data.author} />
    <Input
      {...metadataInput}
      bind:html={data.metadata.html}
      bind:text={data.metadata.text}
    />
  </figcaption>
</figure>
