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

  function onUpdate(key: string, updatedMeta: ImageDataCls) {
    imageMeta.set(key, updatedMeta);
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
    <section class="selected-files" transition:fade={{ duration: 400 }}>
      <div class="file-title">
        <h2>Selected Files</h2>
        <button onclick={saveFile}>Save Metadata</button>
      </div>
      <ul class="images">
        {#each images.entries() as [key, value]}
          <li>
            <ImageEntry name={key} files={value} bind:meta={imageMeta}
            ></ImageEntry>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if imageMeta.size > 0}
    <section class="metadata-preview">
      <h2>Current Output</h2>
      {#each imageMeta as [key, value]}
        <article>
          <h3>{key}</h3>
          <ul>
            {#if value.title}
              <li>Title: {value.title}</li>
            {/if}
            {#if value.description}
              <li>Description: {value.description}</li>
            {/if}
            {#if value.alt}
              <li>Alt Text: {value.alt}</li>
            {/if}
            {#if value.location}
              <li>Location: {value.location}</li>
            {/if}
            {#if value.Date}
              <li>Date: {value.date}</li>
            {/if}
            {#if value.Credit}
              <li>Credit: {value.credit}</li>
            {/if}
            {#if value.formats}
              <li>Formats: {value.formats}</li>
            {/if}
          </ul>
        </article>
      {/each}
    </section>
  {/if}
</section>

<style>
  #container {
    max-width: 80vw;
    margin: auto;
    padding-block: 64px;
  }

  .selected-files {
    margin-block: 48px;
  }

  .file-selection {
    display: grid;
    grid-template-columns: min-content min-content;
  }

  .images {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-auto-rows: 250px;
    gap: 1rem;
    padding-block: 0.5rem;
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
    border: 2px dashed var(--nord10);
    width: 250px;
    padding: 1rem;
    border-radius: 4px;
    margin-inline: 1rem;
  }

  .selected-file {
    margin: 0;
    margin-top: 0.75rem;
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
    background-color: var(--nord10);
    color: var(--nord6);
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 1rem;
    will-change: transform;
    text-align: center;
    transition:
      transform 250ms,
      opacity 250ms;
  }

  .file-input-label:hover {
    transform: scale(1.05);
    cursor: pointer;
  }

  .file-input-label:active {
    transform: scale(0.95);
    opacity: 0.9;
  }

  .file-input-label:has(+ input:focus-visible) {
    transform: scale(1.05);
    outline: 2px solid var(--nord7);
    outline-offset: 4px;
  }
</style>
