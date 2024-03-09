import { Button, Heading, VStack } from '@chakra-ui/react';

import { CARD_SHADOW } from '@/constants';
import { useSendMoneyContext } from '@/context/send-money';

import RecipientDetails from './recipient-details';
import TransferDetails from './transfer-details';

export default function TransferSummary() {
  const { onPrevioussPage, resetPageState } = useSendMoneyContext();

  return (
    <VStack w="519px" maxW="full" spacing="6">
      <Heading
        as="h1"
        fontSize={{ base: '24px', md: '36px' }}
        fontWeight="700"
        textAlign="center"
      >
        See your transfer summary
      </Heading>

      <VStack
        align="flex-start"
        w="full"
        shadow={{ base: 'none', lg: CARD_SHADOW }}
        rounded={{ base: 'none', lg: '20px' }}
        bg={{ base: 'transparent', lg: '#fff' }}
        spacing="8"
        px={{ base: 0, lg: '30px' }}
        py={{ base: 2, md: 10 }}
      >
        <RecipientDetails />
        <TransferDetails />

        <VStack w="full" spacing="4">
          <Button
            size="lg"
            fontSize="14px"
            w="full"
            variant={{ base: 'outline', lg: 'solid' }}
            onClick={resetPageState}
          >
            Pay $200
          </Button>
          <Button
            size="lg"
            fontSize="14px"
            w="full"
            variant="ghost"
            onClick={onPrevioussPage}
          >
            Back
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
