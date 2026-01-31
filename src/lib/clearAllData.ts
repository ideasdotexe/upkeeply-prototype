// Utility to clear all localStorage data for the app

export function clearAllUpkeeplyData(): void {
  // Get all keys from localStorage
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("upkeeply_")) {
      keysToRemove.push(key);
    }
  }
  
  // Remove all upkeeply keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`Cleared ${keysToRemove.length} upkeeply data entries:`, keysToRemove);
}

// Run immediately when this module is imported with ?clear query
if (typeof window !== "undefined") {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("clearData") === "true") {
    clearAllUpkeeplyData();
    // Remove the query param after clearing
    window.history.replaceState({}, "", window.location.pathname);
  }
}

