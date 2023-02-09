<script lang="ts">

  import loader from '../assets/loader.gif'

  export let length: number
  export let starting_index: number
  export let style: (i: number, date: Date) => string = (i: number, date: Date) => ``
  export let date: Date
  export let loading: boolean = false

</script>

{#each { length } as _, i}
  <li class="day" style={style(i, date)}>
    <p class="index"> {starting_index + i + 1} </p>
    {#if loading}
      <img src={loader} alt="" />
    {:else}
      <img alt="" />
    {/if}
  </li>
{/each}

<style> 

</style>