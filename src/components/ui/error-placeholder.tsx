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
  isLoading?: boolean;
  subActionHandler?(): void;
  subActionBtnLabel?: string;
  buttonLabel?: string;
  maxImgH?: ImageProps['maxH'];
  hideIcon?: boolean;
};

export default function ErrorPlaceholder({
  retryHandler,
  h,
  label,
  isLoading,
  subActionHandler,
  subActionBtnLabel,
  buttonLabel,
  maxImgH,
  hideIcon,
  ...rest
}: Props) {
  return (
    <Center w="full" minH={h ?? '250px'} {...rest}>
      <VStack w="full" h="full" justify="center" align="center" spacing="4">
        {!hideIcon && (
          <Image
            src="/assets/images/Computer troubleshooting-rafiki.svg"
            alt="no-data-logo"
            maxH={maxImgH ?? '150px'}
          />
        )}
        <Heading fontWeight="semibold" fontSize="lg">
          {label ?? 'An unexpected error occurred'}
        </Heading>
        {!!retryHandler && (
          <Button
            size="lg"
            w="150px"
            onClick={retryHandler}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {buttonLabel ?? 'Retry'}
          </Button>
        )}

        {!!subActionHandler && (
          <Button
            variant="ghost"
            size="lg"
            w="150px"
            onClick={subActionHandler}
          >
            {subActionBtnLabel}
          </Button>
        )}
      </VStack>
    </Center>
  );
}
