// DOM elements
const scriptList = document.getElementById("script-list");
const scriptInput = document.getElementById("script-input");
const addScriptButton = document.getElementById("add-script");

// Function to load scripts from chrome.storage.local
function loadScripts() {
  console.debug("[Popup] Loading scripts from chrome.storage.local...");

  chrome.storage.local.get("customScripts", (result) => {
    const scripts = result.customScripts || [];
    scriptList.innerHTML = ""; // Clear the list

    if (scripts.length === 0) {
      scriptList.innerHTML = `<p>No scripts saved yet. Add a new script to get started.</p>`;
      console.debug("[Popup] No scripts found in chrome.storage.local.");
      return;
    }

    console.debug(`[Popup] Found ${scripts.length} script(s).`, scripts);
    scripts.forEach((script, index) => {
      const scriptItem = document.createElement("div");
      scriptItem.className = "script-item";
      scriptItem.innerHTML = `
        <textarea data-index="${index}" class="script-text">${script}</textarea>
        <div>
          <button class="edit-button" data-index="${index}">Save</button>
          <button class="delete-button" data-index="${index}">Delete</button>
        </div>
      `;
      scriptList.appendChild(scriptItem);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const newScript = document.querySelector(`textarea[data-index="${index}"]`).value.trim();
        if (!newScript) {
          alert("Script cannot be empty.");
          return;
        }
        updateScript(index, newScript);
      });
    });

    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (confirm("Are you sure you want to delete this script?")) {
          deleteScript(index);
        }
      });
    });
  });
}

// Function to add a new script to chrome.storage.local
function addScript() {
  const newScript = scriptInput.value.trim();
  if (!newScript) {
    alert("Please enter a JavaScript script.");
    return;
  }

  chrome.storage.local.get("customScripts", (result) => {
    const scripts = result.customScripts || [];
    scripts.push(newScript);

    chrome.storage.local.set({ customScripts: scripts }, () => {
      console.debug("[Popup] Added new script:", newScript);
      scriptInput.value = ""; // Clear the input
      loadScripts(); // Reload the list
      alert("Script added successfully!");
    });
  });
}

// Function to update an existing script in chrome.storage.local
function updateScript(index, newScript) {
  chrome.storage.local.get("customScripts", (result) => {
    const scripts = result.customScripts || [];
    scripts[index] = newScript;

    chrome.storage.local.set({ customScripts: scripts }, () => {
      console.debug(`[Popup] Updated script at index ${index}:`, newScript);
      loadScripts(); // Reload the list
      alert("Script updated successfully!");
    });
  });
}

// Function to delete a script from chrome.storage.local
function deleteScript(index) {
  chrome.storage.local.get("customScripts", (result) => {
    const scripts = result.customScripts || [];
    const deletedScript = scripts[index];
    scripts.splice(index, 1);

    chrome.storage.local.set({ customScripts: scripts }, () => {
      console.debug(`[Popup] Deleted script at index ${index}:`, deletedScript);
      loadScripts(); // Reload the list
      alert("Script deleted successfully!");
    });
  });
}

// Add event listeners
addScriptButton.addEventListener("click", addScript);

// Initial load
document.addEventListener("DOMContentLoaded", loadScripts);
