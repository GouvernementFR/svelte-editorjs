<svelte:options accessors />

<script>
  import { v4 as uuidv4 } from "uuid";
  import Input from "../svelte_base_plugins/Input.svelte";
  import Option from "../svelte_base_plugins/Option.svelte";
  export let data;

  const uuid = uuidv4();

  let option;

  $: data.accordions = data.accordions ?? [
    {
      title: "",
      titleInputIsValid: true,
      textInputIsValid: true,
      content: { text: "", html: "" },
    },
  ];

  $: for (const accordion of data.accordions) {
    data.isValid = accordion.titleInputIsValid && accordion.textInputIsValid;
    if (!data.isValid) break;
  }

  const titlePlaceholder = "Un titre";
  const titleInputConfig = {
    required: true,
    placeholder: titlePlaceholder,
    classes: "fr-input",
  };

  const textPlaceholder = "Un contenu";
  const textPlaceholderConfig = {
    placeholder: textPlaceholder,
    classes: "svelte-input__not-writable",
  };
  const textInputConfig = {
    required: true,
    placeholder: textPlaceholder,
    classes: "fr-input",
    allowPaste: false,
    inlineToolbarOptions: [
      "insertOrderedList",
      "insertUnorderedList",
      "italic",
      "bold",
      "createLink",
    ],
  };

  function addAccordion() {
    data.accordions = data.accordions.concat({
      title: "",
      titleInputIsValid: true,
      textInputIsValid: true,
      content: { text: "", html: "" },
    });
  }

  function deleteAccordion(index) {
    data.accordions = data.accordions.filter((_element, i) => i !== index);
  }
</script>

<ul class="fr-accordions-group" on:click={option.show}>
  {#each data.accordions as { title, content }, i}
    <li>
      <section class="fr-accordion">
        <h3 class="fr-accordion__title">
          <button
            class="fr-accordion__btn"
            aria-expanded="false"
            aria-controls="accordion-{uuid}-{i}"
          >
            {#if title}
              {title}
            {:else}
              <span class="fr-accordion__placeholder">{titlePlaceholder}</span>
            {/if}
          </button>
        </h3>
        <div class="fr-collapse" id="accordion-{uuid}-{i}">
          <Input {...textPlaceholderConfig} bind:html={content.html} />
        </div>
      </section>
    </li>
  {/each}
</ul>

<Option bind:this={option}>
  {#each data.accordions as { title, content, titleInputIsValid, textInputIsValid }, i}
    <div class="fr-mb-4w">
      {#if data.accordions.length > 1}
        <legend>
          <button
            type="button"
            class="fr-link--close fr-link"
            on:click={() => deleteAccordion(i)}>Accordéon {i + 1}</button
          >
        </legend>
      {/if}
      <div class="fr-input-group">
        <label class="fr-label" for="accordion-title-{uuid}"
          >Texte du titre*</label
        >
        <Input
          id="accordion-title-{uuid}"
          {...titleInputConfig}
          bind:text={title}
          bind:isValid={titleInputIsValid}
        />
      </div>
      <div class="fr-input-group">
        <label class="fr-label" for="accordion-text-{uuid}"
          >Texte du contenu*</label
        >
        <Input
          id="accordion-text-{uuid}"
          {...textInputConfig}
          bind:html={content.html}
          bind:text={content.text}
          bind:isValid={textInputIsValid}
        />
      </div>
    </div>
  {/each}
  <div class="fr-input-group">
    <button
      type="button"
      class="fr-btn fr-btn--secondary fr-btn--sm fr-mt-2w fr-fi-add-line fr-btn--icon-left"
      on:click={addAccordion}>Ajouter un accordéon</button
    >
  </div>
</Option>

<style lang="scss">
  h3 {
    padding-bottom: 0 !important;
  }
  legend {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  .fr-link--close {
    margin-right: inherit;
    margin-left: -0.5rem;
    margin-bottom: 0.25rem;
  }
  .fr-accordion__placeholder {
    pointer-events: none;
    opacity: 0.6;

    &:focus {
      outline: none !important;
    }
  }
</style>
