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
    gap: 32px;
  }
  /* Customize the label (the container) */
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
    font-size: 1.125rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border-radius: 4px;
  }

  .checkbox-label:has(input:focus-visible) {
    outline: 2px solid var(--nord8);
    outline-offset: 4px;
  }

  /* Hide the browser's default checkbox */
  .checkbox-label input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
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
    border-radius: 4px;
    transition: background-color 250ms;
    border: 1px solid var(--nord3);
  }

  /* When the checkbox is checked, add a blue background */
  .checkbox-label input:checked ~ .checkmark {
    background-color: var(--nord10);
    border-color: var(--nord9);
  }

  /* On mouse-over, add a grey background color */
  .checkbox-label:hover input ~ .checkmark {
    background-color: var(--nord8);
  }

  .checkbox-label:active input ~ .checkmark {
    background-color: var(--nord9);
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
    border: solid var(--color-text);
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: translateY(50%) translatex(70%) rotate(45deg);
  }
</style>
