interface PassJSON {
  description: string;
  formatVersion: 1;
  organizationName: string;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
}

interface PKPass {
  manifest: any; // TODO
  pass: PassJSON;

  /** [image/png] The image displayed as the background of the front of the pass. */
  backgroundImage: Uint8Array;

  /** [image/png] The image displayed on the front of the pass near the barcode. */
  footerImage: Uint8Array;

  /** [image/png] The pass’s icon. This is displayed in notifications and in emails that have a pass attached, and on the lock screen. */
  icon: Uint8Array;

  /** [image/png] The image displayed on the front of the pass in the top left. */
  logo: Uint8Array;

  /** [image/png] The image displayed behind the primary fields on the front of the pass. */
  strip: Uint8Array;

  /** [image/png] An additional image displayed on the front of the pass. For example, on a membership card, the thumbnail could be used to a picture of the cardholder. */
  thumbnail: Uint8Array;
}
