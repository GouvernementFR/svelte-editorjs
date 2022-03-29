<script>
  import {tick, getContext, onDestroy} from 'svelte';
  import {anchorValidator} from './validators.js';
  export let open = false;
  export let toolbarHidden;
  export let anchor = getContext('anchor');
  let input;
  let inputContent = $anchor ? '#' + $anchor : '';
  let inputIsValid = true;
  let errorMsg;
  let fakeSelection;
  onDestroy(() => {
      open = false;
      if (fakeSelection) {
          restoreSelection();
          setCaretToEndofSel();
      }
  });
  function saveCurrentSelection() {
      /*
       Sets a background color on the selection, because that selection will be lost once the AnchorForm input will get
       the focus.
       */
      document.execCommand('hiliteColor', false, '#d4ecff');
      const selection = document.getSelection();
      fakeSelection =
          selection.rangeCount === 0 ? null : selection.getRangeAt(0);
  }
  function restoreSelection() {
      const selection = document.getSelection();
      selection.removeAllRanges();
      selection.addRange(fakeSelection);
      // Removes the fake selection background added in saveCurrentSelections()
      document.execCommand('removeFormat');
  }
  export async function toggleAnchorForm() {
      open = !open;
      if (open) {
          saveCurrentSelection();
          // Updates the DOM instantly
          await tick();
          input.focus();
      } else {
          restoreSelection();
      }
  }
  function hideToolbar() {
      if (open) {
          toolbarHidden = true;
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
      anchor.set('');
      inputContent = '';
      hideToolbar();
  }
  function hasEnterBeenPressed(e) {
      if (e.code.toLowerCase() === 'enter') {
          createAnchor();
          e.preventDefault();
      }
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
      box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.1),
          0 8px 16px -16px rgba(0, 0, 0, 0.32);
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
