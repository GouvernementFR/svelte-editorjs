<script>
  import { onMount } from "svelte";
  import FileUploader from "../plugins/FileUploader";

  export let data;
  export let api;
  export let config;
  export let hasFile = false;
  let wrapper, uploaderHtml;

  // Instantiates an uploader and stores it
  const uploader = new FileUploader({
    data: data,
    config: config,
    api: api,
  });

  uploader.showFileData = function () {
    if (this.data && this.data.file) {
      data.formattedSize = this.data.file.formattedSize;
      data.extension = this.data.file.extension;
      data.title = this.data.file.name;
      data.file = this.data.file;
      hasFile = true;
    }
  };

  // Renders the uploader HTML
  uploaderHtml = uploader.render();

  onMount(() => {
    wrapper.append(uploaderHtml);
  });
</script>

<div class="fr-upload-group" bind:this={wrapper}>
  <label class="fr-label" for="file-upload"><slot /></label>

  {#if data.formattedSize}
    <div class="cdx-block">
      <div class="cdx-attaches cdx-attaches--with-file">
        <div class="cdx-attaches__file-icon">
          <span class="fr-fi-file-line fr-fi--lg" aria-hidden="true" />
        </div>
        <div class="cdx-attaches__file-info">
          <div class="fr-text">{data.title}</div>
          <div class="fr-text--xs">{data.formattedSize}</div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .fr-text--xs {
    margin-bottom: 0;
    color: #6b6b6b;
  }
</style>
