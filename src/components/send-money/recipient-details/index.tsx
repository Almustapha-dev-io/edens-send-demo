import { Heading, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Else, If, Then } from 'react-if';

import { CARD_SHADOW } from '@/constants';
import { useAppSelector } from '@/lib/redux';

import BankDetails from './bank-details';
import CategoryRadioGroup from './category-radio-group';
import WalletDetails from './wallet-details';

export default function RecipientDetails() {
  const { recipientDetails } = useAppSelector(
    (s) => s.transactionParams.sendMoney
  );
  const [category, setCategory] = useState<'wallet' | 'bank'>(
    recipientDetails?.category ?? 'wallet'
  );

  return (
    <VStack w="519px" maxW="full" spacing="6">
      <Heading
        as="h1"
        fontSize={{ base: '24px', md: '36px' }}
        fontWeight="700"
        textAlign="center"
      >
        Who are you sending the money to?
      </Heading>

      <Heading as="h2" fontSize="14px" fontWeight="400" textAlign="center">
        Input the recipient details in the input fields
      </Heading>

      <VStack
        align="flex-start"
        w="full"
        shadow={{ base: 'none', lg: CARD_SHADOW }}
        rounded={{ base: 'none', lg: '20px' }}
        bg={{ base: 'transparent', lg: '#fff' }}
        spacing="6"
        px={{ base: 0, lg: '30px' }}
        py={{ base: 2, md: 10 }}
      >
        <Heading fontWeight="700" fontSize="16px">
          Recipient details
        </Heading>

        <CategoryRadioGroup value={category} onChange={setCategory} />

        <If condition={category === 'wallet'}>
          <Then>
            <WalletDetails />
          </Then>
          <Else>
            <BankDetails />
          </Else>
        </If>
      </VStack>
    </VStack>
  );
}
