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
          imageMeta.set(key, value);
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
    const text = JSON.stringify(Object.fromEntries(imageMeta));
    await writableStream.write(text);
    await writableStream.close();
  }
</script>

<section id="container">
  <h1>Image Metadata Manager</h1>
  <section class="file-selection">
    <div>
      <h2>Metadata File</h2>
      <input
        type="file"
        accept=".json"
        bind:files={metaFileSelection}
        onchange={handleFileChange}
      />
    </div>
    {#if imageMeta.size > 0}
      <div transition:fly={{ x: -100 }}>
        <h2>Image Folder</h2>
        <input
          type="file"
          webkitdirectory
          directory
          multiple
          bind:files={imgDirectory}
          onchange={handleImageFolderChange}
        />
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
            <ImageEntry
              name={key}
              files={value}
              bind:meta={imageMeta}
              onSave={onUpdate}
            ></ImageEntry>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</section>

<style>
  #container {
    max-width: 90vw;
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
  }
  .file-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      margin: 0;
    }
  }
</style>
