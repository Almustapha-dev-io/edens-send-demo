import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

import { formatPrice, snakeToFlat } from '@/lib/helpers';

// import SatoshiBold from '../../../fonts/satoshi/Satoshi-Bold.otf';
// import SatoshiRegular from '../../../fonts/satoshi/Satoshi-Regular.otf';

// Font.register({
//   family: 'Satoshi',
//   fonts: [
//     {
//       src: SatoshiRegular,
//       fontWeight: 400,
//     },

//     {
//       src: SatoshiBold,
//       fontWeight: 700,
//     },
//   ],
// });

const styles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    padding: '20px',
    gap: '16px',
  },

  hstack: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  vstack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: '4px',
  },
});

const STATUS_COLORS: Record<string, string> = {
  success: '#38C16F',
  pending: '#E9C300',
  failed: '#E41609',
};

type Props = {
  transaction: TTransaction;
  user?: TUser;
};

export default function ReceiptPDF({ transaction, user }: Props) {
  const accountCategory =
    transaction.beneficiary_wallet_name ?? transaction.beneficiary_type;
  const accountNumber =
    transaction.beneficiary_account_number ??
    transaction.beneficiary_phone_number;

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.container}>
          <View style={{ ...styles.hstack, width: '100%' }}>
            <Image
              src="/assets/images/logo-full.png"
              style={{ height: '24.82px', width: '113px' }}
            />

            <Text
              style={{
                fontSize: '14px',
                fontWeight: 400,
                // fontFamily: 'Satoshi',
                color: '#6A7891',
              }}
            >
              {format(new Date(transaction.created_at), 'd MMM yyyy h:ma')}
            </Text>
          </View>

          <View style={{ ...styles.hstack, width: '100%' }}>
            <View style={styles.vstack}>
              <Text
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  //   fontFamily: 'Satoshi',
                  color: '#6A7891',
                }}
              >
                You send exaclty
              </Text>
              <Text
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  //   fontFamily: 'Satoshi',
                }}
              >
                {formatPrice(+transaction.amount, { fractionDigits: 2 })}
              </Text>
            </View>

            <View
              style={{
                ...styles.hstack,
                justifyContent: 'center',
                gap: '8px',
                padding: '5px 10px',
                borderRadius: '20px',
                backgroundColor: '#F0F0F0',
              }}
            >
              <View
                style={{
                  flexShrink: 0,
                  width: '9px',
                  height: '9px',
                  borderRadius: '100%',
                  backgroundColor:
                    STATUS_COLORS[transaction.status.toLowerCase()],
                }}
              />
              <Text
                style={{
                  textTransform: 'capitalize',
                  fontSize: '12px',
                  fontWeight: 400,
                  //   fontFamily: 'Satoshi',
                }}
              >
                {transaction.status.toLowerCase()}
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.vstack,
              width: '100%',
              borderBottom: '1.5px solid #F0F1F4',
              padding: '0 0 16px',
            }}
          >
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 400,
                // fontFamily: 'Satoshi',
                color: '#6A7891',
              }}
            >
              Total Fees
            </Text>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 400,
                // fontFamily: 'Satoshi',
                color: '#002026',
              }}
            >
              {transaction.fee
                ? formatPrice(+transaction.fee, { fractionDigits: 2 })
                : '-'}
            </Text>
          </View>

          <View
            style={{
              ...styles.vstack,
              gap: '10px',
              width: '100%',
              borderBottom: '1.5px solid #F0F1F4',
              padding: '0 0 16px',
            }}
          >
            <Text
              style={{
                fontSize: '16px',
                fontWeight: 700,
                // fontFamily: 'Satoshi',
                color: '#002026',
              }}
            >
              Sender
            </Text>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 400,
                // fontFamily: 'Satoshi',
                color: '#002026',
              }}
            >
              {user?.first_name} {user?.last_name}
            </Text>
          </View>

          <View
            style={{
              ...styles.vstack,
              gap: '14px',
              width: '100%',
              borderBottom: '1.5px solid #F0F1F4',
              padding: '0 0 16px',
            }}
          >
            <Text
              style={{
                fontSize: '16px',
                fontWeight: 700,
                // fontFamily: 'Satoshi',
                color: '#002026',
              }}
            >
              Beneficiary
            </Text>

            <View style={{ ...styles.vstack, gap: '8px', width: '100%' }}>
              <Text
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  //   fontFamily: 'Satoshi',
                  color: '#6A7891',
                }}
              >
                Account Number
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  //   fontFamily: 'Satoshi',
                  color: '#002026',
                }}
              >
                {`${accountNumber} | ${accountCategory ? snakeToFlat(accountCategory) : 'Airtime'}`}
              </Text>
            </View>

            <View style={{ ...styles.vstack, gap: '8px', width: '100%' }}>
              <Text
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  //   fontFamily: 'Satoshi',
                  color: '#6A7891',
                }}
              >
                Account Name
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  //   fontFamily: 'Satoshi',
                  color: '#002026',
                }}
              >
                {transaction.beneficiary_name ?? '-'}
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.vstack,
              gap: '10px',
              width: '100%',
              borderBottom: '1.5px solid #F0F1F4',
              padding: '0 0 16px',
            }}
          >
            <Text
              style={{
                fontSize: '16px',
                fontWeight: 700,
                // fontFamily: 'Satoshi',
                color: '#002026',
              }}
            >
              Reference Number
            </Text>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 400,
                // fontFamily: 'Satoshi',
                color: '#002026',
              }}
            >
              {transaction.reference}
            </Text>
          </View>

          <View
            style={{
              ...styles.vstack,
              gap: '10px',
              width: '100%',
              padding: '0 0 16px',
            }}
          >
            <Text
              style={{
                fontSize: '16px',
                fontWeight: 700,
                // fontFamily: 'Satoshi',
                color: '#002026',
              }}
            >
              Remark
            </Text>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 400,
                // fontFamily: 'Satoshi',
                color: '#002026',
              }}
            >
              {transaction.narration}
            </Text>
          </View>

          <Image
            src="/assets/images/receipt-ad.png"
            style={{ width: '100%', height: '140px', borderRadius: '12px' }}
          />
        </View>
      </Page>
    </Document>
  );
}
