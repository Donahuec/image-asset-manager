<script lang="ts">
  import ImageButton from './ImageButton.svelte';
  import Input from './Input.svelte';
  import FileFormatSelection from './FileFormatSelection.svelte';
  import { fly, fade, slide } from 'svelte/transition';
  import { trapFocus } from '../trapFocus.svelte.ts';
  let { name, files, meta = $bindable() } = $props();

  let display = $derived(JSON.stringify(meta.get(name)));
  let editing = $state(false);
  let imageIndex = $state(0);
  let imageUrl = $derived(URL.createObjectURL(files[imageIndex]));
  let current = $derived(meta.get(name));
  let hasNoData = $derived(!current);

  // svelte-ignore state_referenced_locally
  let selectedFormats = $state(meta.get(name)?.formats || []);
  let fileFormats = $derived(files.map((x) => x.type.split('/')[1]));

  function newMeta() {
    let newMeta = $state({
      fileName: name,
      formats: fileFormats,
      alt: '',
    });
    meta.set(name, newMeta);
    selectedFormats = fileFormats;
  }
</script>

<ImageButton {name} {imageUrl} {hasNoData} bind:editing></ImageButton>

{#if editing}
  <div
    class="modal-container"
    role="presentation"
    onkeydown={(e) => {
      if (e.key === 'Escape') {
        editing = false;
      }
    }}
  >
    <div
      class="modal-backdrop"
      onclick={(event) => {
        if (event.target === event.currentTarget) {
          editing = false;
        }
      }}
      aria-hidden="true"
      transition:fade={{ duration: 100 }}
    ></div>
    <article
      class="modal"
      {@attach trapFocus}
      transition:fly={{ y: 200, duration: 350 }}
    >
      <h2 class="edit-header">{name}</h2>
      <div class="close-button-container">
        <button
          onclick={() => {
            editing = false;
          }}
          class="close-button"
        >
          Close
        </button>
      </div>
      <div class="modal-content">
        <div class="img-column">
          <div class="img-container">
            <img src={imageUrl} alt="" class="edit-image" />
          </div>
          <div class="all-image-formats">
            {#each files as file, i}
              <button
                class="format-button"
                onclick={() => {
                  imageIndex = i;
                }}
              >
                <figure class="format-thumbnail">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    class="format-thumbnail-image"
                  />
                  <figcaption class="format-thumbnail-caption">
                    {file.type.split('/')[1]}
                  </figcaption>
                </figure>
              </button>
            {/each}
          </div>
        </div>
        <div class="edit" transition:fade>
          {#if current}
            <Input
              {name}
              fieldName="Alt Text"
              id={name + '-alt'}
              value={meta.get(name).alt}
              onchange={(event) => {
                meta.get(name).alt = event.target.value;
              }}
            />
            <Input
              {name}
              fieldName="Title"
              id={name + '-title'}
              value={meta.get(name).title}
              onchange={(event) => {
                meta.get(name).title = event.target.value;
              }}
            />
            <Input
              {name}
              fieldName="Description"
              id={name + '-description'}
              value={meta.get(name).description}
              onchange={(event) => {
                meta.get(name).description = event.target.value;
              }}
            />
            <Input
              {name}
              fieldName="Location"
              id={name + '-location'}
              value={meta.get(name).location}
              textarea={false}
              onchange={(event) => {
                meta.get(name).location = event.target.value;
              }}
            />

            <Input
              {name}
              fieldName="Date"
              id={name + '-date'}
              value={meta.get(name).date}
              textarea={false}
              onchange={(event) => {
                meta.get(name).date = event.target.value;
              }}
            />
            <Input
              {name}
              fieldName="Credit"
              id={name + '-credit'}
              value={meta.get(name).credit}
              textarea={false}
              onchange={(event) => {
                meta.get(name).credit = event.target.value;
              }}
            />
            <div class="input-section" transition:slide>
              <p>File Formats:</p>
              <FileFormatSelection
                {fileFormats}
                bind:selectedFormats
                onchange={(event) => {
                  meta.get(name).formats = selectedFormats;
                }}
              />
            </div>
          {:else}
            <button
              class="initialize-meta"
              onclick={() => {
                newMeta();
              }}>Initialize Metadata</button
            >
          {/if}
        </div>
      </div>
    </article>
  </div>
{/if}

<style>
  .modal-container {
    position: fixed;
    display: grid;
    place-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: hsla(0, 0%, 0%, 0.75);
  }

  .modal {
    position: relative;
    background-color: var(--color-background);
    width: 70vw;
    min-height: 46vh;
    max-height: 90vh;
    padding: 64px 32px;
    border-radius: 4px;
    border-top-left-radius: 0;
    border: 1px solid var(--color-surface);

    --shadow-color: 0deg 0% 0%;
    box-shadow:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.34),
      1.5px 2.9px 3.7px -0.4px hsl(var(--shadow-color) / 0.34),
      2.7px 5.4px 6.8px -0.7px hsl(var(--shadow-color) / 0.34),
      4.5px 8.9px 11.2px -1.1px hsl(var(--shadow-color) / 0.34),
      7.1px 14.3px 18px -1.4px hsl(var(--shadow-color) / 0.34),
      11.2px 22.3px 28.1px -1.8px hsl(var(--shadow-color) / 0.34),
      17px 33.9px 42.7px -2.1px hsl(var(--shadow-color) / 0.34),
      25px 50px 62.9px -2.5px hsl(var(--shadow-color) / 0.34);
  }

  .modal-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    gap: 32px;
    place-content: center;
    align-items: start;
  }

  .close-button-container {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(calc(-100% - 0.5rem));
  }

  .edit-header {
    position: absolute;
    top: 0;
    left: -1px;
    transform: translateY(-100%);
    margin: 0;
    padding: 1rem;
    line-height: 1;
    background-color: var(--color-background);
    min-width: 150px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    text-align: center;
    border-top: 1px solid var(--color-surface);
    border-left: 1px solid var(--color-surface);
    border-right: 1px solid var(--color-surface);
    text-transform: capitalize;
  }

  .img-container {
    height: 100%;
    max-height: 40vh;
  }

  .edit-image {
    max-width: 100%;
    max-height: 40vh;
    image-orientation: from-image;
    border-radius: 4px;
    --shadow-color: 0deg 0% 0%;
    box-shadow:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.13),
      0.5px 1px 1.3px -1px hsl(var(--shadow-color) / 0.15),
      1.3px 2.5px 3.4px -2px hsl(var(--shadow-color) / 0.17);
  }

  .edit {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-content: start;
    gap: 1rem;
    width: 100%;
  }

  .input-section {
    display: grid;
    grid-template-columns: subgrid;
    align-items: baseline;
    grid-column: span 2;
    text-align: right;
  }

  .initialize-meta {
    margin-inline: auto;
    width: 80%;
    grid-column: span 2;
    padding: 1rem;
    font-size: 1.25em;
  }

  .all-image-formats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }

  .format-thumbnail::before {
    content: '';
    z-index: 1;
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0) 60%
    );
  }

  .format-thumbnail {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    z-index: 0;
  }

  .format-thumbnail-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .format-thumbnail-caption {
    position: absolute;
    bottom: 0.25rem;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2;
  }

  .format-button {
    padding: 0;
    max-height: 100px;
    max-width: 100px;
    border-radius: 4px;
    overflow: hidden;
    --shadow-color: 0deg 0% 0%;
    box-shadow:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.13),
      0.5px 1px 1.3px -1px hsl(var(--shadow-color) / 0.15),
      1.3px 2.5px 3.4px -2px hsl(var(--shadow-color) / 0.17);
  }

  .img-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    height: 100%;
  }
</style>
