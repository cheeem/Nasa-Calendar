<script lang="ts">

  import { format_month } from "../utils/data";

  export let date: Date;

</script>

<div id="heading"> 
  <h4> NASA Astronomy Picture of the Day Calendar</h4>
  {#key date}
      <h1> {format_month(date)} </h1>
  {/key}
</div>

<style>

  #heading {
    grid-area: heading;
  }

  #heading * {
    width: fit-content;
    white-space: nowrap;
  }

  h1 {
    overflow: hidden;

    margin: 0 auto 0 0;

    font-size: 3em;

    border-right: .15em solid transparent;

    translate: -0.06em 0;

    animation: 
      typing 0.75s steps(13, end),
      blink-caret 0.75s step-end infinite;
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: var(--white) }
  }

</style>