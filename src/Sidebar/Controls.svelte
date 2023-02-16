<script lang="ts">

  import svg_caret_up from '../assets/Caret up.svg'
  import svg_caret_down from '../assets/Caret down.svg'

  export let offset: number
  export let increment_offset: Function

  export let selected: number
  export let set_selected: Function

  export let isLast: boolean

</script>

<div id="controls"> 
  <div class="month-controls"> 
    <button class="up {!offset && `disabled`}"
      on:click={() => increment_offset(offset ? -1 : 0)}
      on:keydown={() => increment_offset(offset ? -1 : 0)}
    >
      <img src={svg_caret_up} alt="" />
      <p> Next Month </p>
    </button>
    <button class="down"
      on:click={() => increment_offset(1)}
      on:keydown={() => increment_offset(1)}
    >
      <img src={svg_caret_down} alt="" />
      <p> Previous Month </p>
    </button>
  </div>
  <div class="day-controls"> 
    <button class="up {isLast && `disabled`}"
      on:click={() => set_selected(selected + 1)}
      on:keydown={() => set_selected(selected + 1)}
    >
      <img src={svg_caret_up} alt="" />
      <p> Next Day </p>
    </button>
    <button class="down"
      on:click={() => set_selected(selected - 1)}
      on:keydown={() => set_selected(selected - 1)}
    >
      <img src={svg_caret_down} alt="" />
      <p> Previous Day </p>
    </button>
  </div>
</div>

<style>

  #controls {
    grid-area: controls;
    display: flex;
    justify-content: space-between;

    translate: -0.7em 0;
  }

  button {
    display: flex;
    align-items: center;

    width: fit-content;

    background-color: transparent;

    font-size: 1em;

    border: none;

    cursor: pointer;
  }

  button img {
    width: 2.5em;

    filter: var(--filter-white);
  }

  button p {
    font-weight: 400;
  }

  button:not(.disabled):hover p {
    text-decoration: underline;
  }

  @media (max-aspect-ratio: 1) {

    .month-controls {
      display: none;
    }

    .day-controls {
      display: flex;
      flex-direction: column;
      gap: 1em;

      font-size: 1.2em;
    }
    
  }

</style>