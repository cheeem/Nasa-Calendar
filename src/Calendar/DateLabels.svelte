<script lang="ts">

  const labels = [
    `Sunday`, 
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ]

</script>

{#each labels as label}
  <li> {label} </li>
{/each}

<style>

  li {
    text-align: center;
    font-size: 1vw;
    font-weight: 600;
  }

  @media (max-aspect-ratio: 33/20) {

    li {
      font-size: 1.5vw;
    }

  }

</style>