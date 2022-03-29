<script>
  export let text;
  export let isValid = true;
  function checkValidity() {
    isValid = true;
  }

  const divInput = {
    class: "fr-breakWord",
  };
</script>

<svelte:window on:submit|capture={checkValidity} />
<div contenteditable="false" {...divInput} bind:textContent={text} />
