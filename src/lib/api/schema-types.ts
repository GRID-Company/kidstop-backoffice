export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  JSONObject: { input: unknown; output: unknown };
  Timestamp: { input: unknown; output: unknown };
  TimestampScalar: { input: unknown; output: unknown };
  Upload: { input: unknown; output: unknown };
};

export type AddCartItemInput = {
  condition: Scalars['String']['input'];
  magicCardGuid?: InputMaybe<Scalars['String']['input']>;
  pokemonCardGuid?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  tcg: Scalars['String']['input'];
};

export type AddMostWantedCardInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  cardGuid: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type AddPurchaseItemInput = {
  condition: Scalars['String']['input'];
  magicCardGuid?: InputMaybe<Scalars['String']['input']>;
  offerPrice: Scalars['Float']['input'];
  pokemonCardGuid?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  referencePrice?: InputMaybe<Scalars['Float']['input']>;
};

export type AddWishlistItemInput = {
  cardGuid: Scalars['String']['input'];
  condition: Scalars['String']['input'];
  tcg: Scalars['String']['input'];
};

export type BannerGuids = {
  /** GUID of the Magic banner */
  magic?: Maybe<Scalars['String']['output']>;
  /** GUID of the Pokemon banner */
  pokemon?: Maybe<Scalars['String']['output']>;
};

export type BannerGuidsInput = {
  /** GUID of the Magic banner */
  magic?: InputMaybe<Scalars['String']['input']>;
  /** GUID of the Pokemon banner */
  pokemon?: InputMaybe<Scalars['String']['input']>;
};

export type BatchSearchMagicCardsInput = {
  /** Multiline text with Magic cards in Moxfield format */
  searchText: Scalars['String']['input'];
  /** Include card metrics for best match (variants metrics + CardKingdom prices). WARNING: Significantly increases response time due to external API calls. */
  withCardsMetrics?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BatchSearchPokemonCardsInput = {
  /** Multiline text with Pokemon cards in Limitless format */
  searchText: Scalars['String']['input'];
  /** Include card metrics for best match (variants metrics + PriceCharting prices). WARNING: Significantly increases response time due to external API calls. */
  withCardsMetrics?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BulkLoadInventoryInput = {
  bulkOperationType: BulkOperationType;
  items: Array<BulkLoadInventoryItemInput>;
};

export type BulkLoadInventoryItemInput = {
  cardGuid: Scalars['String']['input'];
  condition: Scalars['String']['input'];
  purchasePrice?: InputMaybe<Scalars['Float']['input']>;
  quantity: Scalars['Int']['input'];
  sellPrice?: InputMaybe<Scalars['Float']['input']>;
  tcg: Scalars['String']['input'];
};

export type BulkLoadInventoryResult = {
  createdCount: Scalars['Int']['output'];
  errors: Array<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  updatedCount: Scalars['Int']['output'];
};

/** Type of bulk operation. MANUAL_ENTRY adds quantity, MANUAL_EXIT removes quantity, MANUAL_SET sets absolute stock value. */
export enum BulkOperationType {
  ManualEntry = 'MANUAL_ENTRY',
  ManualExit = 'MANUAL_EXIT',
  ManualSet = 'MANUAL_SET',
}

export type BuyerBudgetWithUsage = {
  assignedAmount: Scalars['Float']['output'];
  buyer: User;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  tcg: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
  usedAmount: Scalars['Float']['output'];
  utilization: Scalars['Float']['output'];
};

export type CancelSaleInput = {
  cancelReason: Scalars['String']['input'];
  saleGuid: Scalars['String']['input'];
};

export type CardOrderInput = {
  mostWantedCardGuid: Scalars['String']['input'];
  priority: Scalars['String']['input'];
};

export type Cart = {
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  customer: User;
  guid: Scalars['String']['output'];
  items?: Maybe<Array<CartItem>>;
  tcg: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type CartItem = {
  cart: Cart;
  condition: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  magicCardSummary?: Maybe<MagicCardSummary>;
  pokemonCardSummary?: Maybe<PokemonCardSummary>;
  quantity: Scalars['Int']['output'];
  tcg: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type ChangePasswordInput = {
  new_password: Scalars['String']['input'];
  otp_guid: Scalars['String']['input'];
};

export type ChangePasswordOutput = {
  success: Scalars['Boolean']['output'];
};

export type ClientDetailsOutput = {
  /** Total amount of only completed orders */
  completedOrdersAmount: Scalars['Float']['output'];
  /** Date of the most recent order */
  lastOrderDate?: Maybe<Scalars['TimestampScalar']['output']>;
  /** Number of all orders (sales) for the client */
  orderCount: Scalars['Int']['output'];
  /** Total amount of all orders (any status) */
  totalOrdersAmount: Scalars['Float']['output'];
  /** Number of orders cancelled due to client unreachable */
  unreachableCancellations: Scalars['Int']['output'];
};

export type CreateInventoryMovementInput = {
  cardGuid: Scalars['String']['input'];
  condition: Scalars['String']['input'];
  movementType: Scalars['String']['input'];
  notes: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type CreatePurchaseInput = {
  items: Array<CreatePurchaseItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  payments?: InputMaybe<Array<CreatePurchasePaymentInput>>;
  sellerGuid?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type CreatePurchaseItemInput = {
  condition: Scalars['String']['input'];
  magicCardGuid?: InputMaybe<Scalars['String']['input']>;
  offerPrice: Scalars['Float']['input'];
  pokemonCardGuid?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  referencePrice?: InputMaybe<Scalars['Float']['input']>;
};

export type CreatePurchasePaymentInput = {
  amount: Scalars['Float']['input'];
  method: Scalars['String']['input'];
};

export type CreateSaleFromCartInput = {
  kioskCustomerEmail?: InputMaybe<Scalars['String']['input']>;
  kioskCustomerName?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type CreateSellerInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  emailAddress: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
};

export type DashboardTableOutput = {
  dashboardTable: Scalars['String']['output'];
  xAxisLabels: Array<Scalars['String']['output']>;
  yAxisLabels: Array<Scalars['Float']['output']>;
  yAxisValues: Array<Scalars['Float']['output']>;
};

export type DateRange = {
  /** Timestamp */
  from?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp */
  to?: InputMaybe<Scalars['String']['input']>;
};

export type DateRangeFilter = {
  /** filterType -> :daterange: */
  filterType: Scalars['String']['input'];
  range: DateRange;
};

export type DaySchedule = {
  /** Closing time */
  closing?: Maybe<Time>;
  /** Opening time */
  opening?: Maybe<Time>;
};

export type DayScheduleInput = {
  /** Closing time */
  closing?: InputMaybe<TimeInput>;
  /** Opening time */
  opening?: InputMaybe<TimeInput>;
};

export type File = {
  /** Accepted values: TECHNICAL_IMAGE, SAMPLE_IMAGE */
  category: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type FindInventoryItemsArgs = {
  filters?: InputMaybe<FindInventoryItemsFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindInventoryItemsFilter = {
  condition?: InputMaybe<Scalars['String']['input']>;
  lastSellDate?: InputMaybe<DateRangeFilter>;
  magicFilters?: InputMaybe<MagicFilters>;
  pokemonFilters?: InputMaybe<PokemonFilters>;
  stockStatus?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type FindInventoryMovementsArgs = {
  filters?: InputMaybe<FindInventoryMovementsFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindInventoryMovementsFilter = {
  createdDate?: InputMaybe<DateRangeFilter>;
  movementType?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type FindMagicCardsPublicArgs = {
  filters?: InputMaybe<FindMagicCardsPublicFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
  /** Include card metrics (variants metrics + CardKingdom prices). WARNING: Significantly increases response time due to external API calls. */
  withCardsMetrics?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FindMagicCardsPublicFilter = {
  condition?: InputMaybe<Scalars['String']['input']>;
  /** Edition/Collection guid */
  edition?: InputMaybe<Scalars['String']['input']>;
  isFoil?: InputMaybe<Scalars['Boolean']['input']>;
  rarity?: InputMaybe<Scalars['String']['input']>;
  sellPrice?: InputMaybe<NumericRangeFilter>;
  stockStatus?: InputMaybe<Scalars['String']['input']>;
};

export type FindMostWantedCardsArgs = {
  filters?: InputMaybe<FindMostWantedCardsFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindMostWantedCardsFilter = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  tcg: Scalars['String']['input'];
};

export type FindMySalesArgs = {
  filters?: InputMaybe<FindMySalesFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindMySalesFilter = {
  status?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type FindMyWishlistArgs = {
  filters: FindMyWishlistFilter;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindMyWishlistFilter = {
  condition?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type FindPokemonCardsPublicArgs = {
  filters?: InputMaybe<FindPokemonCardsPublicFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
  /** Include card metrics (variants metrics + PriceCharting prices). WARNING: Significantly increases response time due to external API calls. */
  withCardsMetrics?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FindPokemonCardsPublicFilter = {
  condition?: InputMaybe<Scalars['String']['input']>;
  /** Default: Pokemon Card */
  genre?: InputMaybe<Scalars['String']['input']>;
  rarity?: InputMaybe<Scalars['String']['input']>;
  sellPrice?: InputMaybe<NumericRangeFilter>;
  /** Collection guid */
  set?: InputMaybe<Scalars['String']['input']>;
  stockStatus?: InputMaybe<Scalars['String']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
};

export type FindPurchasesArgs = {
  filters?: InputMaybe<FindPurchasesFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindPurchasesFilter = {
  buyer?: InputMaybe<Scalars['String']['input']>;
  createdDate?: InputMaybe<DateRangeFilter>;
  status?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type FindSalesArgs = {
  filters?: InputMaybe<FindSalesFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindSalesFilter = {
  createdDate?: InputMaybe<DateRangeFilter>;
  customer?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tcg: Scalars['String']['input'];
};

export type FindSellersArgs = {
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindUsersArgs = {
  filters?: InputMaybe<FindUsersFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindUsersFilter = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  clientStatus?: InputMaybe<Scalars['String']['input']>;
  /** Filter by multiple role values using :multiple_values: filter type */
  role?: InputMaybe<MultipleValuesFilter>;
};

export type GenericOutput = {
  message: Scalars['String']['output'];
};

export type GeofenceData = {
  /** Geofence latitude coordinate */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** Geofence longitude coordinate */
  longitude?: Maybe<Scalars['Float']['output']>;
  /** Geofence radius in meters */
  radius?: Maybe<Scalars['Float']['output']>;
};

export type GeofenceInput = {
  /** Geofence latitude coordinate */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Geofence longitude coordinate */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** Geofence radius in meters */
  radius?: InputMaybe<Scalars['Float']['input']>;
};

export type GlobalConfig = {
  config: GlobalConfigData;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type GlobalConfigData = {
  /** Banner GUIDs for each TCG */
  bannerGuids?: Maybe<BannerGuids>;
  /** Geofence configuration for location-based features */
  geofence?: Maybe<GeofenceData>;
  /** Maximum units per card in inventory (frontend warning) */
  inventoryLimit?: Maybe<Scalars['Int']['output']>;
  /** Weekly operation schedule with opening/closing times */
  operationSchedule?: Maybe<OperationSchedule>;
  /** Default percentage for auto-calculating offer price */
  purchasePercentage?: Maybe<Scalars['Float']['output']>;
  /** Number of CLIENT_UNREACHABLE cancellations before auto-blocking a customer */
  saleCancellationBlockThreshold?: Maybe<Scalars['Int']['output']>;
};

export type IndicatorsDataOutput = {
  indicatorId: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type InventoryIndicatorsOutput = {
  avgDaysInInventory?: Maybe<Scalars['Float']['output']>;
  lastRefresh: Scalars['TimestampScalar']['output'];
  lastSellDate?: Maybe<Scalars['TimestampScalar']['output']>;
  totalStock: Scalars['Int']['output'];
};

export type InventoryItem = {
  avgDaysInInventory?: Maybe<Scalars['Float']['output']>;
  condition: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  lastSellDate?: Maybe<Scalars['TimestampScalar']['output']>;
  magicCardSummary?: Maybe<MagicCardSummary>;
  movements?: Maybe<Array<InventoryMovement>>;
  pokemonCardSummary?: Maybe<PokemonCardSummary>;
  purchasePrice?: Maybe<Scalars['Float']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  stock: Scalars['Float']['output'];
  tcg: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type InventoryMovement = {
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  inventoryItem: InventoryItem;
  movementType: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type IsValidTokenOutput = {
  isValid: Scalars['Boolean']['output'];
};

export type LoginOutput = {
  access_token?: Maybe<Scalars['String']['output']>;
  credentials_expired_token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type LoginUserInput = {
  emailAddress: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MagicCard = {
  cardKingdomId: Scalars['Float']['output'];
  cardType?: Maybe<Scalars['String']['output']>;
  castSymbols?: Maybe<Scalars['String']['output']>;
  collection: MagicCardCollection;
  collectorNumber?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  detailsUrl: Scalars['String']['output'];
  edition: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  power?: Maybe<Scalars['String']['output']>;
  priceBuy?: Maybe<Scalars['Float']['output']>;
  priceRetail?: Maybe<Scalars['Float']['output']>;
  rarity?: Maybe<Scalars['String']['output']>;
  scryfallId?: Maybe<Scalars['String']['output']>;
  sku: Scalars['String']['output'];
  toughness?: Maybe<Scalars['String']['output']>;
  transformDescription?: Maybe<Scalars['String']['output']>;
  transformImageUri?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
  variation?: Maybe<Scalars['String']['output']>;
};

export type MagicCardBatchSearchItem = {
  /** Best matching card */
  bestMatch?: Maybe<MagicCardInternalItem>;
  /** Error message if search failed */
  error?: Maybe<Scalars['String']['output']>;
  /** Original line from the search input */
  originalLine: Scalars['String']['output'];
  /** Parsed card name */
  parsedName?: Maybe<Scalars['String']['output']>;
  /** Parsed collector number */
  parsedNumber?: Maybe<Scalars['String']['output']>;
  /** Parsed quantity from the search line */
  parsedQuantity?: Maybe<Scalars['Float']['output']>;
  /** Parsed set/edition code */
  parsedSet?: Maybe<Scalars['String']['output']>;
  /** Related cards (up to 3) */
  relatedCards: Array<MagicCardInternalItem>;
};

export type MagicCardBatchSearchResult = {
  /** Search results for each line */
  results: Array<MagicCardBatchSearchItem>;
};

export type MagicCardCollection = {
  cards: Array<MagicCard>;
  cardsWithImages: Scalars['Float']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  editionIconUri?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  releaseDate?: Maybe<Scalars['String']['output']>;
  tcgType: Scalars['String']['output'];
  totalCards: Scalars['Float']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type MagicCardCollectionOutput = {
  editionIconUri?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type MagicCardInternalDetail = {
  collectorNumber?: Maybe<Scalars['String']['output']>;
  edition?: Maybe<Scalars['String']['output']>;
  editionGuid?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  inventoryCards?: Maybe<Array<MagicCardInventoryItemInternal>>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  totalStock: Scalars['Int']['output'];
};

export type MagicCardInternalItem = {
  availableStock: Scalars['Boolean']['output'];
  cardMetrics?: Maybe<MagicCardWithMetrics>;
  collectorNumber?: Maybe<Scalars['String']['output']>;
  edition?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  inventoryCards?: Maybe<Array<MagicCardInventoryItemInternal>>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  sellPrice?: Maybe<Scalars['Float']['output']>;
  totalStock: Scalars['Int']['output'];
};

export type MagicCardInventoryItemInternal = {
  condition: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  purchasePrice?: Maybe<Scalars['Float']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  stock: Scalars['Int']['output'];
};

export type MagicCardInventoryItemPublic = {
  condition: Scalars['String']['output'];
  sellPrice?: Maybe<Scalars['Float']['output']>;
  stock: Scalars['Int']['output'];
};

export type MagicCardPublicDetail = {
  collectorNumber?: Maybe<Scalars['String']['output']>;
  edition?: Maybe<Scalars['String']['output']>;
  editionGuid?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  inventoryCards?: Maybe<Array<MagicCardInventoryItemPublic>>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
};

export type MagicCardPublicItem = {
  availableStock: Scalars['Boolean']['output'];
  collectorNumber?: Maybe<Scalars['String']['output']>;
  edition?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  totalStock: Scalars['Float']['output'];
};

export type MagicCardRecommended = {
  availableStock: Scalars['Boolean']['output'];
  collectorNumber?: Maybe<Scalars['String']['output']>;
  edition?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  totalStock: Scalars['Int']['output'];
};

export type MagicCardSummary = {
  collectorNumber?: Maybe<Scalars['String']['output']>;
  edition?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
};

export type MagicCardTopSold = {
  availableStock: Scalars['Boolean']['output'];
  collectorNumber?: Maybe<Scalars['String']['output']>;
  edition?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  totalSold: Scalars['Int']['output'];
  totalStock: Scalars['Int']['output'];
};

export type MagicCardVariantMetrics = {
  avgDaysInInventory?: Maybe<Scalars['Float']['output']>;
  condition: Scalars['String']['output'];
  lastSellDate?: Maybe<Scalars['TimestampScalar']['output']>;
  stock: Scalars['Int']['output'];
  wishlistCount: Scalars['Int']['output'];
};

export type MagicCardWithMetrics = {
  priceBuy?: Maybe<Scalars['Float']['output']>;
  priceRetail?: Maybe<Scalars['Float']['output']>;
  variantsMetrics: Array<MagicCardVariantMetrics>;
};

export type MagicFilters = {
  /** Collection guid to filter by edition */
  edition?: InputMaybe<Scalars['String']['input']>;
  isFoil?: InputMaybe<Scalars['Boolean']['input']>;
  rarity?: InputMaybe<Scalars['String']['input']>;
};

export type MostWantedCard = {
  active: Scalars['Boolean']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  magicCardSummary?: Maybe<MagicCardSummary>;
  notes?: Maybe<Scalars['String']['output']>;
  pokemonCardSummary?: Maybe<PokemonCardSummary>;
  priority: Scalars['String']['output'];
  tcg: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type MultipleValuesFilter = {
  /** filterType -> :multiple_values: */
  filterType: Scalars['String']['input'];
  values: Array<Scalars['String']['input']>;
};

export type Mutation = {
  /** Add item to cart (carpeta digital) */
  addCartItem: Cart;
  /** Add a card to the most wanted list (admin only) */
  addMostWantedCard: MostWantedCard;
  /** Add item to wishlist (carpeta digital) */
  addWishlistItem: WishlistItem;
  /** Bulk load inventory items (admin only) */
  bulkLoadInventory: BulkLoadInventoryResult;
  /** Cancel a sale with reason (backoffice) */
  cancelSale: Sale;
  /** Mutation to reset your password after requesting a change or expiration */
  changePassword: ChangePasswordOutput;
  /** Clear all items from cart for a TCG (carpeta digital) */
  clearCart: Cart;
  /** Clear all wishlist items for a TCG (carpeta digital) */
  clearWishlist: Scalars['Boolean']['output'];
  /** Create a new inventory movement (admin only) */
  createInventoryMovement: InventoryMovement;
  /** Create a new purchase (always DRAFT) */
  createPurchase: Purchase;
  /** Checkout: create sale from cart (carpeta digital) */
  createSaleFromCart: Sale;
  /** Create a new seller */
  createSeller: Seller;
  /** One use mutation to create the first superUser */
  createSuperUser: User;
  /** Mutation to create an User */
  createUser: User;
  /** Delete a seller (soft delete) */
  deleteSeller: Scalars['Boolean']['output'];
  /** Mutation to delete a user (soft-delete, admin only) */
  deleteUser: GenericOutput;
  /** Finalize a purchase (WAITING_PRICE → FINALIZED) */
  finalizePurchase: Purchase;
  login: LoginOutput;
  /** Public mutation for client self-registration */
  registerClient: User;
  /** Remove item from cart (carpeta digital) */
  removeCartItem: Cart;
  /** Remove a card from the most wanted list (admin only) */
  removeMostWantedCard: Scalars['Boolean']['output'];
  /** Remove item from wishlist (carpeta digital) */
  removeWishlistItem: Scalars['Boolean']['output'];
  /** Reorder most wanted cards priorities in bulk (admin only) */
  reorderMostWantedCards: Scalars['Boolean']['output'];
  requestPasswordChange: RequestPasswordChangeOutput;
  /** Mutation to set client status (STANDARD, VIP, BLOCKED) - admin only */
  setClientStatus: GenericOutput;
  /** Set sell price (and optionally reference price) on a purchase item */
  setPurchaseItemSellPrice: PurchaseItem;
  /** Manually trigger Magic card sync from Card Kingdom */
  triggerMagicSync: SyncMetricsOutput;
  /** Manually trigger Pokemon card sync from PriceCharting */
  triggerPokemonSync: SyncMetricsOutput;
  /** Create or update a buyer budget (ADMIN only) */
  updateBuyerBudget: BuyerBudgetWithUsage;
  /** Update cart item quantity (carpeta digital) */
  updateCartItem: Cart;
  updateGlobalConfig: GenericOutput;
  /** Update inventory item prices (internal only) */
  updateInventoryItemPrices: InventoryItem;
  /** Update a most wanted card (admin only) */
  updateMostWantedCard: MostWantedCard;
  /** Update purchase details (client, notes, payments) */
  updatePurchase: Purchase;
  /** Add, remove, or update purchase items (DRAFT only) */
  updatePurchaseItems: Purchase;
  /** Transition purchase status (ADMIN/BUYER only) */
  updatePurchaseStatus: Purchase;
  /** Transition sale status (backoffice) */
  updateSaleStatus: Sale;
  /** Update an existing seller */
  updateSeller: Seller;
  /** Mutation to update an user */
  updateUser: GenericOutput;
  /** Mutation to update a user profile (self-service for all authenticated users) */
  updateUserProfile: GenericOutput;
  uploadBase64: File;
  uploadFile: File;
  userFinishSignUp: ChangePasswordOutput;
};

export type MutationAddCartItemArgs = {
  addCartItemInput: AddCartItemInput;
};

export type MutationAddMostWantedCardArgs = {
  addMostWantedCardInput: AddMostWantedCardInput;
};

export type MutationAddWishlistItemArgs = {
  addWishlistItemInput: AddWishlistItemInput;
};

export type MutationBulkLoadInventoryArgs = {
  input: BulkLoadInventoryInput;
};

export type MutationCancelSaleArgs = {
  cancelSaleInput: CancelSaleInput;
};

export type MutationChangePasswordArgs = {
  changePasswordInput: ChangePasswordInput;
};

export type MutationClearCartArgs = {
  tcg: Scalars['String']['input'];
};

export type MutationClearWishlistArgs = {
  tcg: Scalars['String']['input'];
};

export type MutationCreateInventoryMovementArgs = {
  createInventoryMovementInput: CreateInventoryMovementInput;
};

export type MutationCreatePurchaseArgs = {
  createPurchaseInput: CreatePurchaseInput;
};

export type MutationCreateSaleFromCartArgs = {
  createSaleFromCartInput: CreateSaleFromCartInput;
};

export type MutationCreateSellerArgs = {
  createSellerInput: CreateSellerInput;
};

export type MutationCreateSuperUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationDeleteSellerArgs = {
  guid: Scalars['String']['input'];
};

export type MutationDeleteUserArgs = {
  guid: Scalars['String']['input'];
};

export type MutationFinalizePurchaseArgs = {
  purchaseGuid: Scalars['String']['input'];
};

export type MutationLoginArgs = {
  loginUserInput: LoginUserInput;
};

export type MutationRegisterClientArgs = {
  registerClientInput: RegisterClientInput;
};

export type MutationRemoveCartItemArgs = {
  cartItemGuid: Scalars['String']['input'];
};

export type MutationRemoveMostWantedCardArgs = {
  mostWantedCardGuid: Scalars['String']['input'];
};

export type MutationRemoveWishlistItemArgs = {
  wishlistItemGuid: Scalars['String']['input'];
};

export type MutationReorderMostWantedCardsArgs = {
  reorderMostWantedCardsInput: ReorderMostWantedCardsInput;
};

export type MutationRequestPasswordChangeArgs = {
  requestPasswordChangeInput: RequestPasswordChangeInput;
};

export type MutationSetClientStatusArgs = {
  setClientStatusInput: SetClientStatusInput;
};

export type MutationSetPurchaseItemSellPriceArgs = {
  setPurchaseItemSellPriceInput: SetPurchaseItemSellPriceInput;
};

export type MutationUpdateBuyerBudgetArgs = {
  updateBuyerBudgetInput: UpdateBuyerBudgetInput;
};

export type MutationUpdateCartItemArgs = {
  updateCartItemInput: UpdateCartItemInput;
};

export type MutationUpdateGlobalConfigArgs = {
  updateGlobalConfigInput: UpdateGlobalConfigInput;
};

export type MutationUpdateInventoryItemPricesArgs = {
  updateInventoryItemPricesInput: UpdateInventoryItemPricesInput;
};

export type MutationUpdateMostWantedCardArgs = {
  updateMostWantedCardInput: UpdateMostWantedCardInput;
};

export type MutationUpdatePurchaseArgs = {
  updatePurchaseInput: UpdatePurchaseInput;
};

export type MutationUpdatePurchaseItemsArgs = {
  updatePurchaseItemsInput: UpdatePurchaseItemsInput;
};

export type MutationUpdatePurchaseStatusArgs = {
  updatePurchaseStatusInput: UpdatePurchaseStatusInput;
};

export type MutationUpdateSaleStatusArgs = {
  updateSaleStatusInput: UpdateSaleStatusInput;
};

export type MutationUpdateSellerArgs = {
  updateSellerInput: UpdateSellerInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type MutationUpdateUserProfileArgs = {
  updateUserProfileInput: UpdateUserProfileInput;
};

export type MutationUploadBase64Args = {
  uploadBase64Args: UploadBase64Input;
};

export type MutationUploadFileArgs = {
  uploadFileArgs: UploadFileInput;
};

export type MutationUserFinishSignUpArgs = {
  userFinishSignupInput: UserFinishSignupInput;
};

export type NumericRange = {
  /** Number */
  from?: InputMaybe<Scalars['Float']['input']>;
  /** Number */
  to?: InputMaybe<Scalars['Float']['input']>;
};

export type NumericRangeFilter = {
  /** filterType -> :numericrange: */
  filterType: Scalars['String']['input'];
  range: NumericRange;
};

export type OperationSchedule = {
  /** Friday schedule */
  friday?: Maybe<DaySchedule>;
  /** Monday schedule */
  monday?: Maybe<DaySchedule>;
  /** Saturday schedule */
  saturday?: Maybe<DaySchedule>;
  /** Sunday schedule */
  sunday?: Maybe<DaySchedule>;
  /** Thursday schedule */
  thursday?: Maybe<DaySchedule>;
  /** Tuesday schedule */
  tuesday?: Maybe<DaySchedule>;
  /** Wednesday schedule */
  wednesday?: Maybe<DaySchedule>;
};

export type OperationScheduleInput = {
  /** Friday schedule */
  friday?: InputMaybe<DayScheduleInput>;
  /** Monday schedule */
  monday?: InputMaybe<DayScheduleInput>;
  /** Saturday schedule */
  saturday?: InputMaybe<DayScheduleInput>;
  /** Sunday schedule */
  sunday?: InputMaybe<DayScheduleInput>;
  /** Thursday schedule */
  thursday?: InputMaybe<DayScheduleInput>;
  /** Tuesday schedule */
  tuesday?: InputMaybe<DayScheduleInput>;
  /** Wednesday schedule */
  wednesday?: InputMaybe<DayScheduleInput>;
};

export type PaginatedInventoryItems = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<InventoryItem>>;
};

export type PaginatedInventoryMovements = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<InventoryMovement>>;
};

export type PaginatedMagicCardsInternal = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<MagicCardInternalItem>>;
};

export type PaginatedMagicCardsPublic = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<MagicCardPublicItem>>;
};

export type PaginatedMostWantedCards = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<MostWantedCard>>;
};

export type PaginatedPokemonCardsInternal = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<PokemonCardInternalItem>>;
};

export type PaginatedPokemonCardsPublic = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<PokemonCardPublicItem>>;
};

export type PaginatedPurchases = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<Purchase>>;
};

export type PaginatedSales = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<Sale>>;
};

export type PaginatedSellers = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<Seller>>;
};

export type PaginatedUsers = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<User>>;
};

export type PaginatedWishlistItems = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<WishlistItem>>;
};

export type PokemonCard = {
  artistTcgPlayer?: Maybe<Scalars['String']['output']>;
  cardNumber?: Maybe<Scalars['String']['output']>;
  cardNumberTcgPlayer?: Maybe<Scalars['String']['output']>;
  cardTextTcgPlayer?: Maybe<Scalars['String']['output']>;
  cardTypeTcgPlayer?: Maybe<Scalars['String']['output']>;
  cibPrice?: Maybe<Scalars['Float']['output']>;
  collection: PokemonCardCollection;
  consoleName?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  genre?: Maybe<Scalars['String']['output']>;
  genrePriority?: Maybe<Scalars['Float']['output']>;
  gradedPrice?: Maybe<Scalars['Float']['output']>;
  guid: Scalars['String']['output'];
  hpTcgPlayer?: Maybe<Scalars['String']['output']>;
  imageUri?: Maybe<Scalars['String']['output']>;
  inventoryItems?: Maybe<Array<InventoryItem>>;
  loosePrice?: Maybe<Scalars['Float']['output']>;
  newPrice?: Maybe<Scalars['Float']['output']>;
  productName: Scalars['String']['output'];
  rarityPriceCharting?: Maybe<Scalars['String']['output']>;
  rarityTcgPlayer?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['String']['output']>;
  stageTcgPlayer?: Maybe<Scalars['String']['output']>;
  tcgPlayerId?: Maybe<Scalars['String']['output']>;
  tcgPlayerImageUri?: Maybe<Scalars['String']['output']>;
  titleName: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
  variant: Scalars['String']['output'];
};

export type PokemonCardBatchSearchItem = {
  /** Best matching card */
  bestMatch?: Maybe<PokemonCardInternalItem>;
  /** Error message if search failed */
  error?: Maybe<Scalars['String']['output']>;
  /** Original line from the search input */
  originalLine: Scalars['String']['output'];
  /** Parsed card name */
  parsedName?: Maybe<Scalars['String']['output']>;
  /** Parsed card number */
  parsedNumber?: Maybe<Scalars['String']['output']>;
  /** Parsed quantity from the search line */
  parsedQuantity?: Maybe<Scalars['Float']['output']>;
  /** Parsed set code */
  parsedSet?: Maybe<Scalars['String']['output']>;
  /** Related cards (up to 3) */
  relatedCards: Array<PokemonCardInternalItem>;
};

export type PokemonCardBatchSearchResult = {
  /** Search results for each line */
  results: Array<PokemonCardBatchSearchItem>;
};

export type PokemonCardCollection = {
  cards: Array<PokemonCard>;
  cardsWithImages: Scalars['Float']['output'];
  collectionPriority: Scalars['Float']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  releaseDate?: Maybe<Scalars['String']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setLogo?: Maybe<Scalars['String']['output']>;
  tcgType: Scalars['String']['output'];
  totalCards: Scalars['Float']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type PokemonCardCollectionOutput = {
  code?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PokemonCardInternalDetail = {
  cardNumber?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  inventoryCards?: Maybe<Array<PokemonCardInventoryItemInternal>>;
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
  totalStock: Scalars['Int']['output'];
  variant?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardInternalItem = {
  availableStock: Scalars['Boolean']['output'];
  cardMetrics?: Maybe<PokemonCardWithMetrics>;
  cardNumber?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  inventoryCards?: Maybe<Array<PokemonCardInventoryItemInternal>>;
  name: Scalars['String']['output'];
  sellPrice?: Maybe<Scalars['Float']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
  totalStock: Scalars['Int']['output'];
};

export type PokemonCardInventoryItemInternal = {
  condition: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  purchasePrice?: Maybe<Scalars['Float']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  stock: Scalars['Int']['output'];
};

export type PokemonCardInventoryItemPublic = {
  condition: Scalars['String']['output'];
  sellPrice?: Maybe<Scalars['Float']['output']>;
  stock: Scalars['Int']['output'];
};

export type PokemonCardPublicDetail = {
  cardNumber?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  inventoryCards?: Maybe<Array<PokemonCardInventoryItemPublic>>;
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setGuid?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
  variant?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardPublicItem = {
  availableStock: Scalars['Boolean']['output'];
  cardNumber?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
  totalStock: Scalars['Float']['output'];
};

export type PokemonCardRecommended = {
  availableStock: Scalars['Boolean']['output'];
  cardNumber?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
  totalStock: Scalars['Int']['output'];
};

export type PokemonCardSummary = {
  cardNumber?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardTopSold = {
  availableStock: Scalars['Boolean']['output'];
  cardNumber?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
  totalSold: Scalars['Int']['output'];
  totalStock: Scalars['Int']['output'];
};

export type PokemonCardVariantMetrics = {
  avgDaysInInventory?: Maybe<Scalars['Float']['output']>;
  condition: Scalars['String']['output'];
  lastSellDate?: Maybe<Scalars['TimestampScalar']['output']>;
  stock: Scalars['Int']['output'];
  wishlistCount: Scalars['Int']['output'];
};

export type PokemonCardWithMetrics = {
  gradedPriceEightOrAbove?: Maybe<Scalars['Float']['output']>;
  gradedPriceSeven?: Maybe<Scalars['Float']['output']>;
  ungradedPrice?: Maybe<Scalars['Float']['output']>;
  variantsMetrics: Array<PokemonCardVariantMetrics>;
};

export type PokemonFilters = {
  rarity?: InputMaybe<Scalars['String']['input']>;
};

export type Purchase = {
  buyer?: Maybe<User>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  items?: Maybe<Array<PurchaseItem>>;
  notes?: Maybe<Scalars['String']['output']>;
  payments?: Maybe<Array<PurchasePayment>>;
  reference: Scalars['String']['output'];
  seller?: Maybe<Seller>;
  status: Scalars['String']['output'];
  tcg: Scalars['String']['output'];
  total: Scalars['Float']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type PurchaseItem = {
  condition: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  magicCardSummary?: Maybe<MagicCardSummary>;
  offerPrice: Scalars['Float']['output'];
  pokemonCardSummary?: Maybe<PokemonCardSummary>;
  purchase: Purchase;
  quantity: Scalars['Int']['output'];
  referencePrice?: Maybe<Scalars['Float']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  tcg: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type PurchasePayment = {
  amount: Scalars['Float']['output'];
  method: Scalars['String']['output'];
};

export type Query = {
  /** Get a single buyer budget with usage */
  buyerBudget: BuyerBudgetWithUsage;
  /** Get all buyer budgets with usage (ADMIN only) */
  buyerBudgets: Array<BuyerBudgetWithUsage>;
  /** Get client sales statistics (orders count, totals, cancellations, last order date) */
  clientDetails: ClientDetailsOutput;
  /** Get banner file for a specific TCG */
  getBanner?: Maybe<File>;
  /** Query to get the global config */
  globalConfig: GlobalConfig;
  /** Get aggregated inventory indicators */
  indicatorsInventoryItems: InventoryIndicatorsOutput;
  /** Get inventory item detail by guid */
  inventoryItem: InventoryItem;
  /** Get paginated list of inventory items */
  inventoryItems: PaginatedInventoryItems;
  /** Get paginated list of inventory movements */
  inventoryMovements: PaginatedInventoryMovements;
  isValidToken: IsValidTokenOutput;
  /** Batch search Magic cards from multiline text (Moxfield format) */
  magicBatchCardSearch: MagicCardBatchSearchResult;
  /** Get all Magic card collections/editions (public) */
  magicCardCollections: Array<MagicCardCollectionOutput>;
  /** Get internal detail of a single Magic card with inventory data */
  magicCardInternalDetail: MagicCardInternalDetail;
  /** Get paginated internal list of Magic cards with inventory data */
  magicCardInternalList: PaginatedMagicCardsInternal;
  /** Get public detail of a single Magic card */
  magicCardPublicDetail: MagicCardPublicDetail;
  /** Get paginated public list of Magic cards with filters and search */
  magicCardPublicList: PaginatedMagicCardsPublic;
  /** Get all unique card rarities available in the Magic catalog (cached 1hr) */
  magicCardRarities: Array<Scalars['String']['output']>;
  /** Get inventory variants with metrics for a Magic card (authenticated) */
  magicCardWithMetrics: MagicCardWithMetrics;
  /** Get top 5 best-selling Magic cards of all time (public) */
  magicTopSoldCards: Array<MagicCardTopSold>;
  /** Get most wanted card detail (admin only) */
  mostWantedCard: MostWantedCard;
  /** Get paginated most wanted cards list (admin only) */
  mostWantedCards: PaginatedMostWantedCards;
  /** Get active most wanted Magic cards (public, no auth required) */
  mostWantedMagicCards: Array<MostWantedCard>;
  /** Get active most wanted Pokemon cards (public, no auth required) */
  mostWantedPokemonCards: Array<MostWantedCard>;
  /** Get current user cart for a TCG (carpeta digital) */
  myCart: Cart;
  /** Get current user sale detail (carpeta digital) */
  mySale: Sale;
  /** Get current user sales (carpeta digital) */
  mySales: PaginatedSales;
  /** Get current user wishlist (carpeta digital) */
  myWishlist: PaginatedWishlistItems;
  /** Batch search Pokemon cards from multiline text (Limitless format) */
  pokemonBatchCardSearch: PokemonCardBatchSearchResult;
  /** Get all Pokemon card collections (public) */
  pokemonCardCollections: Array<PokemonCardCollectionOutput>;
  /** Get all unique card genres available in the catalog (cached 1hr) */
  pokemonCardGenres: Array<Scalars['String']['output']>;
  /** Get internal detail of a single Pokemon card with inventory data */
  pokemonCardInternalDetail: PokemonCardInternalDetail;
  /** Get paginated internal list of Pokemon cards with inventory data */
  pokemonCardInternalList: PaginatedPokemonCardsInternal;
  /** Get public detail of a single Pokemon card */
  pokemonCardPublicDetail: PokemonCardPublicDetail;
  /** Get paginated public list of Pokemon cards with filters and search */
  pokemonCardPublicList: PaginatedPokemonCardsPublic;
  /** Get all unique card rarities available in the catalog (cached 1hr) */
  pokemonCardRarities: Array<Scalars['String']['output']>;
  /** Get all unique card variants available in the catalog (cached 1hr) */
  pokemonCardVariants: Array<Scalars['String']['output']>;
  /** Get inventory variants with metrics for a Pokemon card (authenticated) */
  pokemonCardWithMetrics: PokemonCardWithMetrics;
  /** Get top 5 best-selling Pokemon cards of all time (public) */
  pokemonTopSoldCards: Array<PokemonCardTopSold>;
  /** Get purchase detail by guid */
  purchase: Purchase;
  /** Get paginated list of purchases */
  purchases: PaginatedPurchases;
  /** Get 5 recommended Magic cards with highest stock (public) */
  recommendedMagicCards: Array<MagicCardRecommended>;
  /** Get 5 recommended Pokemon cards with highest stock (public) */
  recommendedPokemonCards: Array<PokemonCardRecommended>;
  /** Get sale detail by guid (backoffice) */
  sale: Sale;
  /** Get paginated list of sales (backoffice) */
  sales: PaginatedSales;
  /** Get seller detail by guid */
  seller: Seller;
  /** Get paginated list of sellers */
  sellers: PaginatedSellers;
  /** Query to get an user detail with branch offices */
  user: UserDetail;
  /** Query to get a user profile given the token */
  userProfile: User;
  /** Query to get a list of paginated users */
  users: PaginatedUsers;
  /** Get wishlist count for a card+condition (backoffice) */
  wishlistCount: WishlistCountOutput;
};

export type QueryBuyerBudgetArgs = {
  buyerGuid: Scalars['String']['input'];
  tcg: Scalars['String']['input'];
};

export type QueryBuyerBudgetsArgs = {
  tcg?: InputMaybe<Scalars['String']['input']>;
};

export type QueryClientDetailsArgs = {
  clientGuid: Scalars['String']['input'];
};

export type QueryGetBannerArgs = {
  tcg: TcgType;
};

export type QueryIndicatorsInventoryItemsArgs = {
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>;
  tcg?: InputMaybe<Scalars['String']['input']>;
};

export type QueryInventoryItemArgs = {
  guid: Scalars['String']['input'];
};

export type QueryInventoryItemsArgs = {
  findInventoryItemsArgs: FindInventoryItemsArgs;
};

export type QueryInventoryMovementsArgs = {
  findInventoryMovementsArgs: FindInventoryMovementsArgs;
};

export type QueryMagicBatchCardSearchArgs = {
  input: BatchSearchMagicCardsInput;
};

export type QueryMagicCardInternalDetailArgs = {
  guid: Scalars['String']['input'];
};

export type QueryMagicCardInternalListArgs = {
  findMagicCardsPublicArgs: FindMagicCardsPublicArgs;
};

export type QueryMagicCardPublicDetailArgs = {
  guid: Scalars['String']['input'];
};

export type QueryMagicCardPublicListArgs = {
  findMagicCardsPublicArgs: FindMagicCardsPublicArgs;
};

export type QueryMagicCardWithMetricsArgs = {
  guid: Scalars['String']['input'];
};

export type QueryMostWantedCardArgs = {
  mostWantedCardGuid: Scalars['String']['input'];
};

export type QueryMostWantedCardsArgs = {
  findMostWantedCardsArgs: FindMostWantedCardsArgs;
};

export type QueryMyCartArgs = {
  tcg: Scalars['String']['input'];
};

export type QueryMySaleArgs = {
  saleGuid: Scalars['String']['input'];
};

export type QueryMySalesArgs = {
  findMySalesArgs: FindMySalesArgs;
};

export type QueryMyWishlistArgs = {
  findMyWishlistArgs: FindMyWishlistArgs;
};

export type QueryPokemonBatchCardSearchArgs = {
  input: BatchSearchPokemonCardsInput;
};

export type QueryPokemonCardInternalDetailArgs = {
  guid: Scalars['String']['input'];
};

export type QueryPokemonCardInternalListArgs = {
  findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs;
};

export type QueryPokemonCardPublicDetailArgs = {
  guid: Scalars['String']['input'];
};

export type QueryPokemonCardPublicListArgs = {
  findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs;
};

export type QueryPokemonCardWithMetricsArgs = {
  guid: Scalars['String']['input'];
};

export type QueryPurchaseArgs = {
  guid: Scalars['String']['input'];
};

export type QueryPurchasesArgs = {
  findPurchasesArgs: FindPurchasesArgs;
};

export type QuerySaleArgs = {
  guid: Scalars['String']['input'];
};

export type QuerySalesArgs = {
  findSalesArgs: FindSalesArgs;
};

export type QuerySellerArgs = {
  guid: Scalars['String']['input'];
};

export type QuerySellersArgs = {
  findSellersArgs: FindSellersArgs;
};

export type QueryUserArgs = {
  guid: Scalars['String']['input'];
};

export type QueryUsersArgs = {
  findUsersArgs: FindUsersArgs;
};

export type QueryWishlistCountArgs = {
  wishlistCountArgs: WishlistCountArgs;
};

export type RegisterClientInput = {
  emailAddress: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type ReorderMostWantedCardsInput = {
  cardOrders: Array<CardOrderInput>;
  tcg: Scalars['String']['input'];
};

export type RequestPasswordChangeInput = {
  emailAddress: Scalars['String']['input'];
};

export type RequestPasswordChangeOutput = {
  success: Scalars['Boolean']['output'];
};

export type Sale = {
  cancelReason?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  customer?: Maybe<User>;
  emailNotificationSent: Scalars['Boolean']['output'];
  guid: Scalars['String']['output'];
  items?: Maybe<Array<SaleItem>>;
  kioskCustomerEmail?: Maybe<Scalars['String']['output']>;
  kioskCustomerName?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  saleCode: Scalars['String']['output'];
  status: Scalars['String']['output'];
  statusTimestamps?: Maybe<Scalars['JSONObject']['output']>;
  tcg: Scalars['String']['output'];
  total: Scalars['Float']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type SaleItem = {
  condition: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  magicCardSummary?: Maybe<MagicCardSummary>;
  pokemonCardSummary?: Maybe<PokemonCardSummary>;
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  sale: Sale;
  tcg: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type Seller = {
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  email?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type SetClientStatusInput = {
  clientStatus: Scalars['String']['input'];
  guid: Scalars['ID']['input'];
};

export type SetPurchaseItemSellPriceInput = {
  purchaseItemGuid: Scalars['String']['input'];
  referencePrice?: InputMaybe<Scalars['Float']['input']>;
  sellPrice: Scalars['Float']['input'];
};

export type SortType = {
  column: Scalars['String']['input'];
  /** ASC | DESC */
  order: Scalars['String']['input'];
};

export type SyncMetricsOutput = {
  cardsPerCollection: Scalars['String']['output'];
  collectionsDetected: Scalars['Int']['output'];
  collectionsNew: Scalars['Int']['output'];
  collectionsSkipped: Scalars['Int']['output'];
  durationMs?: Maybe<Scalars['Int']['output']>;
  finishedAt?: Maybe<Scalars['TimestampScalar']['output']>;
  startedAt: Scalars['TimestampScalar']['output'];
  totalCards: Scalars['Int']['output'];
};

/** Trading card game type (Pokemon or Magic) */
export enum TcgType {
  Magic = 'MAGIC',
  Pokemon = 'POKEMON',
}

export type Time = {
  /** Hour (1-12) */
  hour?: Maybe<Scalars['Int']['output']>;
  /** Minute (0-59) */
  minute?: Maybe<Scalars['Int']['output']>;
  /** Period (AM/PM) */
  period?: Maybe<TimePeriod>;
};

export type TimeInput = {
  /** Hour (1-12) */
  hour?: InputMaybe<Scalars['Int']['input']>;
  /** Minute (0-59) */
  minute?: InputMaybe<Scalars['Int']['input']>;
  /** Period (AM/PM) */
  period?: InputMaybe<TimePeriod>;
};

/** Time period for 12-hour format (AM/PM) */
export enum TimePeriod {
  Am = 'AM',
  Pm = 'PM',
}

export type UpdateBuyerBudgetInput = {
  assignedAmount: Scalars['Float']['input'];
  buyerGuid: Scalars['String']['input'];
  tcg: Scalars['String']['input'];
};

export type UpdateCartItemInput = {
  cartItemGuid: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type UpdateGlobalConfigInput = {
  /** Banner GUIDs for each TCG */
  bannerGuids?: InputMaybe<BannerGuidsInput>;
  /** Geofence configuration for location-based features */
  geofence?: InputMaybe<GeofenceInput>;
  /** Maximum units per card in inventory (frontend warning) */
  inventoryLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Weekly operation schedule with opening/closing times */
  operationSchedule?: InputMaybe<OperationScheduleInput>;
  /** Default percentage for auto-calculating offer price */
  purchasePercentage?: InputMaybe<Scalars['Float']['input']>;
  /** Number of CLIENT_UNREACHABLE cancellations before auto-blocking a customer */
  saleCancellationBlockThreshold?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateInventoryItemPricesInput = {
  inventoryItemGuid: Scalars['String']['input'];
  purchasePrice?: InputMaybe<Scalars['Float']['input']>;
  sellPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateMostWantedCardInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  mostWantedCardGuid: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePurchaseInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  payments?: InputMaybe<Array<CreatePurchasePaymentInput>>;
  purchaseGuid: Scalars['String']['input'];
  sellerGuid?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePurchaseItemDetailInput = {
  condition?: InputMaybe<Scalars['String']['input']>;
  itemGuid: Scalars['String']['input'];
  offerPrice?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  referencePrice?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdatePurchaseItemsInput = {
  addItems?: InputMaybe<Array<AddPurchaseItemInput>>;
  purchaseGuid: Scalars['String']['input'];
  removeItemGuids?: InputMaybe<Array<Scalars['String']['input']>>;
  updateItems?: InputMaybe<Array<UpdatePurchaseItemDetailInput>>;
};

export type UpdatePurchaseStatusInput = {
  newStatus: Scalars['String']['input'];
  purchaseGuid: Scalars['String']['input'];
};

export type UpdateSaleStatusInput = {
  newStatus: Scalars['String']['input'];
  saleGuid: Scalars['String']['input'];
};

export type UpdateSellerInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  guid: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  /** Enable or disable user access (admin only) */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  guid?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserProfileInput = {
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UploadBase64Input = {
  base64: Scalars['String']['input'];
  /** Accepted values: TECHNICAL_IMAGE, SAMPLE_IMAGE */
  category: Scalars['String']['input'];
  encoding: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UploadFileInput = {
  /** Accepted values: TECHNICAL_IMAGE, SAMPLE_IMAGE */
  category: Scalars['String']['input'];
  file: Scalars['Upload']['input'];
  name: Scalars['String']['input'];
};

export type User = {
  active: Scalars['Boolean']['output'];
  /** Accepted values: STANDARD, VIP, BLOCKED */
  clientStatus?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  emailAddress: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  /** Accepted values: SUPERUSER, ADMIN, RECEPTION, BUYER, CLIENT, CLIENT_KIOSK */
  role: Scalars['String']['output'];
  signedUp: Scalars['Boolean']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type UserDetail = {
  active: Scalars['Boolean']['output'];
  /** Accepted values: STANDARD, VIP, BLOCKED */
  clientStatus?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  emailAddress: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  /** Accepted values: SUPERUSER, ADMIN, RECEPTION, BUYER, CLIENT, CLIENT_KIOSK */
  role: Scalars['String']['output'];
  signedUp: Scalars['Boolean']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type UserFinishSignupInput = {
  otp_guid: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type WishlistCountArgs = {
  cardGuid: Scalars['String']['input'];
  condition: Scalars['String']['input'];
  tcg: Scalars['String']['input'];
};

export type WishlistCountOutput = {
  count: Scalars['Int']['output'];
};

export type WishlistItem = {
  availableStock?: Maybe<Scalars['Int']['output']>;
  condition: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  customer: User;
  guid: Scalars['String']['output'];
  magicCardSummary?: Maybe<MagicCardSummary>;
  pokemonCardSummary?: Maybe<PokemonCardSummary>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  tcg: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};
