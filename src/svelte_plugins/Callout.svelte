<svelte:options accessors />

<script>
  import { v4 as uuidv4 } from "uuid";
  import Input from "../svelte_base_plugins/Input.svelte";
  import Option from "../svelte_base_plugins/Option.svelte";
  export let data;

  const uuid = uuidv4();
  const defaultPlaceholder = "Cliquez pour modifier";

  let titleInputIsValid,
    textInputIsValid,
    textLinkInputIsValid,
    linkInputIsValid,
    option;
  let addButtonValue = !!data.link ? "Yes" : "No";
  let hideOptions = false;

  let choices = [
    { value: "Yes", label: "Oui" },
    { value: "No", label: "Non" },
  ];

  $: data.isValid =
    titleInputIsValid &&
    textInputIsValid &&
    (addButtonValue && addButtonValue === "Yes"
      ? textLinkInputIsValid && linkInputIsValid
      : true);

  const titlePlaceholder = {
    classes: "fr-text fr-text--xl",
    placeholder: defaultPlaceholder,
  };
  const titleInput = {
    required: true,
    classes: "fr-input",
  };

  const textPlaceholder = {
    placeholder: defaultPlaceholder,
    classes: "fr-text fr-text--lg",
  };
  const textInput = {
    required: true,
    classes: "fr-input",
  };

  const textLinkPlaceholder = {
    placeholder: defaultPlaceholder,
    classes: "fr-btn--placeholder fr-mb-0",
  };
  const textLinkInput = {
    required: true,
    classes: "fr-input",
  };

  const linkInput = {
    required: true,
    url: true,
    placeholder: "www.gouvernement.fr",
    classes: "fr-input",
  };

  function handleChange(event) {
    if (event.currentTarget.value === "No") {
      delete data["textlink"];
      delete data["link"];
      delete data["openWindow"];
      delete data["type"];
      textLinkInputIsValid = true;
      linkInputIsValid = true;
    } else {
      data.openWindow = data.openWindow || "No";
      data.type = "Primary Button";
    }
  }

  function closeOptions(e) {
    e.preventDefault();
    hideOptions = true;
  }

  function openOptions(e) {
    if (hideOptions) hideOptions = false;
  }
</script>

<div class="fr-callout" on:click={option.show}>
  <h3 class="fr-callout__title">
    <Input {...titlePlaceholder} bind:text={data.subtitle} />
  </h3>
  <p class="fr-callout__text">
    <Input {...textPlaceholder} bind:text={data.text} />
  </p>
  {#if addButtonValue === "Yes"}
    <a
      class="fr-btn"
      class:fr-btn--external={data.openWindow === "Yes"}
      href={data.link}
      on:click|preventDefault
    >
      <Input {...textLinkPlaceholder} bind:text={data.textlink} />
    </a>
  {/if}
</div>

<Option bind:this={option}>
  <div class="fr-input-group">
    <label class="fr-label" for="callout-title-{uuid}">Texte du titre*</label>
    <Input
      id="callout-title-{uuid}"
      {...titleInput}
      bind:text={data.subtitle}
      bind:isValid={titleInputIsValid}
    />
  </div>
  <div class="fr-input-group">
    <label class="fr-label" for="callout-text-{uuid}">Texte du corps*</label>
    <Input
      id="callout-text-{uuid}"
      {...textInput}
      bind:text={data.text}
      bind:isValid={textInputIsValid}
    />
  </div>
  <div class="fr-form-group">
    <fieldset class="fr-fieldset fr-fieldset--inline">
      <legend class="fr-fieldset__legend fr-text--regular">
        Ajouter un bouton ?
      </legend>
      <div class="fr-fieldset__content">
        {#each choices as { value, label }}
          <div class="fr-radio-group">
            <input
              type="radio"
              id="callout-add-btn-{value}-{uuid}"
              name="callout-add-btn-{uuid}"
              on:change={handleChange}
              bind:group={addButtonValue}
              {value}
            />
            <label class="fr-label" for="callout-add-btn-{value}-{uuid}"
              >{label}</label
            >
          </div>
        {/each}
      </div>
    </fieldset>
  </div>
  {#if addButtonValue === "Yes"}
    <div class="fr-input-group">
      <label class="fr-label" for="callout-textlink-{uuid}"
        >Texte du bouton*</label
      >
      <Input
        id="callout-textlink-{uuid}"
        {...textLinkInput}
        bind:text={data.textlink}
        bind:isValid={textLinkInputIsValid}
      />
    </div>
    <div class="fr-input-group">
      <label class="fr-label" for="callout-link-{uuid}"
        >Lien de la mise en avant*</label
      >
      <div class="fr-input-group--inline">
        <p>https://</p>
        <Input
          id="callout-link-{uuid}"
          {...linkInput}
          bind:text={data.link}
          bind:isValid={linkInputIsValid}
        />
      </div>
    </div>
    <div class="fr-form-group">
      <fieldset class="fr-fieldset fr-fieldset--inline">
        <legend class="fr-fieldset__legend fr-text--regular">
          Ouverture nouvelle fenêtre :
        </legend>
        <div class="fr-fieldset__content">
          {#each choices as { value, label }}
            <div class="fr-radio-group">
              <input
                type="radio"
                id="callout-target-btn-{value}-{uuid}"
                name="callout-target-btn-{uuid}"
                bind:group={data.openWindow}
                {value}
              />
              <label class="fr-label" for="callout-target-btn-{value}-{uuid}"
                >{label}</label
              >
            </div>
          {/each}
        </div>
      </fieldset>
    </div>
  {/if}
</Option>

<style lang="scss">
  .fr-callout {
    cursor: pointer;
  }

  legend {
    border: 0;
  }

  .fr-input-group--inline {
    display: flex;

    p {
      margin-top: 0.5rem;
    }
  }

  :global(.fr-btn--placeholder:before) {
    color: #fff !important;
  }

  .fr-btn--external::after {
    content: "";
    font-family: icons !important;
    margin-left: 10px;
  }
</style>
