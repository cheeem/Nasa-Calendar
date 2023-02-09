<script lang="ts">

  import { 
    get_first_day, 
    get_last_day, 
    format_query_date, 
    format_month,
    get_offset_date,
  } from './utils/data.js'

  import svg_caret_up from './assets/Caret up.svg'
  import svg_caret_down from './assets/Caret down.svg'
  import loading from './assets/loader.gif';

  import { fade } from 'svelte/transition'

  const controller = new AbortController();
  const { signal } = controller;

  type APOD = {
    title: string
    date: string
    url: string
    hdurl: string
    copyright: string
    explanation: string
  }

  type QueryInput = {
    signal: AbortSignal
    first_day: Date
    max_day: Date
    offset: number
  }

  type PlaceholderDateRange = {
    length: number
    starting_index: number
  }
  
  const cache: APOD[][] = [];

  let offset: number = 0

  $: offset, (() => controller.abort)();

  let first_day: Date
  let last_day: Date
  let max_day: Date

  $: first_day = get_first_day(get_offset_date(offset))
  $: last_day =  get_last_day(get_offset_date(offset))
  $: max_day = last_day > new Date() ? new Date() : last_day

  let rows: number
  let calendar_start: number

  $: rows = Math.ceil((first_day.getDay() + last_day.getDate()) / 7)
  $: calendar_start = first_day.getDay() + 1 

  let loadingDateRange: PlaceholderDateRange
  let remainingDateRange: PlaceholderDateRange

  $: loadingDateRange = {
    length: max_day.getDate(),
    starting_index: 0,
  }

  $: remainingDateRange = {
    length: last_day.getDate() - max_day.getDate(),
    starting_index: max_day.getDate(),
  }

  let selected: APOD = {
    title: ``,
    date: ``,
    url: ``,
    hdurl: ``,
    copyright: ``,
    explanation: ``,
  }

  
  const query = async ({
    signal,
    first_day,
    max_day,
    offset,
  }: QueryInput): Promise<APOD[]> => { 

    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=hIZ20K4ftBKwN1AdggqcZxrIjiquLTRkQlhO611D&start_date=${format_query_date(first_day)}&end_date=${format_query_date(max_day)}`, { signal })

    const apods = await res.json()

    if(signal.aborted) return 

    if(!offset) selected = apods[apods.length-1]

    cache[offset] = apods

    return apods

  }

  const incrementOffset = (increment: number): number => offset += increment

</script>

<main>

  <div class="sidebar">

    <div class="heading"> 
      <h4> NASA Astronomy Picture of the Day Calendar</h4>
      {#key first_day}
      <h1> {format_month(first_day)} </h1>
      {/key}
    </div>
    
    <div class="controls"> 
      <button class="up {!offset && `disabled`}"
        on:click={() => incrementOffset(offset ? -1 : 0)}
        on:keydown={() => incrementOffset(offset ? -1 : 0)}
      >
        <img src={svg_caret_up} alt="" />
        <p> Next Month </p>
      </button>
      <button class="down"
        on:click={() => incrementOffset(1)}
        on:keydown={() => incrementOffset(1)}
      >
        <img src={svg_caret_down} alt="" />
        <p> Previous Month </p>
      </button>
    </div>

      <div class="info"> 
          <h2> {selected.title} </h2>
          <h5> {selected.copyright ?? ``} </h5>
          <div class="selected-display">
            {#key selected}
              <img src={selected.url} alt="" in:fade />
              <div class="hover-display"> 
                <p> {selected.explanation} </p>
              </div>
            {/key}
          </div>
      </div>
  
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
      
    {#each loadingDateRange as _, i}
      <li class="day" style={
        !i && `grid-column-start: ${calendar_start}
      `}>
        <p class="index"> {loadingDateRange.starting_index + i + 1} </p>
        <img src={loading} alt="" />
      </li>
    {/each}

    {:then apods}

      {#key offset}
        
        {#each apods as apod, i}
          <li class="day can-hover" in:fade style={
            !i && `grid-column-start: ${calendar_start}
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
    
    {#each remainingDateRange as _, i}
      <li class="day">    
        <p class="index"> {remainingDateRange.starting_index + i + 1} </p>
        <img alt="" />
      </li>
    {/each} 

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

  .heading * {
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

  .info {    
    display: flex;
    flex-direction: column;
    gap: 1em;

    margin-top: auto;
  }

  .info h2, .info h5 {
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

  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.6em;

    min-width: 50%;

    font-size: min(1.5vw, 2.2vh);
  }

  li {
    position: relative;

    border-radius: 0.5em;
  }

  .day-label {
    text-align: center;
    font-size: 1vw;
    font-weight: 600;
  }

  .day {
    overflow: hidden;

    aspect-ratio: 1;

    border: 0.1em solid var(--white);
  }

  .day p {
    text-shadow: 0 0 0.3em var(--dark);
  }

  .index {
    z-index: 2;

    position: absolute;
    top: 0.2em;
    left: 0.3em;

    transition: opacity 0.3s ease;
  }

  .can-hover:hover .index {
    opacity: 0;
  }

  .day img {
    z-index: 1;

    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: 0.5s ease;
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