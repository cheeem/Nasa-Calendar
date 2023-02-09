<script lang="ts"> 

  import type { APOD } from '../utils/types'

  import { fade } from 'svelte/transition'

  export let selected: APOD
  
</script>

<div class="selected"> 
  <h2> {selected.title} </h2>
  <h5> {selected.copyright ?? ``} </h5>
  <div class="selected-display">
    {#key selected}
      {#if selected.url}
        <img src={selected.url} alt="" in:fade />
      {:else}
        <img alt="" />
      {/if}
      <div class="hover-display"> 
        <p> {selected.explanation} </p>
      </div>
    {/key}
  </div>
</div>

<style>

  .selected {    
    display: flex;
    flex-direction: column;
    gap: 1em;

    margin-top: auto;
  }

  .selected h2, .selected h5 {
    width: fit-content;
  }

  .selected-display {
    overflow: hidden;

    position: relative;

    height: 50vh;

    border: 0.15em solid var(--white);
    border-radius: 0.3em;
  }

  .selected-display img {
    height: 100%;
    width: 100%;

    object-fit: cover;

    transition: 0.5s ease;
  }

  .selected-display:hover img {
    scale: 1.1;
    opacity: 0.3;
  }

  .selected-display .hover-display {
    overflow-y: auto;

    font-size: 1.1em;

    cursor: unset;

    scrollbar-width: thin;
    scrollbar-color: var(--white) var(--dark);
  }

  .selected-display:hover .hover-display {
    height: 100%;
    opacity: 1;
  }

  .selected-display .hover-display::-webkit-scrollbar {
    width: 0.5em;
  }

  .selected-display .hover-display::-webkit-scrollbar-track {
    background: var(--dark);
  }

  .selected-display .hover-display::-webkit-scrollbar-thumb {
    margin: 0.3em;

    background-color: var(--white);
  }
  
</style>