<script>
  import Fragment from "$lib/components/Fragment.svelte";
  import texts from "$lib/texts.md?raw";

  const fragments = texts
    .split("\n\n")
    .map((fragment) => {
      return fragment.split("\n").map((graf) => graf.trim()).join("\n\n");
    })
    .filter(Boolean);
</script>

<div class="Page">
  <h1 class="title">Seventeen Fragments</h1>
  <h1 class="title">(After Ross)</h1>
  <h2 class="byline">By John West</h2>
  <div class="content">
    {#each fragments as fragment, index}
      <Fragment {index} {fragment} />
    {/each}
  </div>
</div>

<style>
  .Page {
    box-sizing: border-box;
    margin: calc(var(--unit) * 2) auto;
    max-width: 600px;
    padding: var(--unit);
    width: 100%;
  }
  h1.title {
    font-family: "Cormorant Garamond";
    font-size: calc(var(--unit) * 4);
    font-weight: 700;
    line-height: calc(var(--unit) * 4);;
    margin-bottom: 0;
    transform-origin: 0 0;
    transform: scaleX(70%);
    width: calc(100% * 1.25);
  }
  h2.byline {
    font-family: "Cormorant Garamond";
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2px;
    line-height: 20px;
    margin-bottom: 60px;
    margin-top: var(--unit);
    text-transform: uppercase;
  }
</style>
