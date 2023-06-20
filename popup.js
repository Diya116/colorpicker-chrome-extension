const btn = document.querySelector("#btn");
const colorGrid = document.querySelector(".colorgrid");
const colorValue = document.querySelector(".colorvalue");
const infotext = document.querySelector(".infotext");
btn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log("color: ", color);
  });
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: pickColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;
      console.log(data);
      if (data.result) {
        const color = data.result.sRGBHex;
        colorGrid.style.backgroundColor = color;
        colorValue.innerText = color;
        
        
        try {
          await navigator.clipboard.writeText(color);
          infotext.innerText = "Copied to clipboard";
     
        } catch (err) {
          console.error(err);
        }
        setTimeout(() => {
            infotext.innerText = "";
          }, 5000);
      }
    }
  );
});

async function pickColor() {
  try {
    // Picker
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.error(err);
  }
}
