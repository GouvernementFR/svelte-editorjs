<svelte:options accessors />

<script>
  import Input from "../svelte_base_plugins/Input.svelte";

  export let data;
  let youtube_re =
    /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?‌​=]*)?/;

  const paragraphConfig = {
    classes: "fr-mb-0",
    inlineToolbarOptions: [
      "insertOrderedList",
      "insertUnorderedList",
      "italic",
      "bold",
      "createLink",
    ],
  };

  function handlePaste(event) {
    let paste = (event.clipboardData || window.clipboardData).getData("text");
    if (!youtube_re.test(paste)) {
      data.text = data.text + paste;
      event.preventDefault();
      event.stopPropagation();
    }
  }
</script>

<Input {...paragraphConfig} bind:html={data.text} on:paste={handlePaste} />
