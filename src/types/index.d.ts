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
