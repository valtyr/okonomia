type DataDetectorType =
  | 'PKDataDetectorTypePhoneNumber'
  | 'PKDataDetectorTypeLink'
  | 'PKDataDetectorTypeAddress'
  | 'PKDataDetectorTypeCalendarEvent';

type TextAlignment =
  | 'PKTextAlignmentLeft'
  | 'PKTextAlignmentCenter'
  | 'PKTextAlignmentRight'
  | 'PKTextAlignmentNatural';

type TransitType =
  | 'PKTransitTypeAir'
  | 'PKTransitTypeBoat'
  | 'PKTransitTypeBus'
  | 'PKTransitTypeGeneric'
  | 'PKTransitTypeTrain';

type BarcodeFormat =
  | 'PKBarcodeFormatQR'
  | 'PKBarcodeFormatPDF417'
  | 'PKBarcodeFormatAztec';

type DateStyle =
  | 'PKDateStyleNone'
  | 'PKDateStyleShort'
  | 'PKDateStyleMedium'
  | 'PKDateStyleLong'
  | 'PKDateStyleFull';

type NumberStyle =
  | 'PKNumberStyleDecimal'
  | 'PKNumberStylePercent'
  | 'PKNumberStyleScientific'
  | 'PKNumberStyleSpellOut';

interface PrimaryField {
  /**
   * The key must be unique within the scope of the entire pass. For example, "departure-gate."
   */
  key: string;

  /**
   * Label text for the field.
   */
  label?: string;

  /**
   * Value of the field, for example, `42`.
   */
  value: string;

  /**
   * Format string for the alert text that is displayed when the pass is updated. The
   * format string must contain the escape `%@`, which is replaced with the field’s new
   * value. For example, `"Gate changed to %@."`
   *
   * If you don’t specify a change message, the user isn’t notified when the field changes.
   */
  changeMessage?: string;

  /**
   * Attributed value of the field. The value may contain HTML markup for links.
   * Only the `<a>` tag and its href attribute are supported. For example, the
   * following is key-value pair specifies a link with the text "Edit my profile":
   *
   * ```json
   *   "attributedValue": "<a href='http://example.com/customers/123'>Edit my profile</a>"
   * ```
   *
   * This key’s value overrides the text specified by the value key.
   *
   * Available in iOS 7.0.
   */
  attributedValue?: string;

  /**
   * Style of date to display.
   */
  dateStyle?: DateStyle;

  /**
   * Always display the time and date in the given time zone, not in the user’s current time zone.
   * The default value is `false`.
   *
   * The format for a date and time always requires a time zone, even if it will be ignored. For
   * backward compatibility with iOS 6, provide an appropriate time zone, so that the information
   * is displayed meaningfully even without ignoring time zones.
   *
   * This key does not affect how relevance is calculated.
   *
   * Available in iOS 7.0.
   */
  ignoresTimeZone?: boolean;

  /**
   * If `true`, the label’s value is displayed as a relative date; otherwise, it is displayed as an
   * absolute date. The default value is `false`.
   *
   * This key does not affect how relevance is calculated.
   */
  isRelative?: boolean;

  /**
   * Style of time to display.
   */
  timeStyle?: DateStyle;

  /**
   * ISO 4217 currency code for the field’s value.
   */
  currencyCode?: string;

  /**
   * Style of number to display.
   *
   * Number styles have the same meaning as the Cocoa number formatter styles with corresponding names.
   * For more information, @see {@link https://developer.apple.com/documentation/foundation/nsnumberformatterstyle NSNumberFormatterStyle}.
   */
  numberStyle?: NumberStyle;
}

interface BackField extends PrimaryField {
  /**
   * Data detectors that are applied to the field’s value.
   *
   * The default value is all data detectors. Provide an empty array to use no data detectors.
   */
  dataDetectorTypes?: DataDetectorType[];
}

interface SecondaryField extends PrimaryField {
  /**
   * Alignment for the field’s contents.
   *
   * The default value is natural alignment, which aligns the text appropriately based on its
   * script direction.
   *
   * This key is not allowed for primary fields or back fields.
   */
  textAlignment?: TextAlignment;
}

interface AuxiliaryField extends PrimaryField {
  textAlignment?: TextAlignment;
}

interface Beacon {
  /**
   * Major identifier of a Bluetooth Low Energy location beacon.
   */
  major?: number;

  /**
   * Minor identifier of a Bluetooth Low Energy location beacon.
   */
  minor?: number;

  /**
   * Unique identifier of a Bluetooth Low Energy location beacon.
   */
  proximityUUID?: string;

  /**
   * Text displayed on the lock screen when the pass is currently relevant. For example,
   * a description of the nearby location such as "Store nearby on 1st and Main."
   */
  relevantText?: string;
}

interface Location {
  /**
   * Latitude, in degrees, of the location.
   */
  latitude: number;

  /**
   * Longitude, in degrees, of the location.
   */
  longitude: number;

  /**
   * Text displayed on the lock screen when the pass is currently relevant. For example,
   * a description of the nearby location such as "Store nearby on 1st and Main."
   */
  relevantText?: string;

  /**
   * Altitude, in meters, of the location.
   */
  altitude?: number;
}

interface GenericStyleKeys {
  /**
   * Additional fields to be displayed on the front of the pass.
   */
  auxiliaryFields?: AuxiliaryField[];

  /**
   * Fields to be on the back of the pass.
   */
  backFields?: BackField[];

  /**
   * Fields to be displayed in the header on the front of the pass.
   *
   * Use header fields sparingly; unlike all other fields, they remain
   * visible when a stack of passes are displayed.
   */
  headerFields?: PrimaryField;

  /**
   * Fields to be displayed prominently on the front of the pass.
   */
  primaryFields?: PrimaryField[];

  /**
   * Fields to be displayed on the front of the pass.
   */
  secondaryFields?: SecondaryField[];
}

interface TransitStyleKeys extends GenericStyleKeys {
  /**
   * Required for boarding passes; otherwise not allowed. Type of transit.
   */
  transitType: TransitType;
}

interface NFC {
  /**
   * The payload to be transmitted to the Apple Pay terminal. Must be 64 bytes or
   * less. Messages longer than 64 bytes are truncated by the system.
   */
  message: string;

  /**
   * The public encryption key used by the Value Added Services protocol. Use a Base64
   * encoded X.509 SubjectPublicKeyInfo structure containing a ECDH public key for group P256.
   */
  encryptionPublicKey?: string;
}

interface Barcode {
  /**
   * Text displayed near the barcode. For example, a human-readable version
   * of the barcode data in case the barcode doesn’t scan.
   */
  altText?: string;

  /**
   * Barcode format. For the barcode dictionary, you can use only the following
   * values: PKBarcodeFormatQR, PKBarcodeFormatPDF417, or PKBarcodeFormatAztec.
   * For dictionaries in the barcodes array, you may also use PKBarcodeFormatCode128.
   */
  format: BarcodeFormat;

  /**
   * Message or payload to be displayed as a barcode.
   */
  message: string;

  /**
   * Text encoding that is used to convert the message from the string representation
   * to a data representation to render the barcode. The value is typically iso-8859-1,
   * but you may use another encoding that is supported by your barcode scanning infrastructure.
   */
  messageEncoding: string;
}

export interface PKPass {
  // Standard Keys

  /**
   * Brief description of the pass, used by the iOS accessibility technologies.
   *
   * Don’t try to include all of the data on the pass in its description, just
   * include enough detail to distinguish passes of the same type.
   */
  description: string;

  /**
   * Version of the file format. The value must be 1.
   */
  formatVersion: 1;

  /**
   * Display name of the organization that originated and signed the pass.
   */
  organizationName: string;

  /**
   * Pass type identifier, as issued by Apple. The value must correspond with
   * your signing certificate.
   */
  passTypeIdentifier: string;

  /**
   * Serial number that uniquely identifies the pass. No two passes with the
   * same pass type identifier may have the same serial number.
   */
  serialNumber: string;

  /**
   * Team identifier of the organization that originated and signed the pass,
   * as issued by Apple.
   */
  teamIdentifier: string;

  // Associated App Keys

  /**
   * A URL to be passed to the associated app when launching it.
   * The app receives this URL in the `application:didFinishLaunchingWithOptions:`
   * and `application:openURL:options:` methods of its app delegate.
   *
   * If this key is present, the associatedStoreIdentifiers key must also be present.
   */
  appLaunchURL?: string;

  /**
   * A list of iTunes Store item identifiers for the associated apps.
   *
   * Only one item in the list is used—the first item identifier for an app compatible
   * with the current device. If the app is not installed, the link opens the App Store
   * and shows the app. If the app is already installed, the link launches the app.
   */
  associatedStoreIdentifiers?: number[];

  // Companion App Keys

  /**
   * Custom information for companion apps. This data is not displayed to the user.
   *
   * For example, a pass for a cafe could include information about the user’s favorite
   * drink and sandwich in a machine-readable form for the companion app to read, making
   * it easy to place an order for "the usual" from the app.
   *
   * Available in iOS 7.0.
   */
  userInfo?: any;

  // Expiration Keys

  /**
   * Date and time when the pass expires.
   *
   * The value must be a complete date with hours and minutes, and may optionally include
   * seconds.
   *
   * Available in iOS 7.0.
   */
  expirationDate?: Date;

  /**
   * Indicates that the pass is void—for example, a one time use coupon that has
   * been redeemed. The default value is false.
   *
   * Available in iOS 7.0.
   */
  voided?: boolean;

  // Relevance Keys

  /**
   * Beacons marking locations where the pass is relevant.
   */
  beacons?: Beacon[];

  /**
   * Locations where the pass is relevant. For example, the location of your store.
   */
  locations?: Location[];

  /**
   * Maximum distance in meters from a relevant latitude and longitude that the pass
   * is relevant. This number is compared to the pass’s default distance and the smaller
   * value is used.
   *
   * Available in iOS 7.0.
   */
  maxDistance?: number;

  /**
   * Recommended for event tickets and boarding passes; otherwise optional. Date and time
   * when the pass becomes relevant. For example, the start time of a movie.
   *
   * The value must be a complete date with hours and minutes, and may optionally include seconds.
   */
  relevantDate?: Date;

  // Style Keys

  /**
   * Information specific to a boarding pass.
   */
  boardingPass?: TransitStyleKeys;

  /**
   * Information specific to a coupon.
   */
  coupon?: GenericStyleKeys;

  /**
   * Information specific to an event ticket.
   */
  eventTicket?: GenericStyleKeys;

  /**
   * Information specific to a generic pass.
   */
  generic?: GenericStyleKeys;

  /**
   * Information specific to a store card.
   */
  storeCard?: GenericStyleKeys;

  // Visual Appearance Keys

  /**
   * Information specific to the pass’s barcode.
   *
   * @deprecated in iOS 9.0 and later; use barcodes instead.
   */
  barcode?: Barcode;

  /**
   * Information specific to the pass’s barcode. The system uses the first valid barcode
   * dictionary in the array. Additional dictionaries can be added as fallbacks.
   *
   * Note: Available only in iOS 9.0 and later.
   */
  barcodes?: Barcode[];

  /**
   * Background color of the pass, specified as an CSS-style RGB triple.
   *
   * @example 'rgb(23, 187, 82)'
   */
  backgroundColor?: string;

  /**
   * Foreground color of the pass, specified as an CSS-style RGB triple.
   *
   * @example 'rgb(100, 10, 110)'
   */
  foregroundColor?: string;

  /**
   * Optional for event tickets and boarding passes; otherwise not allowed. Identifier used to
   * group related passes. If a grouping identifier is specified, passes with the same style,
   * pass type identifier, and grouping identifier are displayed as a group. Otherwise, passes
   * are grouped automatically.
   *
   * Use this to group passes that are tightly related, such as the boarding passes for different
   * connections of the same trip.
   *
   * Available in iOS 7.0.
   */
  groupingIdentifier?: string;

  /**
   * Color of the label text, specified as an CSS-style RGB triple.
   *
   * @example 'rgb(255, 255, 255)'
   */
  labelColor?: string;

  /**
   * Text displayed next to the logo on the pass.
   */
  logoText?: string;

  /**
   * If true, the strip image is displayed without a shine effect. The default value prior to
   * iOS 7.0 is false.
   *
   * @deprecated after iOS 7.0, a shine effect is never applied.
   */
  suppressStripShine?: boolean;

  // Web Service Keys

  /**
   * The authentication token to use with the web service. The token must be 16 characters or
   * longer.
   */
  authenticationToken?: string;

  /**
   * The URL of a web service that conforms to the API described in PassKit Web Service Reference.
   *
   * The web service must use the HTTPS protocol; the leading https:// is included in the value of
   * this key.
   *
   * On devices configured for development, there is UI in Settings to allow HTTP web services.
   */
  webServiceURL?: string;

  // NFC-Enabled Pass Keys

  /**
   * Information used for Value Added Service Protocol transactions.
   *
   * Available in iOS 9.0.
   */
  nfc?: NFC;
}
