<script>
    import InlineToolbar from "./InlineToolbar.svelte";
    import {inlineToolbarActions} from "./InlineToolbarActions";
    import {emailValidator, requiredValidator, minLengthValidator, maxLengthValidator} from './validators.js'

    export let value = {text: null, html: null}
    export let type = "text"
    export let placeholder = "Write some text"
    export let required
    export let minlength
    export let maxlength
    export let classes
    export let inlineToolbarOptions = false
    export let isValid = true
    export let nowrap = false
    let inlineToolbar
    let validityState

    $: attributes = [
        {attr: required, validator: requiredValidator},
        {attr: minlength, validator: minLengthValidator},
        {attr: maxlength, validator: maxLengthValidator}
    ]


    function checkValidity() {
        for (const obj of attributes) {
            if (obj.attr) {
                const check = obj.validator(value.text, obj.attr)
                if (check !== true) {
                    isValid = false
                    validityState = check
                    return
                }
            }
        }
        isValid = true
    }

    function conditionalAction(node, params) {
        if (inlineToolbarOptions) {
            return inlineToolbarActions(node, params)
        }
    }
</script>

<svelte:window on:submit|capture={checkValidity}/>

<div class="svelte-input">
    <p
            contenteditable="true"
            {placeholder}
            bind:textContent={value.text}
            bind:innerHTML={value.html}
            class="{classes}"
            class:invalid={!isValid}
            class:valid={isValid}
            class:nowrap
            use:conditionalAction={inlineToolbar}
    ></p>
    {#if inlineToolbarOptions}
        <InlineToolbar inlineToolbarOptions={inlineToolbarOptions} bind:this={inlineToolbar}/>
    {/if}
    {#if !isValid}
		<span class="validation-hint fr-text--xs">
			{validityState}
		</span>
    {/if}
</div>


<style lang="scss">

  :global(.svelte-input a) {
    /* this will apply to <body> */
    text-decoration: none;
    cursor: inherit;
  }

  .svelte-input {
    position: relative;
  }

  [contenteditable] {
    outline-width: 1px;
    outline-offset: 0;

    &:empty:before {
      content: attr(placeholder);
      color: #6a6a6a;
    }

  }


  .validation-hint {
    color: red;
    padding: 6px 0;
  }

  .invalid {
    outline-color: red;
    outline-style: solid;
  }

  .valid {
    outline-color: green;
    outline-style: solid;
  }

  .nowrap {
    white-space: nowrap;
    overflow: hidden;
  }
</style>


