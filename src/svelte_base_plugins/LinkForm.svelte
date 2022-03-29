<script>
  import {tick, createEventDispatcher, onDestroy} from 'svelte';
  import {linkValidator, anchorValidator} from './validators.js';
  export let open = false;
  export let toolbarHidden;
  export let href;
  let input;
  let inputContent = '';
  let inputIsValid;
  let errorMsg = "Veuillez respecter le format d'url/d'ancre requis";
  let trueSelection;
  let targetBlank = false;
  const dispatch = createEventDispatcher();
  onDestroy(() => {
      open = false;
      if (trueSelection) {
          restoreSelection();
          setCaretToEndofSel();
      }
  });
  function saveCurrentSelections() {
      /*
       Sets a background color on the selection, because that selection will be lost once the LinkForm input will get
       the focus (and the user should always sees what he is editing)
       */
      const selection = document.getSelection();
      trueSelection =
          selection.rangeCount === 0 ? null : selection.getRangeAt(0);
  }
  function restoreSelection() {
      const selection = document.getSelection();
      selection.removeAllRanges();
      selection.addRange(trueSelection);
      // Removes the fake selection background added in formInit()
      document.execCommand('removeFormat');
  }
  function formInit() {
      const linkNode = getLinkNode() || false;
      if (linkNode) {
          selectWholeLink(linkNode);
          href = linkNode.getAttribute('href');
          inputContent = href;
          targetBlank = linkNode.getAttribute('target') === '_blank';
      }
      document.execCommand('hiliteColor', false, '#d4ecff');
      const selection = document.getSelection();
      trueSelection =
          selection.rangeCount === 0 ? null : selection.getRangeAt(0);
      inputIsValid = true;
  }
  export async function toggleLinkForm() {
      open = !open;
      if (open) {
          saveCurrentSelections();
          formInit();
          // Updates the DOM instantly
          await tick();
          input.focus();
          input.select();
      } else {
          restoreSelection();
      }
  }
  function hideToolbar() {
      if (open) {
          toolbarHidden = true;
      }
  }
  function getFirefoxBadSelection() {
      /*
       Helps with some edges cases seen on firefox. E.g. double click to select.
       */
      const a = trueSelection.startContainer.nextSibling;
      const b = trueSelection.endContainer.previousSibling;
      let badSelection = false;
      if (
          a &&
          b &&
          a.isSameNode(b) &&
          a.childNodes.length === 1 &&
          a.firstChild.tagName === 'A'
      ) {
          badSelection = a.firstChild;
      }
      return badSelection;
  }
  function getLinkNode() {
      let nodes = [
          trueSelection.startContainer,
          trueSelection.endContainer,
          trueSelection.startContainer.parentNode,
          trueSelection.endContainer.parentNode,
      ];
      return (
          getFirefoxBadSelection() ||
          nodes.find((node) => node.tagName === 'A')
      );
  }
  function createLink() {
      const linkValidation = linkValidator(inputContent) === true;
      const anchorValidation = anchorValidator(inputContent) === true;
      inputIsValid = linkValidation || anchorValidation;
      if (inputIsValid) {
          // Creates the link element
          const linkNode = document.createElement('a');
          linkNode.textContent = trueSelection.toString();
          linkNode.setAttribute('href', inputContent);
          // Restores the selection & removes any link it may contains
          restoreSelection();
          document.execCommand('unlink');
          // Retrieve the current range, replace its contents with the link element
          const range = document.getSelection().getRangeAt(0);
          range.deleteContents();
          range.insertNode(linkNode);
          trueSelection.selectNode(linkNode);
          // Prevents target=_blank when the user is adding an anchor
          if (targetBlank && linkValidation) {
              linkNode.setAttribute('target', '_blank');
          } else {
              linkNode.setAttribute('target', '_self');
          }
          dispatch('ExternalLinkAdded');
      }
  }
  function hasEnterBeenPressed(e) {
      if (e.code.toLowerCase() === 'enter') {
          createLink();
          e.preventDefault();
      }
  }
  function selectWholeLink(linkNode) {
      /*
       Only a small part of the hyperlink text may have been selected. This extends the selection to include the
       whole element
       */
      const newRange = document.createRange();
      newRange.selectNode(linkNode);
      const compareStarts = newRange.compareBoundaryPoints(
          Range.START_TO_START,
          trueSelection
      );
      const compareEnds = newRange.compareBoundaryPoints(
          Range.END_TO_END,
          trueSelection
      );
      if (compareStarts <= 0 && compareEnds >= 0) {
          trueSelection.selectNode(linkNode);
      } else if (compareStarts === -1) {
          trueSelection.setStartBefore(linkNode);
      } else {
          trueSelection.setEndAfter(linkNode);
      }
  }
  function deleteLink() {
      restoreSelection();
      document.execCommand('unlink');
  }
  function setCaretToEndofSel() {
      // Moves the cursor to the end of the current selection.
      const selection = document.getSelection();
      if (selection && !selection.isCollapsed) {
          const range = selection.getRangeAt(0);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
      }
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
      box-shadow: 0 8px 8px 0 rgb(0 0 0 / 10%),
          0 8px 16px -16px rgb(0 0 0 / 32%);
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
              content: '*';
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
              content: '*';
              color: #d80600;
              margin-left: 0.25rem;
          }
      }
  }
</style>