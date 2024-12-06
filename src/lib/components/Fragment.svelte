<script>
  import { marked } from "marked";

  export let index;
  export let fragment;

  let element;
  let taken;
  let url;

  function imagize(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded successfully:", {
          width: img.width,
          height: img.height,
          complete: img.complete,
        });
        resolve(img);
      };
      img.onerror = (e) => {
        reject(e.message);
      };
      img.src = URL.createObjectURL(blob);
    });
  }

  async function canvasize() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const bounding = element.getBoundingClientRect();
    const height = bounding.height + 100;
    const width = bounding.width;
    const scale = window.devicePixelRatio;
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.scale(scale, scale);

    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");

    const markup = `
      <svg xmlns="http://www.w3.org/2000/svg" height="${height}px" width="${width}px">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <style>${styles}</style>
            <div class="bg">
              ${element.outerHTML}
              <p><em>From “Seventeen Fragments (After Ross)” by John West</em></p>
            </div>
          </div>
        </foreignObject>
      </svg>
    `;

    const blob = new Blob([markup], { type: "image/svg+xml" });
    const text = await blob.text();
    const img = await imagize(blob);

    context.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  }
</script>

<div class="Fragment {taken ? 'taken' : ''}">
  <div class="guts">
    <p class="index">{index + 1}.</p>
    <div class="fragment-body" bind:this={element}>
      {@html marked(fragment)}
    </div>
  </div>
  <button
    on:click={async () => {
      url = await canvasize();
      if (navigator.share) {
        // Convert data URL to blob correctly
        const byteString = atob(url.split(",")[1]);
        const mimeString = url.split(",")[0].split(":")[1].split(";")[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], `fragment-${index + 1}.png`, {
          type: "image/png",
        });

        try {
          await navigator.share({
            files: [file],
            title: `Fragment ${index + 1}`,
          });
          taken = true;
        } catch (shareError) {
          console.error("Share error:", shareError);
        }
      } else {
        const link = document.createElement("a");
        link.download = `fragment-${index + 1}.png`;
        link.href = url;
        link.click();
        taken = true;
      }
    }}>Take.</button
  >
</div>

<style>
  .Fragment {
    background-color: white;
    border: 1px dotted black;
    box-sizing: border-box;
    margin-bottom: 60px;
    padding: 10px 20px 20px 20px;
  }
  .Fragment.taken {
    opacity: 0.25;
  }
  .Fragment p {
    margin-bottom: calc(var(--unit) * 1.5);
  }
  .Fragment p.index {
    font-style: italic;
    font-size: calc(var(--unit) * 2);
    font-weight: 300;
  }
  button {
    background-color: transparent;
    border: none;
    border-bottom: 1px dotted black;
    cursor: pointer;
    font-family: "Cormorant Garamond";
    font-size: calc(var(--unit) * 0.75);
    letter-spacing: calc(var(--unit) * 0.75 * 0.1);
    text-transform: uppercase;
  }
</style>
