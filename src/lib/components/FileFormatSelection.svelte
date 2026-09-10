<script lang="ts">
  let { fileFormats, selectedFormats = $bindable(), onchange } = $props();
</script>

<div class="format-list">
  {#each fileFormats as format}
    <label class="checkbox-label">
      <input
        class="checkbox-input"
        type="checkbox"
        name="formats"
        value={format}
        bind:group={selectedFormats}
        {onchange}
      />
      <span class="checkmark"></span>
      {format}
    </label>
  {/each}
</div>

<style>
  .format-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-large-rem);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-small-rem);
    position: relative;
    cursor: pointer;
    font-size: var(--font-size-body);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border-radius: var(--border-radius);
  }

  .checkbox-label:has(input:focus-visible) {
    outline: var(--focus-outline);
    outline-offset: var(--outline-offset);
  }

  /* Hide the browser's default checkbox */
  .checkbox-label input {
    position: absolute;
    cursor: pointer;
    opacity: 0;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    height: 1em;
    width: 1em;
    background-color: var(--color-surface);
    display: grid;
    place-items: center;
    place-content: center;
    border-radius: var(--border-radius);
    transition: background-color var(--animation-time);
    border: var(--form-border);
  }

  /* When the checkbox is checked, add a blue background */
  .checkbox-label input:checked ~ .checkmark {
    background-color: var(--color-accent-element);
    border-color: var(--color-light-accent);
  }

  /* On mouse-over, add a grey background color */
  .checkbox-label:hover input ~ .checkmark {
    background-color: var(--color-light-accent);
  }

  .checkbox-label:active input ~ .checkmark {
    background-color: var(--color-accent-element);
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: '';
    display: none;
  }

  /* Show the checkmark when checked */
  .checkbox-label input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkbox-label .checkmark:after {
    position: absolute;
    top: 0;
    left: 1px;
    width: 0.25em;
    height: 0.5em;
    border: solid var(--color-text-bright);
    border-width: 0 3px 3px 0;
    transform: translateY(50%) translatex(70%) rotate(45deg);
  }
</style>
