<svelte:options accessors />

<script>
  import { v4 as uuidv4 } from "uuid";
  import Input from "../svelte_base_plugins/Input.svelte";
  import Option from "../svelte_base_plugins/Option.svelte";

  export let data;
  const uuid = uuidv4();
  data.size = data.size ?? "Medium";
  let highlightInputIsValid;
  let option;

  let sizeChoices = [
    { value: "Small", label: "Petit", size: "sm" },
    { value: "Medium", label: "Moyen", size: "md" },
    { value: "Large", label: "Grand", size: "lg" },
  ];

  $: data.isValid = highlightInputIsValid;

  $: sizeClass = `fr-text fr-text--${
    sizeChoices.find((e) => e.value === data.size).size
  }`;

  const highlightInput = {
    required: true,
    placeholder: "",
    nowrap: true,
    classes: "fr-input",
  };
</script>

<div class="fr-highlight" on:click={option.show}>
  <p class={sizeClass}>
    <Input
      placeholder="Cliquez pour modifier"
      bind:text={data.text}
      classes={sizeClass}
    />
  </p>
</div>
<Option bind:this={option}>
  <div class="fr-input-group">
    <label class="fr-label" for="highlight-text-{uuid}"
      >Texte de l'exergue* :</label
    >
    <Input
      id="highlight-text-{uuid}"
      {...highlightInput}
      bind:text={data.text}
      bind:isValid={highlightInputIsValid}
    />
  </div>
  <div class="fr-form-group">
    <fieldset class="fr-fieldset fr-fieldset--inline">
      <legend class="fr-fieldset__legend fr-text--regular">
        Taille du texte :
      </legend>
      <div class="fr-fieldset__content">
        {#each sizeChoices as { value, label }}
          <div class="fr-radio-group">
            <input
              type="radio"
              id="highlight-size-{value}-{uuid}"
              name="highlight-size-{uuid}"
              bind:group={data.size}
              {value}
            />
            <label class="fr-label" for="highlight-size-{value}-{uuid}"
              >{label}</label
            >
          </div>
        {/each}
      </div>
    </fieldset>
  </div>
</Option>

<style>
  .fr-highlight {
    cursor: pointer;
  }

  legend {
    border: 0;
  }
</style>
