<script lang="ts"> 

  import { fade } from 'svelte/transition'

  export let copyright: string = ``
  export let title: string = ``
  export let date: string = ``
  export let url: string = ``
  export let explanation: string = ``

  $: copyright = copyright ? `(${copyright})` : ``
  $: if(!title) title = ``
  $: if(!date) date = ``
  $: if(!url) url = ``
  $: if(!explanation) explanation = ``
  
</script>

<div id="selected"> 
  <h2> {title} </h2>
  <h5> {date} {copyright} </h5>
  <div class="selected-display">
    {#key url}
      {#if url}
        <img src={url} alt="" in:fade />
      {:else}
        <img alt="" />
      {/if}
      <div class="hover-display"> 
        <p> {explanation} </p>
      </div>
    {/key}
  </div>
</div>

<style>

  #selected { 
    grid-area: selected;   
    display: grid;
    gap: 1em;
  }

  #selected h2, #selected h5 {
    width: fit-content;
  }

  .selected-display {
    overflow: hidden;

    position: relative;

    height: 50vh;

    border: 0.1rem solid var(--white);
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

  @media (max-aspect-ratio: 33/20) {

    #selected {
      gap: 0;
    }

  }

  @media (max-aspect-ratio: 1) {

    #selected {
      font-size: 1.1em
    }

  }
  
</style>