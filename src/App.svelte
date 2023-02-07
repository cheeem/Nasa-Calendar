<script>

  //import svgs
  import svg_home from './svg/Home.svg';
  import svg_error1 from './svg/Error1.svg';
  import svg_error2 from './svg/Error2.svg';
  import svg_cards from './svg/Contacts.svg';
  import svg_inventory from './svg/Stack.svg';
  import svg_purchases from './svg/Shopping-cart.svg';
  import svg_trades from './svg/Exchange.svg';
  import svg_highbots from './svg/User.svg';

  //import pages
  import Home from './pages/Home.svelte';
  import Critical from './pages/Critical.svelte';
  import PriceErrors from './pages/PriceErrors.svelte';
  import Cards from './pages/Cards.svelte';

  //import nav
  import Nav from './Nav.svelte';

  //define nav tabs
  const tabs = [
    {
      label: 'Home',
      page: Home,
      svg: svg_home,
    },
    {
      label: 'Critical',
      page: Critical,
      svg: svg_error1,
    },
    {
      label: 'Price Errors',
      page: PriceErrors,
      svg: svg_error2,
    },
    // {
    //   label: 'Cards',
    //   page: Cards,
    //   svg: svg_cards,
    // },
    {
      label: 'Inventory',
      page: PriceErrors,
      svg: svg_inventory,
    },
    {
      label: 'Purchases',
      page: PriceErrors,
      svg: svg_purchases,
    },
    {
      label: 'Trades',
      page: PriceErrors,
      svg: svg_trades,
    },
    {
      label: 'Highbots',
      page: PriceErrors,
      svg: svg_highbots,
    },
  ];

  //set initial active index state
  let active = 0;

  //when called, set the active index to the selected tab index
  const setActive = i => { if(active !== i) active = i };

</script>

<main>

  <Nav {tabs} {active} {setActive} />
  
  <svelte:component this={tabs[active].page} />

</main>

<style>
  
  main {
    overflow: auto;

    position: relative;

    display: flex;
  }

</style>

