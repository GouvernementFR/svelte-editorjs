<script>
  import { tick } from "svelte";
  import { linkValidator } from "./validators.js";

  export let open = false;
  export let toolbarHidden;
  let input;
  let inputContent = "";
  let inputIsValid;
  let errorMsg;
  let savedSelection;
  let href;
  let targetBlank;

  function saveCurrentSelection(selection) {
    /*
        Sets a background color on the selection, because that selection will be lost once the LinkForm input will get
        the focus (and the user should always sees what is being edited.)
        */
    document.execCommand("hiliteColor", false, "#d4ecff");
    savedSelection =
      selection.rangeCount === 0 ? null : selection.getRangeAt(0);
  }

  function restoreSavedSelection() {
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelection);
  }

  function formInit(selection) {
    const parent = selection.getRangeAt(0).startContainer.parentNode;
    // LinkformInput shoud be empty when it is opened, unless the selection contains a href.
    href = parent.getAttribute("href", false);
    inputContent = href || "";
    targetBlank = parent.getAttribute("target", false);
    inputIsValid = true;
  }

  export async function toggleLinkForm() {
    open = !open;
    if (open) {
      const selection = document.getSelection();
      formInit(selection);
      saveCurrentSelection(selection);
      // Updates the DOM instantly
      await tick();
      input.focus();
      input.select();
    }
  }

  async function hideToolbar() {
    // Removes the fake selection background added in saveCurrentSelection()
    restoreSavedSelection();
    document.execCommand("removeFormat");
    if (open) {
      toolbarHidden = true;
      open = false;
    }
  }

  async function createLink() {
    errorMsg = linkValidator(inputContent);
    inputIsValid = errorMsg === true;
    if (inputIsValid) {
      if (href) {
        selectWholeLink();
      } else {
        restoreSavedSelection();
      }
      document.execCommand("createLink", false, inputContent);
      if (targetBlank) {
        const link = document.getSelection().getRangeAt(0)
          .startContainer.parentNode;
        await tick();
        link.target = "_blank";
      }
      setCaretPosition();
    }
  }

  function hasEnterBeenPressed(e) {
    if (e.code.toLowerCase() === "enter") {
      createLink();
      e.preventDefault();
    }
  }

  function selectWholeLink() {
    /*
             Only a small part of the hyperlink text may have been selected. This extends the selection to include the
             whole element.
             */
    const selection = document.getSelection();
    const linkNode = savedSelection.startContainer.parentNode.closest("[href]");
    const newRange = document.createRange();
    newRange.selectNodeContents(linkNode);
    savedSelection = newRange;
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  function deleteLink() {
    selectWholeLink();
    document.execCommand("unlink");
    setCaretPosition();
  }

  function setCaretPosition() {
    // Moves the cursor to the end of the current selection.
    const selection = document.getSelection();
    savedSelection.collapse();
    selection.removeAllRanges();
    selection.addRange(savedSelection);
  }
</script>

<div class="linkform" class:open>
  <p class="fr-text--xs">Champs obligatoire</p>
  <label class="fr-label" for="text-input-text">Lien de redirection</label>
  <input
    class="fr-input"
    type="text"
    placeholder="https://"
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
  <div
    class="fr-checkbox-group fr-mt-1w fr-mb-2w"
    on:click|preventDefault={() => (targetBlank = !targetBlank)}
  >
    <input
      type="checkbox"
      id="checkbox-target"
      name="checkbox"
      bind:checked={targetBlank}
    />
    <label class="fr-label" for="checkbox-target"
      >Ouvrir dans une nouvelle fenêtre</label
    >
  </div>
  <div class="fr-grid-row">
    {#if href}
      <button
        class="fr-btn fr-btn--secondary fr-col fr-mr-2w"
        type="button"
        on:click={deleteLink}
        >Supprimer
      </button>
    {/if}
    <button class="fr-btn fr-col" type="button" on:click={createLink}
      >Sauvegarder
    </button>
  </div>
</div>

<style lang="scss">
  .linkform {
    display: none;
    flex-direction: column;
    background-color: #f5f5ff;
    padding: 1rem 1.5rem 1.5rem;

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
