<script lang="ts">
  import { fly, fade, slide } from 'svelte/transition';
  let { name, imageUrl, hasNoData, editing = $bindable() } = $props();
</script>

<button
  onclick={() => {
    editing = true;
  }}
  class={['image-button', { hasNoData }]}
>
  <figure class={['image-button-figure', { hasNoData }]}>
    <img src={imageUrl} alt="" class="img" />
    <figcaption class="image-button-caption">{name}</figcaption>
  </figure>
</button>

<style>
  .image-button {
    background-color: var(--color-background);
    border: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
    position: relative;
    isolation: isolate;
    box-shadow: var(--box-shadow-medium);
  }

  .image-button-figure::before {
    content: '';
    z-index: 1;
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    background: var(--text-backdrop-gradient);
  }

  .image-button-figure {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    z-index: 0;
    will-change: transform;
    transition: transform var(--animation-time);
  }

  .image-button-caption {
    position: absolute;
    bottom: var(--spacing-medium-rem);
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2;
    text-transform: capitalize;
  }

  .hasNoData {
    outline: var(--focus-outline);
    outline-color: var(--color-warning);
    .image-button-figure::before {
      background: var(--text-backdrop-gradient),
        linear-gradient(127deg, var(--color-warning), transparent 30%);
    }
  }

  .image-button:hover:not(:active) {
    .image-button-figure {
      transform: scale(var(--button-scale-up));
    }
  }

  .image-button:active {
    transform: scale(var(--button-scale-down));
  }

  .img {
    object-fit: cover;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);
    image-orientation: from-image;
  }
</style>
