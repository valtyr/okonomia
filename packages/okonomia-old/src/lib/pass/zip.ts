import JSZip from 'jszip';

export const generateZip = async () => {
  const template = await fetch(
    'https://github.com/valtyr/okonomia/blob/master/templates/costco.pkpass?raw=true',
  );

  const blob = await template.arrayBuffer();

  const zip = await JSZip.loadAsync(blob);
  zip.remove('manifest.json');

  const files = Object.entries(zip.files);
  const manifestEntries = await Promise.all(
    files.map(async ([path, file]) => {
      const contents = await file.async('uint8array');
      const digest = await crypto.subtle.digest({ name: 'SHA-1' }, contents);

      const hash = [...new Uint8Array(digest)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');

      return [path, hash];
    }),
  );
  const manifest = Object.fromEntries(manifestEntries);

  zip.file('manifest.json', JSON.stringify(manifest));

  const buffer = await zip.generateAsync({
    type: 'uint8array',
  });
  return buffer;
};
