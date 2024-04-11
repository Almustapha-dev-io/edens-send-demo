import {
  Button,
  Center,
  CenterProps,
  Heading,
  Image,
  ImageProps,
  VStack,
} from '@chakra-ui/react';

type Props = CenterProps & {
  retryHandler?(): void;
  label?: string;
  buttonLabel?: string;
  isLoading?: boolean;
  maxImgH?: ImageProps['maxH'];
  hideIcon?: boolean;
};

export default function NoData({
  retryHandler,
  h,
  label,
  buttonLabel,
  isLoading,
  maxImgH,
  hideIcon,
  ...rest
}: Props) {
  return (
    <Center w="full" minH={h ?? '250px'} {...rest}>
      <VStack w="full" h="full" justify="center" align="center" spacing="4">
        {!hideIcon && (
          <Image
            src="/assets/images/no-data.svg"
            alt="no-data-logo"
            maxH={maxImgH ?? '150px'}
          />
        )}
        <Heading fontWeight="semibold" fontSize="lg">
          {label ?? 'Nothing to see here'}
        </Heading>
        {!!retryHandler && (
          <Button
            size="lg"
            w="150px"
            onClick={retryHandler}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            {buttonLabel ?? 'Reload'}
          </Button>
        )}
      </VStack>
    </Center>
  );
}
