<svelte:options accessors />

<script>
  import Input from "../svelte_base_plugins/Input.svelte";
  import Div from "../svelte_base_plugins/BasicMarkup.svelte";
  import Option from "../svelte_base_plugins/Option.svelte";
  export let data;
  export let user;
  let codeInputIsValid;
  let option;
  $: data.isValid = codeInputIsValid;

  const iframeInput = {
    required: true,
    placeholder: "<iframe ...></iframe>",
    iframe: true,
    classes: "fr-input fr-breakWord",
  };

  function handlePasteIframe(event) {
    let paste = (event.clipboardData || window.clipboardData).getData("text");
    const removeExtraSpaces = paste.replace(/\s+/g, " ").trim();
    document.execCommand("insertText", false, removeExtraSpaces);
    event.preventDefault();
    event.stopPropagation();
  }
</script>

<Option bind:this={option} closeButton={false}>
  <div class="fr-input-group">
    {#if user}
      <p class="fr-label fr-text--bold">
        Code iFrame* (éditable avec le profil Administrateur) :
      </p>
      <Div bind:text={data.iframe} bind:isValid={codeInputIsValid} />
    {:else}
      <p class="fr-label fr-text--bold">Renseigner le code iFrame* :</p>
      <Input
        {...iframeInput}
        bind:text={data.iframe}
        bind:isValid={codeInputIsValid}
        on:paste={handlePasteIframe}
      />
    {/if}
  </div>
</Option>

<style>
  :global(.fr-breakWord) {
    word-wrap: break-word;
  }
</style>
