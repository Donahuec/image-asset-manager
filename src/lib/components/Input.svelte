<script>
  import { slide } from 'svelte/transition';
  let { name, fieldName, id, value, onchange, textarea = true } = $props();
</script>

<div class="input-section" transition:slide>
  <label for={id}>{fieldName}:</label>
  {#if textarea}
    <textarea {id} {value} {onchange}></textarea>
  {:else}
    <input {id} {value} {onchange} />
  {/if}
</div>

<style>
  .input-section {
    display: grid;
    grid-template-columns: subgrid;
    align-items: baseline;
    grid-column: span 2;
    text-align: right;
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
