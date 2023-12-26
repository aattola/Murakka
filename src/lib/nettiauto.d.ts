export interface NettiautoListing {
  status: string;
  id: string;
  adUrl: string;
  userID: number;
  userName: string;
  postedBy: string;
  dateCreated: Date;
  dateUpdated: Date;
  lastModified: Date;
  vehicleType: Translations;
  make: Make;
  model: Model;
  modelType: Model;
  bodyType: Translations;
  color: Translations;
  colorType: Translations;
  fuelType: Translations;
  driveType: Translations;
  gearType: Translations;
  country: Translations;
  region: Translations;
  town: Translations;
  accessories: Translations[];
  tags: Tag[];
  year: number;
  modelTypeName: null;
  vin: null;
  firstRegistrationMonth: number;
  firstRegistrationYear: number;
  roadWorthy: boolean;
  lastInspectionMonth: number;
  lastInspectionYear: number;
  tooNewForInspections: boolean;
  price: number;
  isPriced: boolean;
  taxFree: boolean;
  vatDeduct: boolean;
  registerNumber: string;
  showRegisterNumber: boolean;
  totalOwners: null;
  description: string;
  showPostingDate: boolean;
  kilometers: number;
  engineSize: number;
  seats: number;
  doors: number;
  steeringWheelLeft: boolean;
  power: number;
  powerUnitIsKw: boolean;
  batteryCapacity: null;
  electricRange: null;
  torque: number;
  co2Emission: number;
  topSpeed: number;
  acceleration: number;
  consumptionUrban: number;
  consumptionRoad: number;
  consumptionCombined: number;
  curbWeight: number;
  grossWeight: number;
  towWeightWithBrakes: null;
  towWeightWithoutBrakes: null;
  showExactLocation: boolean;
  streetAddress: null;
  showMototesti: boolean;
  rekkariURL: string;
  carBenefit: null;
  freeCarBenefit: null;
  images: Image[];
  video: null;
  labels: string[];
  insuranceInfo: InsuranceInfo[];
  lockedFields: any[];
  people: null;
  hasActiveBos: boolean;
  showBosStatus: null;
  dateRenew: null;
}

export interface Translations {
  id: number;
  fi: string;
  en: string;
  isoCode?: string;
}

export interface Image {
  id: number;
  smallThumbnail: Large;
  largeThumbnail: Large;
  medium: Large;
  large: Large;
}

export interface Large {
  url: string;
  width: number;
  height: number;
}

export interface InsuranceInfo {
  logo: string;
  title: string;
  text: string;
  url: string;
}

export interface Make {
  id: number;
  name: string;
  mostPopular: boolean;
}

export interface Model {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  fi: string;
  en: string;
  descriptionFi: string;
  descriptionEn: string;
}
