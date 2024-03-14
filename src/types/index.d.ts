type TCustomSelectItem<T> = {
  label: string;
  iconUrl?: string;
  value: T;
};

type TTransaction = {
  date: string;
  id: string;
  type: string;
  beneficiary: string;
  beneficiaryNumber: string;
  amount: number;
  status: string;
};

type TServerResponse<T extends object> = {
  code: number;
  message: string;
  status: boolean;
} & T;

type TUser = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
};

type CreateTransactionParamsDTO = {
  amount: number;
  beneficiary_country: string;
};

type TTtransactionParams = {
  recipientInstitutions: {
    BANKS: Record<string, string>;
    WALLETS: Record<string, string>;
  };
  sourceCurrency: string;
  destinationCurrency: string;
  exchangeRate: number;
  fxQuotationId: string;
  fee: number;
};

type TQueryArgs = {
  hideSuccessMsg?: boolean;
  hideErrorMsg?: boolean;
};

type TVerifyWalletBeneficiaryDTO = {
  beneficiary_type: `${string}_WALLET`;
  wallet_name: string;
  account_number: string;
};

type TVerifyBankBeneficiaryDTO = {
  beneficiary_type: `${string}_BANK`;
  bank_code: string;
  account_number: string;
};

type VerifyBeneficiaryDTO =
  | TVerifyWalletBeneficiaryDTO
  | TVerifyBankBeneficiaryDTO;
