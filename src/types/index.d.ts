type TCustomSelectItem<T> = {
  label: string;
  iconUrl?: string;
  value: T;
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
  sender_country: string | null;
  source_of_funds: string | null;
  purpose_of_transfer: string | null;
  relation_with_beneficiary: string | null;
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

type TTransactionProgressUpdate = {
  timestamp: number;
  message: string;
  reason?: string;
  status?: boolean;
  failure_reason?: string;
};

type TTransaction = {
  id: string;
  eden_send_client_id: string;
  reference: string;
  amount: string;
  fee: string;
  beneficiary_account_number: string | null;
  beneficiary_name: string | null;
  beneficiary_email: string | null;
  narration: string;
  status: string;
  progress_report: TTransactionProgressUpdate[];
  created_at: string;
  updated_at: string;
  beneficiary_type: string | null;
  beneficiary_bank_code: string | null;
  beneficiary_wallet_name: string | null;
  bill_id: string | null;
  operator_id: string | null;
  product_id: string | null;
  bill_provider_id: string | null;
  beneficiary_phone_number: string | null;
  type: string;
  sender_country: string | null;
  source_of_funds: string | null;
  purpose_of_transfer: string | null;
  relation_with_beneficiary: string | null;
};

type InitiateSendTransactionDTO = {
  amount: number;
  beneficiary_type: string;
  bank_code?: string;
  wallet_name?: string;
  fx_quotation_id: string;
  beneficiary_account_number: string;
  beneficiary_name?: string;
  beneficiary_email?: string;
  narration: string;
  sender_country: string;
  source_of_funds: string;
  purpose_of_transfer: string;
  relation_with_beneficiary: string;
};

type TAirtimeCountry = {
  id: string;
  country_code: string;
  name: string;
  flag: string;
  is_active: true;
  country_operators: TAirtimeBillProvider[];
};

type TAirtimeBillProvider = {
  operator_id: string;
  bill_id: string;
  biller_id: string;
  name: string;
  logo: string;
  is_active: boolean;
  product_type: string;
};

type TAirtimeBillProviderProduct = {
  product_id: string;
  name: string;
  product_type: string;
  min_amount: string;
  max_amount: string;
  is_active: boolean;
};

type InitiateAirtimeTransactionDTO = {
  amount: number;
  bill_id: string;
  beneficiary_phone_number: string;
  bill_provider_id: string;
  operator_id: string;
  product_id: string;
};

type RetryTransactionDTO = {
  transactionId: string;
  beneficiary_account_number?: string;
  beneficiary_phone_number?: string;
};
