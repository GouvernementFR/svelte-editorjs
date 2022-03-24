<script>
  import { tick, getContext } from "svelte";
  import { anchorValidator } from "./validators.js";
  export let open = false;
  export let toolbarHidden;
  export let anchor = getContext("anchor");
  let input;
  let inputContent = $anchor ? "#" + $anchor : "";
  let inputIsValid = true;
  let errorMsg;

  export async function toggleAnchorForm() {
    open = !open;
    if (open) {
      await tick();
      input.focus();
    }
  }

  function hideToolbar() {
    if (open) {
      toolbarHidden = true;
      open = false;
    }
  }

  function createAnchor() {
    errorMsg = anchorValidator(inputContent);
    inputIsValid = errorMsg === true;
    if (inputIsValid) {
      // Removes the starting #
      anchor.set(inputContent.substring(1));
      hideToolbar();
    }
  }

  function deleteAnchor() {
    anchor.set("");
    inputContent = "";
    hideToolbar();
  }

  function hasEnterBeenPressed(e) {
    if (e.code.toLowerCase() === "enter") {
      createAnchor();
      e.preventDefault();
    }
  }
</script>

<div class="anchorform" class:open>
  <p class="fr-text--xs">Champ obligatoire</p>
  <label class="fr-label" for="text-input-text">Identifiant de l'ancre</label>
  <span class="fr-hint-text"
    >#, suivi de caractères alphanumériques ou tirets</span
  >
  <input
    class="fr-input"
    type="text"
    placeholder="#identifiant"
    id="text-input-text"
    autocomplete="off"
    name="text-input-text"
    class:fr-input--error={!inputIsValid}
    bind:value={inputContent}
    bind:this={input}
    on:blur={hideToolbar}
    on:keydown={hasEnterBeenPressed}
  />
  <p class="text-desc-error" class:fr-error-text={!inputIsValid}>
    {errorMsg}
  </p>
  <div class="fr-grid-row fr-mt-2w">
    {#if $anchor}
      <button
        class="fr-btn fr-btn--secondary fr-col fr-mr-2w"
        type="button"
        on:click={() => deleteAnchor()}
        >Supprimer
      </button>
    {/if}
    <button class="fr-btn fr-col" type="button" on:click={createAnchor}
      >Sauvegarder</button
    >
  </div>
</div>

<style lang="scss">
  .anchorform {
    display: none;
    flex-direction: column;
    background-color: #f5f5ff;
    padding: 1rem 1.5rem 1.5rem;
    box-shadow: 0 8px 8px 0 rgb(0 0 0 / 10%), 0 8px 16px -16px rgb(0 0 0 / 32%);

    &.open {
      display: flex;
    }

    .fr-grid-row {
      flex-wrap: nowrap;
    }

    .text-desc-error {
      display: none;
    }

    .fr-error-text {
      display: flex;
      font-size: 0.75rem;
      line-height: 1.25rem;
      margin-top: 1rem;
      margin-bottom: 0;
      font-weight: normal;
    }

    p:first-child {
      font-weight: normal;

      &:before {
        content: "*";
        color: #d80600;
        margin-right: 0.25rem;
      }
    }

    .fr-input {
      background-color: var(--background-default-grey);
    }

    .fr-btn {
      justify-content: center;
    }

    .fr-btn--secondary {
      color: #ce0500;
      box-shadow: inset 0 0 0 1px #ce0500;
    }

    .fr-label {
      font-size: 14px;
      font-weight: normal;

      &:after {
        content: "*";
        color: #d80600;
        margin-left: 0.25rem;
      }
    }
  }
</style>
