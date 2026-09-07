<script lang="ts">
  import { fly, fade, slide } from 'svelte/transition';

  import { trapFocus } from '../trapFocus.svelte.ts';
  let { name, files, meta = $bindable(), onSave } = $props();

  let display = $derived(JSON.stringify(meta.get(name)));

  let editing = $state(false);

  function getFileFormats() {
    return files.map((x) => x.type.split('/')[1]);
  }

  function newMeta() {
    let newMeta = $state({
      fileName: name,
      formats: getFileFormats(),
      alt: '',
    });
    onSave(name, newMeta);
  }
</script>

<button
  onclick={() => {
    editing = true;
  }}
  class="image-button"
>
  <img src={URL.createObjectURL(files[0])} alt="" class="img" />
</button>

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
      transition:fade
    ></div>
    <article
      class="modal"
      {@attach trapFocus}
      transition:fly={{ y: 200, duration: 300 }}
    >
      <h2 class="edit-header">{name}</h2>
      <div class="button-container">
        <button
          onclick={() => {
            onSave(name, meta.get(name));
            editing = false;
          }}
        >
          Save
        </button>
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
        <img src={URL.createObjectURL(files[0])} alt="" class="edit-image" />
        <div class="edit" transition:fade>
          {#if meta.get(name)}
            <div class="input-section" transition:slide>
              <label for={name + '-alt'}>Alt Text:</label>
              <textarea
                id={name + '-alt'}
                value={meta.get(name).alt}
                onchange={(event) => {
                  meta.get(name).alt = this.value;
                }}
              ></textarea>
            </div>
            <div class="input-section" transition:slide>
              <label for={name + 'title'}>Title:</label>
              <textarea
                id={name + '-title'}
                value={meta.get(name).title}
                onchange={(event) => {
                  meta.get(name).title = this.value;
                }}
              ></textarea>
            </div>
            <div class="input-section" transition:slide>
              <label for={name + '-description'}>Description:</label>
              <textarea
                id={name + '-description'}
                value={meta.get(name).description}
                onchange={(event) => {
                  meta.get(name).description = this.value;
                }}
              ></textarea>
            </div>
            <div class="input-section" transition:slide>
              <label for={name + '-location'}>Location:</label>
              <input
                id={name + '-location'}
                value={meta.get(name).location}
                onchange={(event) => {
                  meta.get(name).location = this.value;
                }}
              />
            </div>
            <div class="input-section" transition:slide>
              <label for={name + '-date'}>Date:</label>
              <input
                id={name + '-date'}
                value={meta.get(name).date}
                onchange={(event) => {
                  meta.get(name).date = this.value;
                }}
              />
            </div>
            <div class="input-section" transition:slide>
              <label for={name + '-credit'}>Credit:</label>
              <input
                id={name + '-date'}
                value={meta.get(name).credit}
                onchange={(event) => {
                  meta.get(name).credit = this.value;
                }}
              />
            </div>
            <div class="file-formats" transition:slide>
              <button
                onclick={() => {
                  meta.get(name).formats = getFileFormats();
                }}
              >
                Update File Formats
              </button>
              {meta.get(name).formats}
            </div>
          {:else}
            <button
              onclick={() => {
                newMeta();
              }}>initialize Metadata</button
            >
          {/if}
        </div>
      </div>
    </article>
  </div>
{/if}

<style>
  .image-button {
    background-color: var(--color-surface);
    border: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
  }

  .image-button:hover:not(:active) {
    .img {
      transform: scale(1.05);
    }
  }

  .image-button:active {
    transform: scale(0.95);
  }

  .img {
    object-fit: cover;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    image-orientation: from-image;
    transition: transform 250ms;
  }

  .modal-container {
    position: fixed;
    display: grid;
    place-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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
    padding: 64px 32px;
    border-radius: 4px;
    border-top-left-radius: 0;
    border: 1px solid var(--color-surface);
  }

  .modal-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    gap: 32px;
    place-content: center;
    align-items: start;
  }

  .button-container {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(calc(-100% - 0.5rem));
    display: flex;
    gap: 0.5rem;
  }

  .edit-header {
    position: absolute;
    top: 0;
    left: 0;
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
  }

  .edit-image {
    max-width: 100%;
    image-orientation: from-image;
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

  .file-formats {
    grid-column: span 2;
  }

  input,
  textarea {
    color: var(--color-text);
    background-color: var(--color-surface);
    border: 1px solid var(--nord3);
    padding: 0.5rem;
    line-height: 1.5;
    border-radius: 4px;
    font-family: Roboto, sans-serif;
    font-size: 1rem;

    &:focus-visible {
      outline: 2px solid var(--nord8);
    }
  }
</style>
