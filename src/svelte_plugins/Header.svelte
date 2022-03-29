<svelte:options accessors />

<script>
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import Input from "../svelte_base_plugins/Input.svelte";
  export let data;
  let headerInputIsValid;

  let level = writable(data.level ?? "2");
  setContext("headerLvl", level);
  let anchor = writable(data.anchor ?? "");
  setContext("anchor", anchor);

  $: level.set(data.level);
  $: data.level = $level;
  $: data.isValid = headerInputIsValid;
  $: data.anchor = $anchor;

  const headerInput = {
    required: true,
    placeholder: "*Insérer un titre",
    inlineToolbarOptions: ["fr-h2", "fr-h3", "fr-h4", "anchor"],
  };
</script>

{#if $anchor}
  <p class="fr-badge fr-badge--info">ÉLÉMENT ANCRÉ</p>
{/if}
<Input
  {...headerInput}
  classes="fr-mb-0 fr-h{$level}"
  bind:text={data.text}
  bind:isValid={headerInputIsValid}
/>
