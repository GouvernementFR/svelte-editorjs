<script>
  import { tick, createEventDispatcher, onDestroy } from "svelte";
  import { linkValidator, anchorValidator } from "./validators.js";

  export let open = false;
  export let toolbarHidden;
  let input;
  let inputContent = "";
  let inputIsValid;
  let errorMsg = "Veuillez respecter le format d'url/d'ancre requis";
  let savedSelection;
  let href;
  let targetBlank;

  /*
     EventDispatcher may seem a bit overkill, but it may come in handy later on.
     */
  const dispatch = createEventDispatcher();

  onDestroy(() => {
    // Firefox fix.
    if (savedSelection) {
      restoreSavedSelection();
      document.execCommand("removeFormat");
    }
  });

  function saveCurrentSelection(selection) {
    /*
         Sets a background color on the selection, because that selection will be lost once the LinkForm input will get
         the focus (and the user should always sees what he is editing).
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
    href = parent.getAttribute("href");
    inputContent = href || "";
    targetBlank = parent.getAttribute("target") === "_blank";
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
    } else {
      restoreSavedSelection();
    }
  }

  function hideToolbar() {
    // Removes the fake selection background added in saveCurrentSelection()
    restoreSavedSelection();
    document.execCommand("removeFormat");
    if (open) {
      toolbarHidden = true;
      open = false;
    }
  }

  async function createLink() {
    const linkValidation = linkValidator(inputContent) === true;
    const anchorValidation = anchorValidator(inputContent) === true;
    inputIsValid = linkValidation || anchorValidation;
    if (inputIsValid) {
      if (href) {
        selectWholeLink();
      } else {
        restoreSavedSelection();
      }
      // Clean the dom if it contains some garbage <a> (seen on Firefox).
      document.execCommand("unlink");
      document.execCommand("createLink", false, inputContent);
      const selection = document.getSelection();
      let link = selection.getRangeAt(0).startContainer.parentNode;
      /*
            Seems there is no reliable way to retrieve the inserted link in FireFox. So we try our best to identify the
            inserted link among all the links that have the same href. If no link is found, we use the first link
            associated with the selected href. Might cause a small inconvenience if 2 links have the same href in the
            case the selection.containsNode fails.
            */
      let firefoxLink = link.querySelector(`a[href="${inputContent}"]`);
      if (firefoxLink) {
        const links = Array.from(
          link.querySelectorAll(`a[href="${inputContent}"]`)
        );
        const ffLink = links.filter((ele) => selection.containsNode(ele, true));
        if (ffLink.length) {
          firefoxLink = ffLink[0];
        }
        link = firefoxLink;
      }
      await tick();
      // Prevents target=_blank when the user is adding an anchor.
      if (targetBlank && linkValidation) {
        link.setAttribute("target", "_blank");
      } else if (
        firefoxLink &&
        firefoxLink.getAttribute("target") === "_blank"
      ) {
        link.removeAttribute("target");
      } else {
        link.setAttribute("target", "_self");
      }
      dispatch("ExternalLinkAdded");
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
    const compareStarts = newRange.compareBoundaryPoints(
      Range.START_TO_START,
      savedSelection
    );
    const compareEnds = newRange.compareBoundaryPoints(
      Range.END_TO_END,
      savedSelection
    );
    if (compareStarts <= 0 && compareEnds >= 0) {
      savedSelection = newRange;
    } else if (compareStarts === -1) {
      savedSelection.setStartBefore(linkNode);
    }
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
  <p class="fr-text--xs">Champ obligatoire</p>
  <label class="fr-label" for="text-input-text"
    >Lien de redirection ou ancre</label
  >
  <input
    class="fr-input"
    type="text"
    placeholder="https:// ou #identifiant"
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
      >Sauvegarder</button
    >
  </div>
</div>

<style lang="scss">
  .linkform {
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
