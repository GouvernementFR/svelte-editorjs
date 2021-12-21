<script>
  import InlineToolbar from "./InlineToolbar.svelte";
  import { inlineToolbarActions } from "./InlineToolbarActions";
  import {
    linkValidator,
    requiredValidator,
    minLengthValidator,
    maxLengthValidator,
  } from "./validators.js";

  export let text;
  export let html;
  export let placeholder = null;
  export let required;
  export let minlength;
  export let maxlength;
  export let url;
  export let classes;
  export let inlineToolbarOptions = false;
  export let isValid = true;
  export let nowrap = false;
  export let contenteditable;
  let inlineToolbar;
  let validityState;

  $: attributes = [
    { attr: required, validator: requiredValidator },
    { attr: minlength, validator: minLengthValidator },
    { attr: maxlength, validator: maxLengthValidator },
    { attr: url, validator: linkValidator },
  ];

  function checkValidity() {
    for (const obj of attributes) {
      if (obj.attr) {
        const check = obj.validator(text, obj.attr);
        if (check !== true) {
          isValid = false;
          validityState = check;
          return;
        }
      }
    }
    isValid = true;
  }

  function conditionalAction(node, params) {
    if (inlineToolbarOptions) {
      return inlineToolbarActions(node, params);
    }
  }
</script>

<svelte:window on:submit|capture={checkValidity} />

<div class="svelte-input" on:paste>
  <p
    contenteditable="true"
    {placeholder}
    bind:textContent={text}
    bind:innerHTML={html}
    class={classes}
    class:invalid={!isValid}
    class:nowrap
    use:conditionalAction={inlineToolbar}
    bind:this={contenteditable}
  />
  {#if inlineToolbarOptions}
    <InlineToolbar {inlineToolbarOptions} bind:this={inlineToolbar} />
  {/if}
  {#if !isValid}
    <span class="fr-error-text fr-text--xs">
      {validityState}
    </span>
  {/if}
</div>

<style lang="scss">
  :global(.svelte-input a) {
    text-decoration: none;
    cursor: inherit;
    box-shadow: var(--link-underline);
    color: inherit;
  }

  .svelte-input {
    position: relative;
    flex-basis: 100%;

    p {
      max-height: inherit !important;

      &:focus {
        outline-offset: 2px !important;
        outline-width: 2px !important;
        outline-color: #0a76f6 !important;
        outline-style: solid !important;
      }
    }
  }

  [contenteditable] {
    outline-width: 1px !important;
    outline-offset: 0;

    &:empty:before {
      content: attr(placeholder);
      color: #6a6a6a;
    }
  }

  .validation-hint {
    color: var(--text-default-error);
    padding: 6px 0;
  }

  .invalid {
    outline-color: var(--border-plain-error) !important;
    outline-style: solid !important;
  }

  .nowrap {
    white-space: nowrap;
    overflow: hidden;
  }
</style>
