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

  label {
    font-weight: var(--font-weight-bold);
  }

  input,
  textarea {
    color: var(--color-text);
    background-color: var(--color-surface);
    border: var(--form-border);
    padding: var(--spacing-small-rem);
    line-height: var(--line-height-body);
    border-radius: var(--border-radius);
    font-family: var(--font-family-body);
    font-size: var(--font-size-body);

    &:focus-visible {
      outline: var(--focus-outline);
    }
  }
</style>
