fetch('../dist/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    const mainJsPath = manifest['main.js'].file;
    // Dynamically inject the scripts
    const script1 = document.createElement('script');
    script1.src = `.././${mainJsPath}`;
    document.head.appendChild(script1);
  });