<svelte:options accessors />

<script>
  import { onMount, setContext } from "svelte";
  import Input from "../svelte_base_plugins/Input.svelte";
  export let data;
  data.level = data.level ?? "3";
  let contenteditable;
  let headerInputIsValid;
  $: data.isValid = headerInputIsValid;

  setContext("headerLvl", data.level);

  onMount(() => {
    const options = {
      childList: false,
      attributes: true,
      characterData: false,
      subtree: false,
      attributeFilter: ["class"],
      attributeOldValue: false,
      characterDataOldValue: false,
    };

    let observer = new MutationObserver(() => {
      contenteditable.classList.forEach((cl) => {
        if (["fr-h2", "fr-h3", "fr-h4"].includes(cl)) {
          data.level = cl.slice(-1);
        }
      });
    });
    observer.observe(contenteditable, options);
  });

  const headerInput = {
    required: true,
    placeholder: "*Insérer un titre",
    inlineToolbarOptions: ["fr-h2", "fr-h3", "fr-h4"],
  };
</script>

<Input
  {...headerInput}
  classes="fr-h{data.level}"
  bind:text={data.text}
  bind:isValid={headerInputIsValid}
  bind:contenteditable
/>
