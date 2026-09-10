<script lang="ts">
  import { fly, fade, slide } from 'svelte/transition';
  import ImageEntry from './lib/components/ImageEntry.svelte';
  import { SvelteMap } from 'svelte/reactivity';

  const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const imageFormatsRegexp = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/;

  let imgDirectory: FileList = $state();
  let metaFileSelection: FileList = $state();
  let images: SvelteMap<string, File[]> = $state();
  let imageMeta: SvelteMap<string, ImageDataCls> = $state(new SvelteMap());

  let asObj = $derived(Object.fromEntries(imageMeta));
  let display = $derived(JSON.stringify(asObj));

  async function handleFileChange(event) {
    if (metaFileSelection) {
      metaFileSelection[0].text().then((text) => {
        let meta = JSON.parse(text);
        for (let [key, value] of Object.entries(meta.images)) {
          let val = $state(value);
          imageMeta.set(key, val);
        }
      });
    }
  }

  async function handleImageFolderChange(event) {
    if (imgDirectory) {
      let files = Array.from(imgDirectory).filter(
        ({ name }) => !!name.match(imageFormatsRegexp)
      );
      images = SvelteMap.groupBy(files, ({ name }) => {
        return name.split('.')[0];
      });
    }
  }

  async function saveFile() {
    const newHandle = await window.showSaveFilePicker();
    const writableStream = await newHandle.createWritable();
    const text = JSON.stringify({ images: asObj });
    await writableStream.write(text);
    await writableStream.close();
  }
</script>

<section id="container">
  <h1>Image Metadata Manager</h1>
  <section class="file-selection">
    <div class="file-input">
      <label for="meta-file" class="file-input-label"
        >Select Metadata File</label
      >
      <input
        type="file"
        class="file-selector"
        id="meta-file"
        accept=".json"
        bind:files={metaFileSelection}
        onchange={handleFileChange}
      />
      {#if metaFileSelection}
        <p class="selected-file">{metaFileSelection[0].name}</p>
      {/if}
    </div>
    {#if imageMeta.size > 0}
      <div transition:fly={{ x: -100 }} class="file-input">
        <label for="image-files" class="file-input-label"
          >Select Image Folder</label
        >
        <input
          type="file"
          class="file-selector"
          id="image-files"
          webkitdirectory
          directory
          multiple
          bind:files={imgDirectory}
          onchange={handleImageFolderChange}
        />
        {#if images}
          <p class="selected-file">{images.size} Images</p>
        {/if}
      </div>
    {/if}
  </section>

  {#if images}
    <section class="selected-files" transition:slide={{ duration: 300 }}>
      <div class="file-title">
        <h2>Selected Files</h2>
        <button onclick={saveFile}>Save Metadata</button>
      </div>
      <ul class="images">
        {#each images.entries() as [key, value]}
          <li transition:fade|global>
            <ImageEntry name={key} files={value} bind:meta={imageMeta}
            ></ImageEntry>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if imageMeta.size > 0}
    <section class="metadata-preview" transition:slide>
      <h2>Current Output</h2>
      {#each imageMeta as [key, value]}
        <article transition:slide|global>
          <h3 class="preview-entry-title">{key}</h3>
          <dl class="metadata-list">
            {#if value.title}
              <dt>Title</dt>
              <dd>{value.title}</dd>
            {/if}
            {#if value.description}
              <dt>Description</dt>
              <dd>{value.description}</dd>
            {/if}
            {#if value.alt}
              <dt>Alt Text</dt>
              <dd>{value.alt}</dd>
            {/if}
            {#if value.location}
              <dt>Location</dt>
              <dd>{value.location}</dd>
            {/if}
            {#if value.date}
              <dt>Date</dt>
              <dd>{value.date}</dd>
            {/if}
            {#if value.Credit}
              <dt>Credit</dt>
              <dd>{value.credit}</dd>
            {/if}
            {#if value.formats}
              <dt>Formats</dt>
              <dd>{value.formats.join(', ')}</dd>
            {/if}
          </dl>
        </article>
      {/each}
    </section>
  {/if}
</section>

<style>
  #container {
    max-width: 80vw;
    margin: auto;
    padding-block: var(--spacing-max-px);
  }

  .selected-files {
    margin-block: var(--spacing-max-px);
  }

  .file-selection {
    display: grid;
    grid-template-columns: min-content min-content;
  }

  .images {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--element-size), 1fr));
    grid-auto-rows: var(--element-size);
    gap: var(--spacing-medium-rem);
    padding-block: var(--spacing-small-px);
    min-height: var(--element-size);
  }
  .file-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      margin: 0;
    }
  }

  .file-input {
    border: var(--border-decorative);
    width: var(--element-size);
    padding: var(--spacing-medium-rem);
    border-radius: var(--border-radius);
    margin-inline: var(--spacing-medium-rem);
  }

  .selected-file {
    margin: 0;
    margin-top: var(--spacing-medium-rem);
    text-align: center;
  }

  .file-selector {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
  }

  .file-input-label {
    display: block;
    background-color: var(--color-accent-element);
    color: var(--color-text-bright);
    padding: var(--spacing-small-rem);
    border: none;
    border-radius: var(--border-radius);
    font-size: var(--font-size-body);
    will-change: transform;
    text-align: center;
    transition:
      transform var(--animation-time),
      opacity var(--animation-time);
  }

  .file-input-label:hover {
    transform: scale(var(--button-scale-up));
    cursor: pointer;
  }

  .file-input-label:active {
    transform: scale(var(--button-scale-down));
    opacity: var(--button-active-opacity);
  }

  .file-input-label:has(+ input:focus-visible) {
    transform: scale(var(--button-scale-up));
    outline: var(--focus-outline);
    outline-offset: var(--outline-offset);
  }

  .metadata-preview {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-medium-rem);
    margin-block: var(--spacing-large-rem);
    h2 {
      margin: 0;
    }
    article {
      margin-inline: var(--spacing-medium-rem);
    }
  }

  .preview-entry-title {
    font-size: 1.25em;
    text-transform: capitalize;
    margin: 0;
    padding: 0;
    line-height: 1.2;
  }

  dl.metadata-list {
    margin-top: var(--spacing-xsmall-rem);
    padding: var(--spacing-medium-rem);
    border: var(--border-decorative);
    border-radius: var(--border-radius);
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: var(--spacing-medium-rem);
    row-gap: var(--spacing-small-rem);
    dt {
      font-weight: var(--font-weight-bold);
      text-align: right;
      color: var(--color-accent-text);
    }
    dd {
      padding: 0;
      margin: 0;
    }
  }
</style>
