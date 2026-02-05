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

export type AddressData = {
  city: Scalars['String']['output'];
  exteriorNumber: Scalars['String']['output'];
  interiorNumber: Scalars['String']['output'];
  neighborhood: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type AddressDataInput = {
  city: Scalars['String']['input'];
  exteriorNumber: Scalars['String']['input'];
  interiorNumber: Scalars['String']['input'];
  neighborhood: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
};

export type AddressDataOutput = AddressData & {
  city: Scalars['String']['output'];
  exteriorNumber: Scalars['String']['output'];
  interiorNumber: Scalars['String']['output'];
  neighborhood: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type BranchOffice = {
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
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

export type ChapeInventoryItem = {
  category: Scalars['String']['output'];
  color: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  line: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  stock?: Maybe<Array<InventoryItemStock>>;
  supplier: Scalars['String']['output'];
  unitMeasure: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type ChapeInventoryItemData = {
  category: Scalars['String']['output'];
  color: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  line: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  supplier: Scalars['String']['output'];
  unitMeasure: Scalars['String']['output'];
};

export type ChapeInventoryItemDataOutput = ChapeInventoryItemData & {
  category: Scalars['String']['output'];
  color: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  line: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  supplier: Scalars['String']['output'];
  unitMeasure: Scalars['String']['output'];
};

export type ChapeWindow = {
  chapeInventoryItem: ChapeInventoryItem;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  subWindow: SubWindow;
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type ChapeWindowData = {
  chapeInventoryItem: ChapeInventoryItemData;
  quantity: Scalars['Int']['output'];
};

export type ChapeWindowDataOutput = ChapeWindowData & {
  chapeInventoryItem: ChapeInventoryItemDataOutput;
  quantity: Scalars['Int']['output'];
};

export type CreateBranchOfficeInput = {
  name: Scalars['String']['input'];
};

export type CreateChapeInput = {
  branchOfficeGuid: Scalars['String']['input'];
  color: Scalars['String']['input'];
  line: Scalars['String']['input'];
  minStock: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  sku: Scalars['String']['input'];
  stock: Scalars['Float']['input'];
  supplier: Scalars['String']['input'];
  unitMeasure: Scalars['String']['input'];
};

export type CreateChapeWindowInput = {
  chapeInventoryItemGuid: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
};

export type CreateGlassInput = {
  branchOfficeGuid: Scalars['String']['input'];
  minStock: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  sku: Scalars['String']['input'];
  stock: Scalars['Float']['input'];
  thickness: Scalars['Float']['input'];
};

export type CreateOtherInput = {
  branchOfficeGuid: Scalars['String']['input'];
  minStock: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  sku: Scalars['String']['input'];
  stock: Scalars['Float']['input'];
  unitMeasure: Scalars['String']['input'];
};

export type CreateProfileInput = {
  branchOfficeGuid: Scalars['String']['input'];
  color: Scalars['String']['input'];
  line: Scalars['String']['input'];
  minStock?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  size: Scalars['Float']['input'];
  sku: Scalars['String']['input'];
  stock: Scalars['Float']['input'];
  supplier?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProfileVariantInput = {
  branchOfficeGuid: Scalars['String']['input'];
  groupGuid: Scalars['String']['input'];
  minStock?: InputMaybe<Scalars['Float']['input']>;
  size: Scalars['Float']['input'];
  stock: Scalars['Float']['input'];
};

export type CreateQuotationInput = {
  branchOfficeGuid: Scalars['String']['input'];
  clientData: QuotationClientDataInput;
  finish: Scalars['String']['input'];
  finishProfitAmount: Scalars['Float']['input'];
  finishProfitPercentage: Scalars['Float']['input'];
  invoiceData?: InputMaybe<InvoiceDataInput>;
  iva: Scalars['Float']['input'];
  paymentMethod: Scalars['String']['input'];
  pdfUrl: Scalars['String']['input'];
  shipping: Scalars['Float']['input'];
  subtotal: Scalars['Float']['input'];
  total: Scalars['Float']['input'];
  windowFinish: Scalars['String']['input'];
  windows: Array<WindowQuotationInput>;
};

export type CreateSubWindowInput = {
  chapeWindows: Array<CreateChapeWindowInput>;
  horizontalProfiles: Array<WindowProfileInput>;
  projectionQuantity?: InputMaybe<Scalars['Float']['input']>;
  verticalProfiles: Array<WindowProfileInput>;
  windowType: Scalars['String']['input'];
};

export type CreateUserInput = {
  branchOfficeGuids?: InputMaybe<Array<Scalars['ID']['input']>>;
  emailAddress: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
};

export type CreateWindowInput = {
  categoryType?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  glassInventoryItemGuid: Scalars['String']['input'];
  hasMosquitoNet: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  sampleImageGuids: Array<Scalars['String']['input']>;
  subWindows: Array<CreateSubWindowInput>;
  technicalImageGuid: Scalars['String']['input'];
  windowTypes: Array<Scalars['String']['input']>;
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

export type FindBranchOfficesArgs = {
  filters?: InputMaybe<FindBranchOfficesFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindBranchOfficesFilter = {
  createdDate?: InputMaybe<DateRangeFilter>;
};

export type FindChapeArgs = {
  branchOfficeGuid?: InputMaybe<Scalars['String']['input']>;
  guid?: InputMaybe<Scalars['String']['input']>;
};

export type FindChapesArgs = {
  filters: FindChapesFilter;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindChapesFilter = {
  branchOfficeGuid?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  line?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['String']['input']>;
};

export type FindGlassArgs = {
  branchOfficeGuid?: InputMaybe<Scalars['String']['input']>;
  guid?: InputMaybe<Scalars['String']['input']>;
};

export type FindGlassesArgs = {
  filters: FindGlassesFilter;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindGlassesFilter = {
  branchOfficeGuid?: InputMaybe<Scalars['String']['input']>;
  thickness?: InputMaybe<Scalars['Float']['input']>;
};

export type FindOtherArgs = {
  branchOfficeGuid?: InputMaybe<Scalars['String']['input']>;
  guid?: InputMaybe<Scalars['String']['input']>;
};

export type FindOtherFilter = {
  branchOfficeGuid?: InputMaybe<Scalars['String']['input']>;
};

export type FindOthersArgs = {
  filters: FindOtherFilter;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindProfileGroupArgs = {
  branchOfficeGuid: Scalars['String']['input'];
  profileGroupGuid: Scalars['String']['input'];
};

export type FindProfileVariantArgs = {
  branchOfficeGuid: Scalars['String']['input'];
  profileVariantGuid: Scalars['String']['input'];
};

export type FindProfilesArgs = {
  filters: FindProfilesFilter;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindProfilesFilter = {
  branchOfficeGuid: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  line?: InputMaybe<Scalars['String']['input']>;
};

export type FindQuotationsArgs = {
  filters: FindQuotationsFilter;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindQuotationsFilter = {
  branchOffice: RelationFilter;
  clientName?: InputMaybe<Scalars['String']['input']>;
  invoiceNeeded?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type FindUsersArgs = {
  filters?: InputMaybe<FindUsersFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindUsersFilter = {
  activated?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type FindWindowsArgs = {
  filters?: InputMaybe<FindWindowsFilter>;
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type FindWindowsFilter = {
  categoryType?: InputMaybe<Scalars['String']['input']>;
  hasMosquitoNet?: InputMaybe<Scalars['Boolean']['input']>;
  windowType?: InputMaybe<Scalars['String']['input']>;
};

export type GenericOutput = {
  message: Scalars['String']['output'];
};

export type GlassInventoryItem = {
  category: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  stock?: Maybe<Array<InventoryItemStock>>;
  thickness: Scalars['Float']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type GlassInventoryItemData = {
  category: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  thickness: Scalars['Int']['output'];
};

export type GlassInventoryItemDataOutput = GlassInventoryItemData & {
  category: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  thickness: Scalars['Int']['output'];
};

export type GlobalConfig = {
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
  values: Array<GlobalConfigValueOutput>;
};

export type GlobalConfigValue = {
  /** Accepted values: SIMULATOR_INSTRUCTIONS, SIMULATOR_DURATION */
  identifier: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type GlobalConfigValueInput = {
  /** Accepted values: SIMULATOR_INSTRUCTIONS, SIMULATOR_DURATION */
  identifier: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type GlobalConfigValueOutput = GlobalConfigValue & {
  /** Accepted values: SIMULATOR_INSTRUCTIONS, SIMULATOR_DURATION */
  identifier: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type IndicatorsDataOutput = {
  indicatorId: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type InventoryItemStock = {
  branchOffice: BranchOffice;
  chape?: Maybe<ChapeInventoryItem>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  glass?: Maybe<GlassInventoryItem>;
  guid: Scalars['String']['output'];
  minStock: Scalars['Float']['output'];
  other?: Maybe<OtherInventoryItem>;
  profile?: Maybe<ProfileInventoryItemVariant>;
  stock: Scalars['Float']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type InvoiceData = {
  address: AddressData;
  cfdi: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rfc: Scalars['String']['output'];
};

export type InvoiceDataInput = {
  address: AddressDataInput;
  cfdi: Scalars['String']['input'];
  name: Scalars['String']['input'];
  rfc: Scalars['String']['input'];
};

export type InvoiceDataOutput = InvoiceData & {
  address: AddressDataOutput;
  cfdi: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rfc: Scalars['String']['output'];
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

export type Mutation = {
  /** Mutation to reset your password after requesting a change or expiration */
  changePassword: ChangePasswordOutput;
  /** Mutation to create a branchOffice */
  createBranchOffice: BranchOffice;
  createChape: ChapeInventoryItem;
  createGlass: GlassInventoryItem;
  createOther: OtherInventoryItem;
  createProfile: ProfileInventoryGroup;
  createProfileVariant: ProfileInventoryItemVariant;
  /** Mutation to create a quotation */
  createQuotation: Quotation;
  /** One use mutation to create the first superUser */
  createSuperUser: User;
  /** Mutation to create an User */
  createUser: User;
  createWindow: WindowTemplate;
  deactiveUser: GenericOutput;
  /** Mutation to delete a branchOffice */
  deleteBranchOffice: GenericOutput;
  deleteChape: ChapeInventoryItem;
  deleteGlass: GlassInventoryItem;
  deleteOther: OtherInventoryItem;
  deleteProfileVariant: ProfileInventoryItemVariant;
  /** Mutation to soft delete a quotation */
  deleteQuotation: Quotation;
  deleteWindow: WindowTemplate;
  login: LoginOutput;
  requestPasswordChange: RequestPasswordChangeOutput;
  /** Mutation to update a branchOffice */
  updateBranchOffice: GenericOutput;
  updateChape: ChapeInventoryItem;
  updateGlass: GlassInventoryItem;
  updateGlobalConfig: GenericOutput;
  updateOther: OtherInventoryItem;
  updateProfile: ProfileInventoryGroup;
  /** Mutation to update quotation status */
  updateQuotationStatus: Quotation;
  /** Mutation to update an user */
  updateUser: GenericOutput;
  /** Mutation to update a user profile */
  updateUserProfile: GenericOutput;
  updateWindow: WindowTemplate;
  uploadBase64: File;
  uploadFile: File;
  userFinishSignUp: ChangePasswordOutput;
};

export type MutationChangePasswordArgs = {
  changePasswordInput: ChangePasswordInput;
};

export type MutationCreateBranchOfficeArgs = {
  createBranchOfficeInput: CreateBranchOfficeInput;
};

export type MutationCreateChapeArgs = {
  createChapeInput: CreateChapeInput;
};

export type MutationCreateGlassArgs = {
  createGlassInput: CreateGlassInput;
};

export type MutationCreateOtherArgs = {
  createOtherInput: CreateOtherInput;
};

export type MutationCreateProfileArgs = {
  createProfileInput: CreateProfileInput;
};

export type MutationCreateProfileVariantArgs = {
  createProfileVariantInput: CreateProfileVariantInput;
};

export type MutationCreateQuotationArgs = {
  createQuotationInput: CreateQuotationInput;
};

export type MutationCreateSuperUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationCreateWindowArgs = {
  createWindowInput: CreateWindowInput;
};

export type MutationDeactiveUserArgs = {
  guid: Scalars['String']['input'];
};

export type MutationDeleteBranchOfficeArgs = {
  guid: Scalars['String']['input'];
};

export type MutationDeleteChapeArgs = {
  guid: Scalars['String']['input'];
};

export type MutationDeleteGlassArgs = {
  guid: Scalars['String']['input'];
};

export type MutationDeleteOtherArgs = {
  guid: Scalars['String']['input'];
};

export type MutationDeleteProfileVariantArgs = {
  guid: Scalars['String']['input'];
};

export type MutationDeleteQuotationArgs = {
  quotationGuid: Scalars['String']['input'];
};

export type MutationDeleteWindowArgs = {
  windowGuid: Scalars['String']['input'];
};

export type MutationLoginArgs = {
  loginUserInput: LoginUserInput;
};

export type MutationRequestPasswordChangeArgs = {
  requestPasswordChangeInput: RequestPasswordChangeInput;
};

export type MutationUpdateBranchOfficeArgs = {
  updateBranchOfficeInput: UpdateBranchOfficeInput;
};

export type MutationUpdateChapeArgs = {
  updateChapeInput: UpdateChapeInput;
};

export type MutationUpdateGlassArgs = {
  updateGlassInput: UpdateGlassInput;
};

export type MutationUpdateGlobalConfigArgs = {
  updateGlobalConfigInput: UpdateGlobalConfigInput;
};

export type MutationUpdateOtherArgs = {
  updateOtherInput: UpdateOtherInput;
};

export type MutationUpdateProfileArgs = {
  updateProfileInput: UpdateProfileInput;
};

export type MutationUpdateQuotationStatusArgs = {
  updateQuotationInput: UpdateQuotationStatusInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type MutationUpdateUserProfileArgs = {
  updateUserProfileInput: UpdateUserProfileInput;
};

export type MutationUpdateWindowArgs = {
  updateWindowInput: UpdateWindowInput;
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

export type OtherInventoryItem = {
  category: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  stock?: Maybe<Array<InventoryItemStock>>;
  unitMeasure: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type PaginatedBranchOffices = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<BranchOffice>>;
};

export type PaginatedChapes = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<ChapeInventoryItem>>;
};

export type PaginatedGlasses = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<GlassInventoryItem>>;
};

export type PaginatedOthers = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<OtherInventoryItem>>;
};

export type PaginatedProfileVariants = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<ProfileInventoryItemVariant>>;
};

export type PaginatedQuotations = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<Quotation>>;
};

export type PaginatedSelectChapes = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<SelectChapeOutput>>;
};

export type PaginatedSelectGlasses = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<SelectGlassOutput>>;
};

export type PaginatedSelectProfiles = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<SelectProfileOutput>>;
};

export type PaginatedUsers = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<User>>;
};

export type PaginatedWindows = {
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<WindowTemplate>>;
};

export type ProfileInventoryGroup = {
  category: Scalars['String']['output'];
  color: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  line: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  supplier: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
  variants: Array<ProfileInventoryItemVariant>;
};

export type ProfileInventoryItemVariant = {
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  profileGroup: ProfileInventoryGroup;
  size: Scalars['Float']['output'];
  stock?: Maybe<Array<InventoryItemStock>>;
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type Query = {
  branchOffice: BranchOffice;
  /** Query to get a list of paginated branchOffices */
  branchOffices: PaginatedBranchOffices;
  chapeColors: Array<Scalars['String']['output']>;
  chapeLines: Array<Scalars['String']['output']>;
  chapeSuppliers: Array<Scalars['String']['output']>;
  getChape: ChapeInventoryItem;
  getChapes: PaginatedChapes;
  getGlass: GlassInventoryItem;
  getGlassThicknesses: Array<Scalars['Float']['output']>;
  getGlasses: PaginatedGlasses;
  getOther: OtherInventoryItem;
  getOthers: PaginatedOthers;
  getProfile: ProfileInventoryGroup;
  getProfileVariant: ProfileInventoryItemVariant;
  getProfileVariants: PaginatedProfileVariants;
  /** Query to get the glboal config */
  globalConfig: GlobalConfig;
  isValidToken: IsValidTokenOutput;
  profileColors: Array<Scalars['String']['output']>;
  profileLines: Array<Scalars['String']['output']>;
  profileSuppliers: Array<Scalars['String']['output']>;
  /** Query to get a single quotation by guid */
  quotation: Quotation;
  /** Query to get a list of paginated quotations */
  quotations: PaginatedQuotations;
  /** Query to get a list of chapes with only guid, sku, name, and unitMeasure for selection */
  selectChapes: PaginatedSelectChapes;
  /** Query to get a list of glasses with only guid, sku, name, and thickness for selection */
  selectGlasses: PaginatedSelectGlasses;
  /** Query to get a list of profiles with only guid, sku, and name for selection */
  selectProfiles: PaginatedSelectProfiles;
  /** Query to get an user detail with branch offices */
  user: UserDetail;
  /** Query to get a user profile given the token */
  userProfile: User;
  /** Query to get a list of paginated users */
  users: PaginatedUsers;
  window: WindowTemplate;
  /** Query to get available profile colors for a window template used in quotations */
  windowTemplateColors: Array<Scalars['String']['output']>;
  /** Query to get profiles cost breakdown for a window template, color and size */
  windowTemplateProfilesCost: WindowTemplateProfilesCostOutput;
  /** Query to get a list of paginated windows */
  windows: PaginatedWindows;
};

export type QueryBranchOfficeArgs = {
  guid: Scalars['String']['input'];
};

export type QueryBranchOfficesArgs = {
  findBranchOfficesArgs: FindBranchOfficesArgs;
};

export type QueryGetChapeArgs = {
  findChapeArgs: FindChapeArgs;
};

export type QueryGetChapesArgs = {
  findChapesArgs: FindChapesArgs;
};

export type QueryGetGlassArgs = {
  findGlassArgs: FindGlassArgs;
};

export type QueryGetGlassesArgs = {
  findGlassesArgs: FindGlassesArgs;
};

export type QueryGetOtherArgs = {
  findOtherArgs: FindOtherArgs;
};

export type QueryGetOthersArgs = {
  findOthersArgs: FindOthersArgs;
};

export type QueryGetProfileArgs = {
  findProfileGroupArgs: FindProfileGroupArgs;
};

export type QueryGetProfileVariantArgs = {
  findProfileVariantArgs: FindProfileVariantArgs;
};

export type QueryGetProfileVariantsArgs = {
  findProfilesArgs: FindProfilesArgs;
};

export type QueryQuotationArgs = {
  quotationGuid: Scalars['String']['input'];
};

export type QueryQuotationsArgs = {
  findQuotationsArgs: FindQuotationsArgs;
};

export type QuerySelectChapesArgs = {
  selectChapesArgs: SelectChapesArgs;
};

export type QuerySelectGlassesArgs = {
  selectGlassesArgs: SelectGlassesArgs;
};

export type QuerySelectProfilesArgs = {
  selectProfilesArgs: SelectProfilesArgs;
};

export type QueryUserArgs = {
  guid: Scalars['String']['input'];
};

export type QueryUsersArgs = {
  findUsersArgs: FindUsersArgs;
};

export type QueryWindowArgs = {
  windowGuid: Scalars['String']['input'];
};

export type QueryWindowTemplateColorsArgs = {
  windowTemplateColorsArgs: WindowTemplateColorsArgs;
};

export type QueryWindowTemplateProfilesCostArgs = {
  windowTemplateProfilesCostArgs: WindowTemplateProfilesCostArgs;
};

export type QueryWindowsArgs = {
  findWindowsArgs: FindWindowsArgs;
};

export type Quotation = {
  branchOffice: BranchOffice;
  clientData: QuotationClientDataOutput;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  finish: Scalars['String']['output'];
  finishProfitAmount: Scalars['Float']['output'];
  finishProfitPercentage: Scalars['Float']['output'];
  glass?: Maybe<GlassInventoryItemDataOutput>;
  guid: Scalars['String']['output'];
  invoiceData?: Maybe<InvoiceDataOutput>;
  iva: Scalars['Float']['output'];
  paymentMethod: Scalars['String']['output'];
  pdfUrl: Scalars['String']['output'];
  shipping: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
  windowFinish: Scalars['String']['output'];
  windows: Array<WindowQuotationOutput>;
};

export type QuotationClientData = {
  address: AddressData;
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type QuotationClientDataInput = {
  address: AddressDataInput;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type QuotationClientDataOutput = QuotationClientData & {
  address: AddressDataOutput;
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type RelationFilter = {
  /** filterType -> :single_relation: */
  filterType: Scalars['String']['input'];
  relationKey: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type RequestPasswordChangeInput = {
  emailAddress: Scalars['String']['input'];
};

export type RequestPasswordChangeOutput = {
  success: Scalars['Boolean']['output'];
};

export type SelectChapeOutput = {
  guid: Scalars['String']['output'];
  line: Scalars['String']['output'];
  name: Scalars['String']['output'];
  sku: Scalars['String']['output'];
  unitMeasure: Scalars['String']['output'];
};

export type SelectChapesArgs = {
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type SelectGlassOutput = {
  guid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  sku: Scalars['String']['output'];
  thickness: Scalars['Float']['output'];
};

export type SelectGlassesArgs = {
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type SelectProfileOutput = {
  guid: Scalars['String']['output'];
  line: Scalars['String']['output'];
  name: Scalars['String']['output'];
  sku: Scalars['String']['output'];
};

export type SelectProfilesArgs = {
  limit: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  sort: SortType;
};

export type SortType = {
  column: Scalars['String']['input'];
  /** ASC | DESC */
  order: Scalars['String']['input'];
};

export type SubWindow = {
  chapes: Array<ChapeWindow>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  guid: Scalars['String']['output'];
  horizontalProfiles: Array<WindowProfileOutput>;
  projectionQuantity?: Maybe<Scalars['Float']['output']>;
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
  verticalProfiles: Array<WindowProfileOutput>;
  windowTemplate: WindowTemplate;
  windowType: Scalars['String']['output'];
};

export type SubWindowData = {
  chapes: Array<ChapeWindowData>;
  horizontalProfiles: Array<WindowProfileOutput>;
  projectionQuantity?: Maybe<Scalars['Int']['output']>;
  verticalProfiles: Array<WindowProfileOutput>;
  windowType: Scalars['String']['output'];
};

export type SubWindowDataOutput = SubWindowData & {
  chapes: Array<ChapeWindowDataOutput>;
  horizontalProfiles: Array<WindowProfileOutput>;
  projectionQuantity?: Maybe<Scalars['Int']['output']>;
  verticalProfiles: Array<WindowProfileOutput>;
  windowType: Scalars['String']['output'];
};

export type UpdateBranchOfficeInput = {
  guid: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChapeInput = {
  branchOfficeGuid: Scalars['String']['input'];
  chapeGuid: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  line?: InputMaybe<Scalars['String']['input']>;
  minStock?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stock?: InputMaybe<Scalars['Float']['input']>;
  supplier?: InputMaybe<Scalars['String']['input']>;
  unitMeasure?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGlassInput = {
  branchOfficeGuid: Scalars['String']['input'];
  glassGuid: Scalars['String']['input'];
  minStock?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stock?: InputMaybe<Scalars['Float']['input']>;
  thickness?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateGlobalConfigInput = {
  values: Array<GlobalConfigValueInput>;
};

export type UpdateOtherInput = {
  branchOfficeGuid: Scalars['String']['input'];
  minStock?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  otherGuid: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stock?: InputMaybe<Scalars['Float']['input']>;
  unitMeasure?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileInput = {
  branchOfficeGuid: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  groupGuid: Scalars['String']['input'];
  line?: InputMaybe<Scalars['String']['input']>;
  minStock?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stock?: InputMaybe<Scalars['Float']['input']>;
  supplier?: InputMaybe<Scalars['String']['input']>;
  variantGuid: Scalars['String']['input'];
};

export type UpdateQuotationStatusInput = {
  quotationGuid: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type UpdateUserInput = {
  branchOfficeGuids?: InputMaybe<Array<Scalars['ID']['input']>>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  guid?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserProfileInput = {
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oldPassword?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWindowInput = {
  categoryType?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  glassInventoryItemGuid?: InputMaybe<Scalars['String']['input']>;
  hasMosquitoNet?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sampleImageGuids?: InputMaybe<Array<Scalars['String']['input']>>;
  subWindows?: InputMaybe<Array<CreateSubWindowInput>>;
  technicalImageGuid?: InputMaybe<Scalars['String']['input']>;
  windowGuid: Scalars['String']['input'];
  windowTypes?: InputMaybe<Array<Scalars['String']['input']>>;
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
  activated: Scalars['Boolean']['output'];
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  emailAddress: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Accepted values: SUPERUSER, ADMIN, ASSISTANT */
  role: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type UserDetail = {
  activated: Scalars['Boolean']['output'];
  branchOffices?: Maybe<Array<BranchOffice>>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  emailAddress: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Accepted values: SUPERUSER, ADMIN, ASSISTANT */
  role: Scalars['String']['output'];
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
};

export type UserFinishSignupInput = {
  otp_guid: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type WindowProfile = {
  inventoryItemSKU: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  size: Scalars['Float']['output'];
  windowType: Scalars['String']['output'];
};

export type WindowProfileCost = {
  name?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type WindowProfileInput = {
  inventoryItemSKU: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  size: Scalars['Float']['input'];
  windowType: Scalars['String']['input'];
};

export type WindowProfileOutput = WindowProfile & {
  inventoryItemSKU: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  size: Scalars['Float']['output'];
  windowType: Scalars['String']['output'];
};

export type WindowQuotationInput = {
  color: Scalars['String']['input'];
  height: Scalars['Float']['input'];
  price: Scalars['Float']['input'];
  quantity: Scalars['Int']['input'];
  width: Scalars['Float']['input'];
  windowTemplateGuid: Scalars['String']['input'];
};

export type WindowQuotationOutput = {
  color: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  width: Scalars['Float']['output'];
  window: WindowTemplateDataOutput;
};

export type WindowTemplate = {
  categoryType?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<User>;
  createdDate: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  glass: GlassInventoryItem;
  guid: Scalars['String']['output'];
  hasMosquitoNet: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  sampleImages?: Maybe<Array<File>>;
  subWindows: Array<SubWindow>;
  technicalImage?: Maybe<File>;
  updatedBy?: Maybe<User>;
  updatedDate: Scalars['Timestamp']['output'];
  windowTypes: Array<Scalars['String']['output']>;
};

export type WindowTemplateColorsArgs = {
  templateGuid: Scalars['String']['input'];
};

export type WindowTemplateData = {
  categoryType?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  glass: GlassInventoryItemData;
  guid: Scalars['String']['output'];
  hasMosquitoNet: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  sampleImageUrls: Array<Scalars['String']['output']>;
  subWindows: Array<SubWindowData>;
  technicalImageUrl?: Maybe<Scalars['String']['output']>;
  windowTypes: Array<Scalars['String']['output']>;
};

export type WindowTemplateDataOutput = WindowTemplateData & {
  categoryType?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  glass: GlassInventoryItemDataOutput;
  guid: Scalars['String']['output'];
  hasMosquitoNet: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  sampleImageUrls: Array<Scalars['String']['output']>;
  subWindows: Array<SubWindowDataOutput>;
  technicalImageUrl?: Maybe<Scalars['String']['output']>;
  windowTypes: Array<Scalars['String']['output']>;
};

export type WindowTemplateProfilesCostArgs = {
  color: Scalars['String']['input'];
  height: Scalars['Float']['input'];
  templateGuid: Scalars['String']['input'];
  width: Scalars['Float']['input'];
};

export type WindowTemplateProfilesCostOutput = {
  horizontalProfiles: Array<WindowProfileCost>;
  verticalProfiles: Array<WindowProfileCost>;
};
