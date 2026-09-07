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
    --shadow-color: 0deg 0% 0%;

    box-shadow:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.13),
      1.1px 2.1px 2.8px -0.7px hsl(var(--shadow-color) / 0.15),
      2.6px 5.3px 7.1px -1.3px hsl(var(--shadow-color) / 0.16),
      6.3px 12.5px 16.8px -2px hsl(var(--shadow-color) / 0.18);
  }

  .image-button-figure::before {
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

  .image-button-figure {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    z-index: 0;
    will-change: transform;
    transition: transform 250ms;
  }

  .image-button-caption {
    position: absolute;
    bottom: 1rem;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2;
    text-transform: capitalize;
  }

  .hasNoData {
    outline: 2px solid var(--nord11);
    .image-button-figure::before {
      background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.9) 0%,
          rgba(0, 0, 0, 0) 60%
        ),
        linear-gradient(127deg, var(--nord11), transparent 30%);
    }
  }

  .image-button:hover:not(:active) {
    .image-button-figure {
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
  }
</style>
