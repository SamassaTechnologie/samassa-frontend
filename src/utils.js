export function waitForImagesToLoad(container) {
  const imgs = Array.from(container.querySelectorAll("img"));
  return Promise.all(imgs.map(img => {
    return new Promise(resolve => {
      if (img.complete) return resolve();
      img.onload = img.onerror = resolve;
    });
  }));
}

export function genNumero(prefix="X") {
  // simple unique id format: PREFIX-yyyymmdd-HHMMSS-ms
  const d = new Date();
  const s = `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}-${d.getHours().toString().padStart(2,'0')}${d.getMinutes().toString().padStart(2,'0')}${d.getSeconds().toString().padStart(2,'0')}-${d.getMilliseconds()}`;
  return `${prefix}-${s}`;
}
