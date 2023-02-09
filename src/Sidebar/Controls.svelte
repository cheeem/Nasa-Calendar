<script lang="ts">

  import svg_caret_up from '../assets/Caret Up.svg'
  import svg_caret_down from '../assets/Caret Down.svg'

  export let offset: number
  export let increment_offset: Function

</script>

<div class="controls"> 
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

<style>

  .controls {
    display: flex;
    justify-content: space-between;
  }

  button {
    display: flex;
    align-items: center;

    width: fit-content;

    background-color: transparent;

    font-size: 1em;

    border: none;

    cursor: pointer;

    translate: -0.7em 0;
  }

  button:last-of-type {
    translate: 0;
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

</style>