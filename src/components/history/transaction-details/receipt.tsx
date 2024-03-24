import { Box, Button, Heading, Link, VStack } from '@chakra-ui/react';
import { usePDF } from '@react-pdf/renderer';
import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { If, Then } from 'react-if';

import { useUser } from '@/hooks';
import { formatPrice, snakeToFlat } from '@/lib/helpers';

import ReceiptPDF from './receipt-pdf';

type SummaryItemProps = {
  label: string;
  content: ReactNode;
};

function SummaryItem({ content, label }: SummaryItemProps) {
  return (
    <VStack
      className="summary__item"
      w="full"
      py="3"
      spacing="2px"
      align="flex-start"
      _notLast={{ borderBottom: '1px solid #D7DBE7' }}
    >
      <Heading as="h5" color="#979797" fontWeight="400" fontSize="14px">
        {label}
      </Heading>
      <Box w="full" color="#000" fontWeight="400" fontSize="14px">
        {content}
      </Box>
    </VStack>
  );
}

type Props = {
  transaction: TTransaction;
};

export default function Receipt({ transaction }: Props) {
  const amount = useMemo(
    () =>
      isFinite(+transaction.amount) && !isNaN(+transaction.amount)
        ? +transaction.amount / 100
        : 0,
    [transaction.amount]
  );

  const fee = useMemo(
    () =>
      isFinite(+transaction.fee) && !isNaN(+transaction.fee)
        ? +transaction.fee / 100
        : 0,
    [transaction.fee]
  );
  const accountCategory =
    transaction.beneficiary_wallet_name ?? transaction.beneficiary_type;
  const accountNumber =
    transaction.beneficiary_account_number ??
    transaction.beneficiary_phone_number;

  const user = useUser();

  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [{ url, loading, error }, updatePDF] = usePDF({
    document: <ReceiptPDF transaction={transaction} user={user} />,
  });

  console.log({ loading, url, error });

  const downloadHandler = useCallback(() => {
    if (anchorRef.current) {
      anchorRef.current.click();
    }
  }, []);

  useEffect(() => {
    updatePDF(<ReceiptPDF transaction={transaction} user={user} />);
  }, [updatePDF, transaction, user]);

  return (
    <>
      <If condition={!!url}>
        <Then>
          <Link isExternal href={url ?? ''} ref={anchorRef} hidden>
            download receipt
          </Link>
        </Then>
      </If>
      <VStack w="full" h="fit-content" spacing="8">
        <VStack w="full" spacing="6" align="flex-start">
          <Heading as="h3" fontWeight="700" fontSize="16px">
            Recipient Details
          </Heading>

          <VStack w="full" spacing="0">
            <SummaryItem
              label="Account Number"
              content={`${accountNumber} | ${accountCategory ? snakeToFlat(accountCategory) : 'Airtime'}`}
            />
            <SummaryItem
              label="Account Name"
              content={transaction.beneficiary_name ?? '-'}
            />
            <SummaryItem
              label="Email Address"
              content={transaction.beneficiary_email ?? '-'}
            />
          </VStack>
        </VStack>

        <VStack w="full" spacing="6" align="flex-start">
          <Heading as="h3" fontWeight="700" fontSize="16px">
            Transfer Details
          </Heading>

          <VStack w="full" spacing="0">
            <SummaryItem
              label="You send exactly"
              content={formatPrice(amount + fee, {
                fractionDigits: 2,
              })}
            />
            <SummaryItem
              label="Total fees"
              content={formatPrice(fee, {
                fractionDigits: 2,
              })}
            />
            <SummaryItem
              label={`${transaction.beneficiary_name ?? 'Recipient'} gets`}
              content={formatPrice(amount, { fractionDigits: 2 })}
            />
          </VStack>
        </VStack>

        <Button
          w="full"
          size="lg"
          fontSize="14px"
          variant={{ base: 'outline', lg: 'solid' }}
          onClick={downloadHandler}
          isDisabled={loading}
        >
          Download Receipt
        </Button>
      </VStack>
    </>
  );
}
