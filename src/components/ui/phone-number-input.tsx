/* eslint-disable import/no-named-as-default */
import { PhoneIcon } from '@chakra-ui/icons';
import {
  Box,
  chakra,
  HStack,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import parseNumber, { AsYouType } from 'libphonenumber-js';
import { forwardRef, ReactNode, useEffect, useState } from 'react';

import { getCountryTelCode } from '@/lib/helpers';

import AngleDownSmIcon from '../icons/angle-down-sm-icon';

type PhoneNumberInputProps = {
  country: string;
  options: { value: string; label: string }[];
  value?: string;
  name?: string;
  onValueChange(value: string): void;
  placeholder?: string;
  rightAddon?: ReactNode;
  inputPr?: InputGroupProps['pr'];
} & InputGroupProps;

const PhoneNumberInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  (
    {
      size,
      value,
      country,
      options,
      onValueChange,
      placeholder,
      name,
      id,
      rightAddon,
      inputPr,
      ...rest
    },
    ref
  ) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countryCode, setCountryCode] = useState('');

    const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const enteredValue = e.target.value;
      const code = getCountryTelCode(enteredValue);

      const parsedNumber = new AsYouType().input(`${code}${phoneNumber}`);

      setCountryCode(code);
      setSelectedCountry(enteredValue);
      onValueChange(parsedNumber);
    };

    const onPhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const enteredValue = e.target.value;

      const parsedNumber = new AsYouType().input(
        `${countryCode}${enteredValue}`
      );
      setPhoneNumber(enteredValue);
      onValueChange(parsedNumber);
    };

    useEffect(() => {
      setSelectedCountry(country);
      setCountryCode(getCountryTelCode(country));
    }, [country]);

    useEffect(() => {
      if (value && [null, undefined, ''].includes(phoneNumber)) {
        const number = parseNumber(`+${value}`);
        if (number) {
          const { countryCallingCode, nationalNumber } = number;
          const parsedNumber = new AsYouType().input(
            `${countryCallingCode}${nationalNumber}`
          );

          setCountryCode(countryCallingCode);
          setPhoneNumber(nationalNumber);
          onValueChange(parsedNumber);
        }
      }
    }, [onValueChange, phoneNumber, value]);

    return (
      <InputGroup size={size} {...rest}>
        <InputLeftElement w="fit-content">
          <Box
            pos="relative"
            my="auto"
            px="2"
            w="full"
            h="90%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <chakra.select
              p="0"
              w="full"
              pos="absolute"
              top="0"
              left="0"
              bottom="0"
              opacity="0"
              zIndex="1"
              value={selectedCountry}
              onChange={onCountryChange}
              fontSize="14px"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </option>
              ))}
            </chakra.select>

            <HStack
              w="fit-content"
              h="full"
              justify="flex-end"
              px="1px"
              spacing="1"
            >
              {selectedCountry ? (
                <Text color="#979797" fontSize="14px">
                  +{countryCode}
                </Text>
              ) : (
                <PhoneIcon w="full" />
              )}
              <AngleDownSmIcon width="10px" height="10px" />
            </HStack>
          </Box>
        </InputLeftElement>
        <Input
          pl="58px"
          pr={inputPr}
          type="text"
          value={phoneNumber}
          placeholder={placeholder}
          onChange={onPhoneNumberChange}
          id={id}
          name={name}
          ref={ref}
        />

        {rightAddon && (
          <InputRightElement w="fit-content">{rightAddon}</InputRightElement>
        )}
      </InputGroup>
    );
  }
);

PhoneNumberInput.displayName = 'PhoneNumberInput';

export default PhoneNumberInput;
