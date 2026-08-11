// Automatically handles redirection if a target parameter exists
const urlParams = new URLSearchParams(window.location.search);
const targetUrl = urlParams.get('target');

if (targetUrl) {
  // Redirect directly to the wrapped target link
  window.location.href = decodeURIComponent(targetUrl);
} else {
  // If no target, set up the wrapping generator UI
  document.getElementById('submitBtn').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return;
    
    // Formats URL with protocol if missing
    const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const wrappedUrl = `${window.location.origin}${window.location.pathname}?target=${encodeURIComponent(formattedUrl)}`;
    
    document.getElementById('result').innerHTML = `<a href="${wrappedUrl}" target="_blank">${wrappedUrl}</a>`;
  });
}
