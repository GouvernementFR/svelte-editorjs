<svelte:options accessors />

<script>
  import { v4 as uuidv4 } from "uuid";
  import Input from "../svelte_base_plugins/Input.svelte";
  import Option from "../svelte_base_plugins/Option.svelte";

  export let data;
  data.openWindow = data.openWindow ?? "No";
  data.type = data.type ?? "Primary Button";
  data.size = data.size ?? "Medium";

  const uuid = uuidv4();

  let textInputIsValid, linkInputIsValid, option;

  let openWindowChoices = [
    { value: "Yes", label: "Oui" },
    { value: "No", label: "Non" },
  ];

  let typeChoices = [
    { value: "Primary Button", label: "Bouton principal" },
    { value: "Secondary Button", label: "Bouton secondaire" },
  ];

  let sizeChoices = [
    { value: "Small", label: "Petit", suff: "sm" },
    { value: "Medium", label: "Moyen", suff: "md" },
    { value: "Large", label: "Grand", suff: "lg" },
  ];

  $: data.isValid = textInputIsValid && linkInputIsValid;

  $: btnClasses = `fr-btn fr-btn--${
    sizeChoices.find((e) => e.value === data.size).suff
  }`;

  const textPlaceholder = {
    placeholder: "Cliquez pour modifier",
    classes: "fr-btn--placeholder fr-mb-0",
  };
  const textInput = {
    required: true,
    classes: "fr-input",
  };

  const linkInput = {
    required: true,
    url: true,
    placeholder: "www.gouvernement.fr",
    classes: "fr-input",
  };

  function handleClick(e) {
    e.preventDefault();
    option.show(e);
  }
</script>

<a
  class={btnClasses}
  class:fr-fi-external-link-line={data.openWindow === "Yes"}
  class:fr-btn--icon-right={data.openWindow === "Yes"}
  class:fr-btn--secondary={data.type === "Secondary Button"}
  href={data.link}
  on:click={handleClick}
>
  <Input {...textPlaceholder} bind:text={data.text} />
</a>
<Option bind:this={option}>
  <div class="fr-input-group">
    <label class="fr-label" for="btn-text-{uuid}">Texte du bouton*</label>
    <Input
      id="btn-text-{uuid}"
      {...textInput}
      bind:text={data.text}
      bind:isValid={textInputIsValid}
    />
  </div>
  <div class="fr-input-group">
    <label class="fr-label" for="btn-link-{uuid}"
      >Lien de la mise en avant*</label
    >
    <div class="fr-input-group--inline">
      <p>https://</p>
      <Input
        id="btn-link-{uuid}"
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
        {#each openWindowChoices as { value, label }}
          <div class="fr-radio-group">
            <input
              type="radio"
              id="btn-target-{value}-{uuid}"
              name="btn-target-{uuid}"
              bind:group={data.openWindow}
              {value}
            />
            <label class="fr-label" for="btn-target-{value}-{uuid}"
              >{label}</label
            >
          </div>
        {/each}
      </div>
    </fieldset>
  </div>
  <div class="fr-form-group">
    <fieldset class="fr-fieldset fr-fieldset--inline">
      <legend class="fr-fieldset__legend fr-text--regular">
        Type du bouton :
      </legend>
      <div class="fr-fieldset__content">
        {#each typeChoices as { value, label }}
          <div class="fr-radio-group">
            <input
              type="radio"
              id="btn-type-{value}-{uuid}"
              name="btn-type-{uuid}"
              bind:group={data.type}
              {value}
            />
            <label class="fr-label" for="btn-type-{value}-{uuid}">{label}</label
            >
          </div>
        {/each}
      </div>
    </fieldset>
  </div>
  <div class="fr-form-group">
    <fieldset class="fr-fieldset fr-fieldset--inline">
      <legend class="fr-fieldset__legend fr-text--regular">
        Taille du bouton :
      </legend>
      <div class="fr-fieldset__content">
        {#each sizeChoices as { value, label }}
          <div class="fr-radio-group">
            <input
              type="radio"
              id="btn-size-{value}-{uuid}"
              name="btn-size-{uuid}"
              bind:group={data.size}
              {value}
            />
            <label class="fr-label" for="btn-size-{value}-{uuid}">{label}</label
            >
          </div>
        {/each}
      </div>
    </fieldset>
  </div>
</Option>

<style lang="scss">
  .fr-btn {
    & :global(.fr-btn--placeholder:before) {
      color: #fff !important;
    }

    &--secondary {
      box-shadow: inset 0 0 0 1px var(--border-action-high-blue-france);

      & :global(.fr-btn--placeholder:before) {
        color: var(--text-action-high-blue-france) !important;
      }
    }

    &--sm {
      :global(.fr-btn--placeholder) {
        font-size: 0.875rem;
      }
    }

    &--md {
      :global(.fr-btn--placeholder) {
        font-size: 1rem;
      }
    }

    &--lg {
      :global(.fr-btn--placeholder) {
        font-size: 1.25rem;
      }
    }
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
</style>
