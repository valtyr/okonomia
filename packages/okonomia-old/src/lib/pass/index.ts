import JSZip from 'jszip';
import { PKPass } from './format';
import * as forge from 'node-forge';

// Template URL
// 'https://github.com/valtyr/okonomia/blob/master/templates/costco.pkpass?raw=true'

/**
 * Create and sign a `.pkpass` based on a `.zip` template containing all assets
 *
 * @param templateUrl - publically accessible URL to a `.zip` file that
 *                      includes all required assets
 * @param pass        - datastructure defining the pass
 * @param certificate - the apple-provisioned certificate used to sign the pass
 * @param privateKey  - the private key used to sign the pass
 * @returns the `.pkpass` file as a buffer
 */
const generatePass = async (
  templateUrl: string,
  pass: PKPass,
  certificate: string | forge.pki.Certificate,
  privateKey: string | forge.pki.PrivateKey,
) => {
  // Fetch the template file
  const template = await fetch(templateUrl);
  const blob = await template.arrayBuffer();

  // Open the template file as .zip
  const zip = await JSZip.loadAsync(blob);

  // Remove the manifest, signature and pass.json files
  zip.remove('manifest.json');
  zip.remove('signature');
  zip.remove('pass.json');

  // Add new pass.json file
  zip.file('pass.json', JSON.stringify(pass));

  // Generate manifest.json file
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
  const manifestString = JSON.stringify(manifest);

  // Prepare certificate and keys
  const preparedCertificate =
    typeof certificate === 'string'
      ? forge.pki.certificateFromPem(certificate)
      : certificate;
  const preparedPrivateKey =
    typeof privateKey === 'string'
      ? forge.pki.privateKeyFromPem(privateKey)
      : privateKey;

  // Create signature
  const signature = signManifest(
    preparedCertificate,
    preparedPrivateKey,
    manifestString,
  );

  // Add the new manifest and signature
  zip.file('manifest.json', manifestString);
  zip.file('signature', signature);

  // Generate and return a buffer from the zip archive
  const buffer = await zip.generateAsync({
    type: 'uint8array',
  });
  return buffer;
};

export default generatePass;

const APPLE_CA_CERTIFICATE = forge.pki.certificateFromPem(
  `-----BEGIN CERTIFICATE-----
MIIEUTCCAzmgAwIBAgIQfK9pCiW3Of57m0R6wXjF7jANBgkqhkiG9w0BAQsFADBi
MQswCQYDVQQGEwJVUzETMBEGA1UEChMKQXBwbGUgSW5jLjEmMCQGA1UECxMdQXBw
bGUgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkxFjAUBgNVBAMTDUFwcGxlIFJvb3Qg
Q0EwHhcNMjAwMjE5MTgxMzQ3WhcNMzAwMjIwMDAwMDAwWjB1MUQwQgYDVQQDDDtB
cHBsZSBXb3JsZHdpZGUgRGV2ZWxvcGVyIFJlbGF0aW9ucyBDZXJ0aWZpY2F0aW9u
IEF1dGhvcml0eTELMAkGA1UECwwCRzMxEzARBgNVBAoMCkFwcGxlIEluYy4xCzAJ
BgNVBAYTAlVTMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2PWJ/KhZ
C4fHTJEuLVaQ03gdpDDppUjvC0O/LYT7JF1FG+XrWTYSXFRknmxiLbTGl8rMPPbW
BpH85QKmHGq0edVny6zpPwcR4YS8Rx1mjjmi6LRJ7TrS4RBgeo6TjMrA2gzAg9Dj
+ZHWp4zIwXPirkbRYp2SqJBgN31ols2N4Pyb+ni743uvLRfdW/6AWSN1F7gSwe0b
5TTO/iK1nkmw5VW/j4SiPKi6xYaVFuQAyZ8D0MyzOhZ71gVcnetHrg21LYwOaU1A
0EtMOwSejSGxrC5DVDDOwYqGlJhL32oNP/77HK6XF8J4CjDgXx9UO0m3JQAaN4LS
VpelUkl8YDib7wIDAQABo4HvMIHsMBIGA1UdEwEB/wQIMAYBAf8CAQAwHwYDVR0j
BBgwFoAUK9BpR5R2Cf70a40uQKb3R01/CF4wRAYIKwYBBQUHAQEEODA2MDQGCCsG
AQUFBzABhihodHRwOi8vb2NzcC5hcHBsZS5jb20vb2NzcDAzLWFwcGxlcm9vdGNh
MC4GA1UdHwQnMCUwI6AhoB+GHWh0dHA6Ly9jcmwuYXBwbGUuY29tL3Jvb3QuY3Js
MB0GA1UdDgQWBBQJ/sAVkPmvZAqSErkmKGMMl+ynsjAOBgNVHQ8BAf8EBAMCAQYw
EAYKKoZIhvdjZAYCAQQCBQAwDQYJKoZIhvcNAQELBQADggEBAK1lE+j24IF3RAJH
Qr5fpTkg6mKp/cWQyXMT1Z6b0KoPjY3L7QHPbChAW8dVJEH4/M/BtSPp3Ozxb8qA
HXfCxGFJJWevD8o5Ja3T43rMMygNDi6hV0Bz+uZcrgZRKe3jhQxPYdwyFot30ETK
XXIDMUacrptAGvr04NM++i+MZp+XxFRZ79JI9AeZSWBZGcfdlNHAwWx/eCHvDOs7
bJmCS1JgOLU5gm3sUjFTvg+RTElJdI+mUcuER04ddSduvfnSXPN/wmwLCTbiZOTC
NwMUGdXqapSqqdv+9poIZ4vvK7iqF0mDr8/LvOnP6pVxsLRFoszlh6oKw0E6eVza
UDSdlTs=
-----END CERTIFICATE-----`,
);

/**
 * Signs a manifest and returns the signature.
 *
 * @param certificate - signing certificate
 * @param key - certificate password
 * @param manifest - manifest to sign
 * @returns signature for given manifest
 */
export function signManifest(
  certificate: forge.pki.Certificate,
  key: forge.pki.PrivateKey,
  manifest: string,
): string {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = manifest;
  p7.addCertificate(certificate);
  p7.addCertificate(APPLE_CA_CERTIFICATE);
  p7.addSigner({
    key: forge.pki.privateKeyToPem(key),
    certificate,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime },
    ],
  });

  p7.sign({ detached: true });

  return forge.asn1.toDer(p7.toAsn1()).getBytes();
  // return Buffer.from(forge.asn1.toDer(p7.toAsn1()).getBytes(), 'binary');
}
