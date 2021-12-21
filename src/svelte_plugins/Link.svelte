<svelte:options accessors />

<script>
  import Input from "../svelte_base_plugins/Input.svelte";
  import Option from "../svelte_base_plugins/Option.svelte";
  import { v4 as uuidv4 } from "uuid";

  export let data;
  let textInputIsValid, linkInputIsValid, option;
  const radioId = uuidv4();
  const textInputId = uuidv4();
  const linkInputId = uuidv4();

  $: {
    data.openWindow = data.openWindow ?? "No";
    data.picto = data.picto ?? "No";
    data.size = data.size ?? "Medium";
    data.isValid = textInputIsValid && linkInputIsValid;
  }

  let newWindowChoices = [
    { value: "Yes", label: "Oui" },
    { value: "No", label: "Non" },
  ];

  let arrowChoices = [
    { value: "No", label: "Non" },
    { value: "left", label: "À gauche" },
    { value: "right", label: "À droite" },
  ];

  let sizeChoices = [
    { value: "Small", label: "Petit" },
    { value: "Medium", label: "Moyen" },
    { value: "Large", label: "Grand" },
  ];

  const textInput = {
    required: true,
    classes: "fr-input",
  };

  const linkInput = {
    required: true,
    url: true,
    placeholder: "https://www.gouvernement.fr",
    classes: "fr-input",
  };

  function handleChange() {
    if (data.openWindow === "Yes" && data.picto !== "No") {
      data.picto = "No";
    }
  }

  function openOptions() {
    if (hideOptions) hideOptions = false;
  }
</script>

<a
  class="fr-link"
  href={data.link}
  class:fr-fi-arrow-right-line={["left", "right"].includes(data.picto)}
  class:fr-link--icon-right={data.picto === "right"}
  class:fr-link--icon-left={data.picto === "left"}
  class:fr-link--sm={data.size === "Small"}
  class:fr-link--lg={data.size === "Large"}
  class:external={data.openWindow === "Yes"}
  on:click|preventDefault={option.show}
  >{data.text || "Cliquez pour modifier"}
</a>
<Option bind:this={option}>
  <div class="fr-input-group">
    <label class="fr-label" for="textinput-{textInputId}">Texte du lien*</label>
    <Input
      {...textInput}
      id={textInputId}
      bind:text={data.text}
      bind:isValid={textInputIsValid}
    />
  </div>
  <div class="fr-input-group">
    <label class="fr-label" for="linkinput-{textInputId}"
      >Lien de redirection*</label
    >
    <Input
      {...linkInput}
      id={linkInputId}
      bind:text={data.link}
      bind:isValid={linkInputIsValid}
    />
  </div>
  <div class="fr-form-group">
    <fieldset class="fr-fieldset fr-fieldset--inline">
      <legend class="fr-fieldset__legend fr-text--regular">
        Ouvrir dans une nouvelle fenêtre :
      </legend>
      <div class="fr-fieldset__content">
        {#each newWindowChoices as { value, label }}
          <div class="fr-radio-group">
            <input
              type="radio"
              id="radio-window-{value}-{radioId}"
              bind:group={data.openWindow}
              name="newWindow-{radioId}"
              on:change={handleChange}
              {value}
            />
            <label class="fr-label" for="radio-window-{value}-{radioId}"
              >{label}
            </label>
          </div>
        {/each}
      </div>
    </fieldset>
  </div>
  {#if data.openWindow === "No"}
    <div class="fr-form-group">
      <fieldset class="fr-fieldset fr-fieldset--inline">
        <legend class="fr-fieldset__legend fr-text--regular">
          Ajouter une flèche :
        </legend>
        <div class="fr-fieldset__content">
          {#each arrowChoices as { value, label }}
            <div class="fr-radio-group">
              <input
                type="radio"
                id="radio-arrow-{value}-{radioId}"
                bind:group={data.picto}
                name="arrow-{radioId}"
                {value}
              />
              <label class="fr-label" for="radio-arrow-{value}-{radioId}"
                >{label}
              </label>
            </div>
          {/each}
        </div>
      </fieldset>
    </div>
  {/if}
  <div class="fr-form-group">
    <fieldset class="fr-fieldset fr-fieldset--inline">
      <legend class="fr-fieldset__legend fr-text--regular">
        Taille du lien :
      </legend>
      <div class="fr-fieldset__content">
        {#each sizeChoices as { value, label }}
          <div class="fr-radio-group">
            <input
              type="radio"
              id="radio-size-{value}-{radioId}"
              bind:group={data.size}
              name="size-{radioId}"
              {value}
            />
            <label class="fr-label" for="radio-size-{value}-{radioId}"
              >{label}
            </label>
          </div>
        {/each}
      </div>
    </fieldset>
  </div>
</Option>

<style>
  .external::after {
    font-size: inherit;
    content: "";
    margin-left: 0.5rem;
    vertical-align: baseline;
  }

  legend {
    border: 0;
  }
</style>
