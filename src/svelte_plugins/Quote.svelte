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
    <p>
      <Input {...authorInput} bind:text={data.author} />
    </p>
    <p>
      <Input
        {...metadataInput}
        bind:html={data.metadata.html}
        bind:text={data.metadata.text}
      />
    </p>
  </figcaption>
</figure>

<style lang="scss">
  blockquote {
    font-size: 1.375rem;
    line-height: 2.25rem;
    font-weight: bold;
  }
  figcaption {
    margin-top: 15px;
    p:first-child {
      font-weight: bold;
    }
  }
</style>
