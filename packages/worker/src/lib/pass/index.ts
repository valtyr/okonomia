import JSZip from 'jszip';
import { PKPass } from './format';
import * as forge from 'node-forge';
import { Buffer } from 'buffer';

// Template URL
// 'https://github.com/valtyr/okonomia/blob/master/templates/okonomia.pkpass?raw=true'

function hex(a: ArrayBuffer) {
  return [...new Uint8Array(a)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

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
  templateBuffer: ArrayBuffer,
  pass: PKPass,
  certificate: string,
  privateKey: string,
) => {
  // Open the template file as .zip
  const zip = await JSZip.loadAsync(templateBuffer);

  // Remove the manifest, signature and pass.json files
  zip.remove('manifest.json');
  zip.remove('signature');
  zip.remove('pass.json');

  const passText = `${JSON.stringify(pass)}\n`;

  // Add new pass.json file
  zip.file('pass.json', Buffer.from(passText));

  // Generate manifest.json file
  const files = Object.entries(zip.files);
  const manifestEntries = await Promise.all(
    files.map(async ([path, file]) => {
      const contents = await file.async('arraybuffer');
      const digest = await crypto.subtle.digest('SHA-1', contents);
      const hash = hex(digest);
      return [path, hash];
    }),
  );

  const manifest = Object.fromEntries(manifestEntries);
  const manifestString = JSON.stringify(manifest);

  // Prepare certificate and keys
  const preparedCertificate = forge.pki.certificateFromPem(certificate);

  // Prepare certificate and keys
  const preparedKey = forge.pki.privateKeyFromPem(privateKey);

  // Create signature
  const signature = signManifest(
    preparedCertificate,
    preparedKey,
    manifestString,
  );

  // Add the new manifest and signature
  zip.file('manifest.json', manifestString);
  zip.file('signature', signature);

  // Generate and return a buffer from the zip archive
  const buffer = await zip.generateAsync({
    type: 'arraybuffer',
  });
  return buffer;
};

export default generatePass;

const APPLE_CA_CERTIFICATE = forge.pki.certificateFromPem(
  `-----BEGIN CERTIFICATE-----
MIIEIjCCAwqgAwIBAgIIAd68xDltoBAwDQYJKoZIhvcNAQEFBQAwYjELMAkGA1UE
BhMCVVMxEzARBgNVBAoTCkFwcGxlIEluYy4xJjAkBgNVBAsTHUFwcGxlIENlcnRp
ZmljYXRpb24gQXV0aG9yaXR5MRYwFAYDVQQDEw1BcHBsZSBSb290IENBMB4XDTEz
MDIwNzIxNDg0N1oXDTIzMDIwNzIxNDg0N1owgZYxCzAJBgNVBAYTAlVTMRMwEQYD
VQQKDApBcHBsZSBJbmMuMSwwKgYDVQQLDCNBcHBsZSBXb3JsZHdpZGUgRGV2ZWxv
cGVyIFJlbGF0aW9uczFEMEIGA1UEAww7QXBwbGUgV29ybGR3aWRlIERldmVsb3Bl
ciBSZWxhdGlvbnMgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQDKOFSmy1aqyCQ5SOmM7uxfuH8mkbw0U3rOfGOA
YXdkXqUHI7Y5/lAtFVZYcC1+xG7BSoU+L/DehBqhV8mvexj/avoVEkkVCBmsqtsq
Mu2WY2hSFT2Miuy/axiV4AOsAX2XBWfODoWVN2rtCbauZ81RZJ/GXNG8V25nNYB2
NqSHgW44j9grFU57Jdhav06DwY3Sk9UacbVgnJ0zTlX5ElgMhrgWDcHld0WNUEi6
Ky3klIXh6MSdxmilsKP8Z35wugJZS3dCkTm59c3hTO/AO0iMpuUhXf1qarunFjVg
0uat80YpyejDi+l5wGphZxWy8P3laLxiX27Pmd3vG2P+kmWrAgMBAAGjgaYwgaMw
HQYDVR0OBBYEFIgnFwmpthhgi+zruvZHWcVSVKO3MA8GA1UdEwEB/wQFMAMBAf8w
HwYDVR0jBBgwFoAUK9BpR5R2Cf70a40uQKb3R01/CF4wLgYDVR0fBCcwJTAjoCGg
H4YdaHR0cDovL2NybC5hcHBsZS5jb20vcm9vdC5jcmwwDgYDVR0PAQH/BAQDAgGG
MBAGCiqGSIb3Y2QGAgEEAgUAMA0GCSqGSIb3DQEBBQUAA4IBAQBPz+9Zviz1smwv
j+4ThzLoBTWobot9yWkMudkXvHcs1Gfi/ZptOllc34MBvbKuKmFysa/Nw0Uwj6OD
Dc4dR7Txk4qjdJukw5hyhzs+r0ULklS5MruQGFNrCk4QttkdUGwhgAqJTleMa1s8
Pab93vcNIx0LSiaHP7qRkkykGRIZbVf1eliHe2iK5IaMSuviSRSqpd1VAKmuu0sw
ruGgsbwpgOYJd+W+NKIByn/c4grmO7i77LpilfMFY0GCzQ87HUyVpNur+cmV6U/k
TecmmYHpvPm0KdIBembhLoz2IYrF+Hjhga6/05Cdqa3zr/04GpZnMBxRpVzscYqC
tGwPDBUf
-----END CERTIFICATE-----`,
);

/**
 * Signs a manifest and returns the signature.
 *
 * @param {import('node-forge').pki.Certificate} certificate - signing certificate
 * @param {import('node-forge').pki.PrivateKey} key - certificate password
 * @param {string} manifest - manifest to sign
 * @returns {Buffer} - signature for given manifest
 */
export function signManifest(
  certificate: forge.pki.Certificate,
  key: forge.pki.PrivateKey,
  manifest: string,
): Buffer {
  // create PKCS#7 signed data
  const p7 = forge.pkcs7.createSignedData();
  p7.content = manifest;
  p7.addCertificate(certificate);
  p7.addCertificate(APPLE_CA_CERTIFICATE);
  p7.addSigner({
    key: forge.pki.privateKeyToPem(key),
    certificate,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      {
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data,
      },
      {
        type: forge.pki.oids.messageDigest,
        // value will be auto-populated at signing time
      },
      {
        type: forge.pki.oids.signingTime,
        // value will be auto-populated at signing time
        // value: new Date('2050-01-01T00:00:00Z')
      },
    ],
  });
  /**
   * Creating a detached signature because we don't need the signed content.
   */
  p7.sign({ detached: true });

  return Buffer.from(forge.asn1.toDer(p7.toAsn1()).getBytes(), 'binary');
}
