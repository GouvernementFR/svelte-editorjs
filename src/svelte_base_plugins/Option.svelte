<script>
  import { v4 as uuidv4 } from "uuid";

  const uuid = uuidv4();
  let shown = true;

  export let closeButton = true;

  export function show(e) {
    e.preventDefault();
    shown = true;
  }

  export function hide(e) {
    e.preventDefault();
    shown = false;
  }
</script>

<div
  id="fr-options-{uuid}"
  class="fr-options fr-mt-1w fr-p-2w"
  class:active={shown}
>
  <div class="fr-grid-row">
    <div class="fr-col-12">
      <div class="fr-options__header">
        {#if closeButton}
          <button
            class="fr-link--close fr-link"
            aria-controls="fr-options-{uuid}"
            on:click={hide}>Fermer</button
          >
        {/if}
      </div>
      <slot />
      <p class="fr-options--required fr-text--xs fr-mb-0">
        <em>Les champs marqués d'un * doivent être remplis</em>
      </p>
    </div>
  </div>
</div>

<style lang="scss">
  .fr-options {
    background-color: var(--background-contrast-grey);
    display: none;
    &__header {
      display: flex;
      align-items: flex-end;
    }
    &--required {
      text-align: right;
    }

    &.active {
      display: block;
    }
  }
</style>
