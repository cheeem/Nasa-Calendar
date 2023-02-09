<script lang="ts">

  import loader from '../assets/loader.gif'

  export let length: number
  export let starting_index: number
  export let get_style: Function
  export let date: Date
  export let loading: boolean

</script>

{#each { length } as _, i}
  <li class="day" style={get_style({ i, date, })}>
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