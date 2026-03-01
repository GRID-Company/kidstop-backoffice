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

export type CreateInventoryMovementInput = {
  condition: Scalars['String']['input'];
  movementType: Scalars['String']['input'];
  notes: Scalars['String']['input'];
  pokemonCardGuid: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePurchaseInput = {
  anonymousClientEmail?: InputMaybe<Scalars['String']['input']>;
  anonymousClientName?: InputMaybe<Scalars['String']['input']>;
  anonymousClientPhone?: InputMaybe<Scalars['String']['input']>;
  clientGuid?: InputMaybe<Scalars['String']['input']>;
  items: Array<CreatePurchaseItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  payments?: InputMaybe<Array<CreatePurchasePaymentInput>>;
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
  role?: InputMaybe<Scalars['String']['input']>;
  /** Filter by multiple roles using :multiple_values: filter type */
  roles?: InputMaybe<MultipleValuesFilter>;
};

export type GenericOutput = {
  message: Scalars['String']['output'];
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
  /** Maximum units per card in inventory (frontend warning) */
  inventoryLimit?: Maybe<Scalars['Int']['output']>;
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

export type MagicCardSummary = {
  collectorNumber?: Maybe<Scalars['String']['output']>;
  edition?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  isFoil: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
};

export type MultipleValuesFilter = {
  /** filterType -> :multiple_values: */
  filterType: Scalars['String']['input'];
  values: Array<Scalars['String']['input']>;
};

export type Mutation = {
  /** Add item to cart (carpeta digital) */
  addCartItem: Cart;
  /** Add item to wishlist (carpeta digital) */
  addWishlistItem: WishlistItem;
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
  /** One use mutation to create the first superUser */
  createSuperUser: User;
  /** Mutation to create an User */
  createUser: User;
  /** Mutation to delete a user (soft-delete, admin only) */
  deleteUser: GenericOutput;
  /** Finalize a purchase (WAITING_PRICE → FINALIZED) */
  finalizePurchase: Purchase;
  login: LoginOutput;
  /** Public mutation for client self-registration */
  registerClient: User;
  /** Remove item from cart (carpeta digital) */
  removeCartItem: Cart;
  /** Remove item from wishlist (carpeta digital) */
  removeWishlistItem: Scalars['Boolean']['output'];
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
  updatePokemonCardPrices: InventoryItem;
  /** Update purchase details (client, notes, payments) */
  updatePurchase: Purchase;
  /** Add, remove, or update purchase items (DRAFT only) */
  updatePurchaseItems: Purchase;
  /** Transition purchase status (ADMIN/BUYER only) */
  updatePurchaseStatus: Purchase;
  /** Transition sale status (backoffice) */
  updateSaleStatus: Sale;
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

export type MutationAddWishlistItemArgs = {
  addWishlistItemInput: AddWishlistItemInput;
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

export type MutationCreateSuperUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
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

export type MutationRemoveWishlistItemArgs = {
  wishlistItemGuid: Scalars['String']['input'];
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

export type MutationUpdatePokemonCardPricesArgs = {
  updateInventoryItemPricesInput: UpdateInventoryItemPricesInput;
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

export type PaginatedInventoryItems = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<InventoryItem>>;
};

export type PaginatedInventoryMovements = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<InventoryMovement>>;
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

export type PokemonCardCollection = {
  cards: Array<PokemonCard>;
  cardsWithImages: Scalars['Float']['output'];
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
  setName?: Maybe<Scalars['String']['output']>;
  variant?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardPublicItem = {
  availableStock: Scalars['Boolean']['output'];
  guid: Scalars['String']['output'];
  imageUri?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sellPrice?: Maybe<Scalars['Float']['output']>;
  setCode?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
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

export type PokemonFilters = {
  rarity?: InputMaybe<Scalars['String']['input']>;
};

export type Purchase = {
  anonymousClientEmail?: Maybe<Scalars['String']['output']>;
  anonymousClientName?: Maybe<Scalars['String']['output']>;
  anonymousClientPhone?: Maybe<Scalars['String']['output']>;
  buyer?: Maybe<User>;
  client?: Maybe<User>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  items?: Maybe<Array<PurchaseItem>>;
  notes?: Maybe<Scalars['String']['output']>;
  payments?: Maybe<Array<PurchasePayment>>;
  reference: Scalars['String']['output'];
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
  /** Get current user cart for a TCG (carpeta digital) */
  myCart: Cart;
  /** Get current user sale detail (carpeta digital) */
  mySale: Sale;
  /** Get current user sales (carpeta digital) */
  mySales: PaginatedSales;
  /** Get current user wishlist (carpeta digital) */
  myWishlist: PaginatedWishlistItems;
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
  /** Get purchase detail by guid */
  purchase: Purchase;
  /** Get paginated list of purchases */
  purchases: PaginatedPurchases;
  /** Get sale detail by guid (backoffice) */
  sale: Sale;
  /** Get paginated list of sales (backoffice) */
  sales: PaginatedSales;
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
  statusTimestamps?: Maybe<Scalars['String']['output']>;
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
  /** Maximum units per card in inventory (frontend warning) */
  inventoryLimit?: InputMaybe<Scalars['Int']['input']>;
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

export type UpdatePurchaseInput = {
  anonymousClientEmail?: InputMaybe<Scalars['String']['input']>;
  anonymousClientName?: InputMaybe<Scalars['String']['input']>;
  anonymousClientPhone?: InputMaybe<Scalars['String']['input']>;
  clientGuid?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  payments?: InputMaybe<Array<CreatePurchasePaymentInput>>;
  purchaseGuid: Scalars['String']['input'];
};

export type UpdatePurchaseItemDetailInput = {
  condition?: InputMaybe<Scalars['String']['input']>;
  itemGuid: Scalars['String']['input'];
  offerPrice?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
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
