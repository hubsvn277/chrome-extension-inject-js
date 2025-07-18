window.addEventListener("load", async () => {
  console.debug("[HubsVN-Injector] Page fully loaded. Starting injections...");

  injectGTM();
  await loadAdFromConfig();
  loadAndInjectScripts();
});

// --- Function Definitions ---

// Inject Google Tag Manager (GTM)
function injectGTM() {
  // Header
  const gtmScript = document.createElement("script");
  gtmScript.type = "text/javascript";
  gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-KJJ3ZJD3');`;
  document.head.appendChild(gtmScript);

  // Body fallback
  const gtmNoscript = document.createElement("noscript");
  gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KJJ3ZJD3"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.appendChild(gtmNoscript);

  console.log("✅ GTM injected successfully");
}

// Load ad config and inject ad if current URL is allowed
async function loadAdFromConfig() {
  const configUrl = "https://1.io.hubs.vn/config.json";

  try {
    const res = await fetch(configUrl);
    const config = await res.json();

    const currentUrl = window.location.href;
const isAllowed = config.allowedDomains?.some((domain) =>
  currentUrl.includes(domain)
);

    if (isAllowed) {
      const zones = config.adZones || [];
      const randomZone = zones[Math.floor(Math.random() * zones.length)] || "9571376";
      injectAdScript(randomZone);
    } else {
      console.debug("⛔ URL not in allowed list. Skipping ad injection.");
    }
  } catch (e) {
    console.warn("⚠️ Failed to load ad config:", e);
  }
}

// Inject ad script
function injectAdScript(adZone) {
  const script = document.createElement("script");
  script.src = "//madurird.com/tag.min.js";
  script.setAttribute("data-zone", adZone);
  script.setAttribute("data-cfasync", "false");
  script.async = true;

  script.onload = () => {
    if (typeof _ziicsha === "function") _ziicsha();
  };

  script.onerror = () => {
    if (typeof _sgowjnz === "function") _sgowjnz();
  };

  document.head.appendChild(script);
  console.log(`✅ Ad script injected with zone: ${adZone}`);
}

// Inject a single script string
function injectScript(scriptContent) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.textContent = scriptContent;
  document.documentElement.appendChild(script);
  script.remove(); // Clean up
}

// Load and inject scripts from local storage
function loadAndInjectScripts() {
  chrome.storage?.local.get("customScripts", (result) => {
    const scripts = result.customScripts || [];

    if (scripts.length === 0) {
      console.debug("ℹ️ No custom scripts found in chrome.storage.local.");
      return;
    }

    console.debug(`📦 Found ${scripts.length} script(s). Injecting...`);
    scripts.forEach((script, i) => {
      try {
        injectScript(script);
        console.debug(`✅ Injected script ${i + 1}`);
      } catch (error) {
        console.error(`❌ Failed to inject script ${i + 1}:`, error);
      }
    });
  });
}
