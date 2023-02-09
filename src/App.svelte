<script lang="ts">

  import { 
    get_first_day, 
    get_last_day, 
    format_query_date, 
    get_offset_date,
  } from './utils/data.js'

  import Heading from './Sidebar/Heading.svelte';
  import Controls from './Sidebar/Controls.svelte'
  import Selected from './Sidebar/Selected.svelte'

  import DateRange from './Calendar/DateRange.svelte';

  import { fade } from 'svelte/transition'

  const controller = new AbortController()
  const { signal } = controller;

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

  type DateRangeArguments = {
    length: number
    starting_index: number
    get_style: Function
    date: Date
    loading: boolean
  }
  
  const cache: APOD[][] = []

  let offset: number = 0

  $: offset, (() => controller.abort)();

  let first_day: Date
  let last_day: Date
  let max_day: Date

  $: first_day = get_first_day(get_offset_date(offset))
  $: last_day =  get_last_day(get_offset_date(offset))
  $: max_day = last_day > new Date() ? new Date() : last_day

  let rows: number

  $: rows = Math.ceil((first_day.getDay() + last_day.getDate()) / 7)

  let selected: APOD = {
    title: ``,
    date: ``,
    url: ``,
    hdurl: ``,
    copyright: ``,
    explanation: ``,
  }

  let loading_arguments: DateRangeArguments
  let remaining_arguments: DateRangeArguments

  $: loading_arguments = {
    length: max_day.getDate(),
    starting_index: 0,
    get_style: ({ i, date, }) => !i && `grid-column-start: ${date.getDay() + 1}`,
    date: first_day,
    loading: true,
  }

  $: remaining_arguments = {
    length: last_day.getDate() - max_day.getDate(),
    starting_index: max_day.getDate(),
    get_style: ({}) => ``,
    date: first_day,
    loading: false,
  }

  const query = async ({
    signal,
    first_day,
    max_day,
    offset,
  }: QueryArguments): Promise<APOD[]> => { 

    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=hIZ20K4ftBKwN1AdggqcZxrIjiquLTRkQlhO611D&start_date=${format_query_date(first_day)}&end_date=${format_query_date(max_day)}`, { signal })

    const apods = await res.json()

    if(signal.aborted) return 

    if(!offset) selected = apods[apods.length-1]

    cache[offset] = apods

    return apods

  }

  const increment_offset = (increment: number): number => offset += increment

</script>

<main>


  <div class="sidebar">

    <Heading date={first_day} />
    
    <Controls {offset} {increment_offset} />
  
    <Selected {selected} />
  
  </div>

  <ol class="calendar" style={`
    grid-template-rows: 6vh repeat(${rows}, 1fr);
  `}>

    <li class="day-label">Sunday</li>
    <li class="day-label">Monday</li>
    <li class="day-label">Tueday</li>
    <li class="day-label">Wednesday</li>
    <li class="day-label">Thursday</li>
    <li class="day-label">Friday</li>
    <li class="day-label">Saturday</li>

    {#await cache?.[offset] ?? query({
      signal, 
      first_day, 
      max_day, 
      offset,
    })}
      
    <DateRange {...loading_arguments} />

    {:then apods}

      {#key offset}
        
        {#each apods as apod, i}
          <li class="day can-hover" in:fade style={
            !i && `grid-column-start: ${first_day.getDay() + 1}
          `}
            on:click={() => selected = apod}
            on:keydown={() => selected = apod}
          >
            <p class="index"> {i + 1} </p> 
            <img src={apod.url} alt="" />
            <div class="hover-display"> 
              <p class="title"> {apod.title} </p>
              <p class="date"> {apod.date} </p>
            </div>
          </li>
        {/each} 

      {/key}

    {/await}
    
    <DateRange {...remaining_arguments} />

  </ol>

</main>

<style>

  main {
    overflow: hidden;

    position: relative;

    display: flex;
    justify-content: space-between;
    gap: 6.5vw;

    height: 100vh;

    padding: 4vh 6.5vw;

    background-color: var(--dark);
    background-image: url(./assets/background.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5em;

    width: 22.5vw;

    font-size: 1vw;
  }

  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.6em;

    min-width: 50%;

    font-size: min(1.5vw, 2.2vh);
  }

  .day-label {
    text-align: center;
    font-size: 1vw;
    font-weight: 600;
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

</style>