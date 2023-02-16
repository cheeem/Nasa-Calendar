<script lang="ts">

  import { 
    get_first_day, 
    get_last_day, 
    format_query_date, 
    get_offset_date,
  } from './utils/data.js'

  import Heading from './Sidebar/Heading.svelte'
  import Controls from './Sidebar/Controls.svelte'
  import Selected from './Sidebar/Selected.svelte'
  import DateLabels from './Calendar/DateLabels.svelte'
  import DateRange from './Calendar/DateRange.svelte'

  import { fade } from 'svelte/transition'

  type APOD = {
    title: string
    date: string
    url: string
    hdurl: string
    copyright: string
    explanation: string
  }

  type QueryArguments = {
    signal: AbortSignal
    first_day: Date
    max_day: Date
    offset: number
  }

  const controller = new AbortController()
  const { signal } = controller
  
  const cache: APOD[][] = []
  let offset: number = 0
  let selected: number = 0

  $: offset, (() => controller.abort)();

  let first_day: Date
  let last_day: Date
  let max_day: Date

  $: first_day = get_first_day(get_offset_date(offset))
  $: last_day =  get_last_day(get_offset_date(offset))
  $: max_day = last_day > new Date() ? new Date() : last_day

  let rows: number
  let flex: number

  $: rows = Math.ceil((first_day.getDay() + last_day.getDate()) / 7)
  $: flex = rows === 6 ? 5 : 8

  const query = async ({
    signal,
    first_day,
    max_day,
    offset,
  }: QueryArguments) => { 

    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=hIZ20K4ftBKwN1AdggqcZxrIjiquLTRkQlhO611D&start_date=${format_query_date(first_day)}&end_date=${format_query_date(max_day)}`, { signal })

    const apods = await res.json()

    if(signal.aborted) return 

    if(!offset) selected = max_day.getDate()-1

    cache[offset] = apods

    return apods

  }

  const increment_offset = (increment: number) => {

    offset += increment

    let last = get_last_day(get_offset_date(offset))

    let max_index = (last > new Date() ? new Date() : last).getDate()

    selected = increment+1 ? max_index-1 : 0

  }

  const set_selected = (input: number) => {

    if(input === -1) return increment_offset(1)

    if(input === max_day.getDate()) return increment_offset(offset ? -1 : 0)

    selected = input

  }

  $: controls_arguments = {
    offset, 
    increment_offset,
    selected,
    set_selected,
    isLast: !offset && (selected === max_day.getDate()-1),
  }

  $: loading_arguments = {
    length: max_day.getDate(),
    starting_index: 0,
    date: first_day,
    style: (i, date) => !i && `grid-column-start: ${date.getDay() + 1}`,
    loading: true,
  }

  $: remaining_arguments = {
    length: last_day.getDate() - max_day.getDate(),
    starting_index: max_day.getDate(),
    date: first_day,
  }

</script>

<main>

  <div id="sidebar">

    <Heading date={first_day} />

    <Controls {...controls_arguments} />
  
    <Selected {...cache?.[offset]?.[selected]} />
  
  </div>

  <ol id="calendar" style={`
    grid-template-rows: 6vh repeat(${rows}, 1fr);
    flex: ${flex};
  `}>

    <DateLabels />

    {#await cache?.[offset] ?? query({
      signal, 
      first_day, 
      max_day, 
      offset,
    })}
      
    <DateRange {...loading_arguments} />
    
    {:then apods}

      {#key offset}
        {#each apods as { url, title, date, }, i}
          <li class="day can-hover" in:fade style={
            !i && `grid-column-start: ${first_day.getDay() + 1}
          `}
            on:click={() => set_selected(i)}
            on:keydown={() => set_selected(i)}
          >
            <p class="index"> {i + 1} </p> 
            <img src={url} alt="" />
            <div class="hover-display"> 
              <p class="title"> {title} </p>
              <p class="date"> {date} </p>
            </div>
          </li>
        {/each} 
      {/key}

    {/await}
    
    <DateRange {...remaining_arguments} />

  </ol>

</main>

<style>

  :root {
    --vp-padding-y: 4vh;
    --vp-height: calc(100vh - var(--vp-padding-y) * 2);
  }

  main {
    overflow: hidden;

    position: relative;

    display: flex;
    justify-content: space-between;
    gap: 6.5vw;

    height: 100vh;

    padding: var(--vp-padding-y) 6.5vw;

    background-color: var(--dark);
    background-image: url(./assets/background.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  #sidebar {
    flex: 3;
    display: grid;
    grid-template-areas: 
      "heading"
      "controls"
      "selected"
    ;
    gap: 1.5em;

    font-size: 1vw;
  }

  #calendar {
    flex: 8;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.6em;

    font-size: min(1.5vw, 2.2vh);
  }

  .can-hover:hover .index {
    opacity: 0;
  }

  .can-hover:hover img {
    scale: 1.1;
    opacity: 0.3;
  }

  .can-hover:hover .hover-display {
    height: 100%;
    opacity: 1;
  }

  @media (max-aspect-ratio: 33/20) {

    main {
      display: grid;

      grid-auto-columns: 1fr;

      height: unset;
    }

    main > * {
      min-height: var(--vp-height);
    }

    #sidebar {
      grid-template-areas: 
        "heading  controls"
        "selected selected"
      ;

      font-size: max(0.75rem, 1.25vw);
    }

  }

  @media (max-aspect-ratio: 1)
    or (max-width: 480px) {

    #calendar {
      display: none;
    }

    #sidebar {
      grid-template-areas: 
        "heading"
        "controls"
        "selected"
      ;

      font-size: max(0.65rem, 2.5vw);
    }

  }

  @media (max-aspect-ratio: 2)
    and (min-width: 300px) 
    and (max-width: 480px)  {

    #sidebar {
      font-size: max(0.75rem, 2.5vw);
    }

  }

</style>