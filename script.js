document.getElementById('submitBtn').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value;
  if (!url) return;
  
  // Appends the entered URL as a query parameter
  const wrappedUrl = `${window.location.origin}${window.location.pathname}?target=${encodeURIComponent(url)}`;
  document.getElementById('result').textContent = wrappedUrl;
});
