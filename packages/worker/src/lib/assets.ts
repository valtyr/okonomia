export async function fetchAsset(assetPath: string, env: Env) {
  const body = await env.ASSETS.get(assetPath, 'arrayBuffer');
  if (!body) {
    throw new Error('Null asset found for: ' + assetPath);
  }
  return body;
}
