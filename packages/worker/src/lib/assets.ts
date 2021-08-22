const parseStringAsObject = <T>(maybeString: string | T): T =>
  typeof maybeString === 'string'
    ? (JSON.parse(maybeString) as T)
    : maybeString;

export async function fetchAsset(assetPath: string, env: Env) {
  const siteAssetPath2KvKey =
    parseStringAsObject(env.__STATIC_CONTENT_MANIFEST) || {};
  //   console.log(siteAssetPath2KvKey);
  //   console.log(await env.__STATIC_CONTENT.list());
  const pageKey = siteAssetPath2KvKey[assetPath] || assetPath;

  const body = await env.__STATIC_CONTENT.get(pageKey, 'arrayBuffer');
  if (!body) {
    throw new Error('Null asset found in __STATIC_CONTENT for: ' + assetPath);
  }
  return body;
}
