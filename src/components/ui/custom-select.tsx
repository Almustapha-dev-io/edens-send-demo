import {
  Button,
  ButtonGroup,
  chakra,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { Else, If, Then } from 'react-if';
import { useDebounceValue } from 'usehooks-ts';

import { POPOVER_SHADOW } from '@/constants';

import AngleDownSmIcon from '../icons/angle-down-sm-icon';
import SearchIcon from '../icons/search-icon';

type Props<T> = {
  header?: string;
  placeholder?: string;
  value?: TCustomSelectItem<T>;
  options: TCustomSelectItem<T>[];
  onChange(value: TCustomSelectItem<T>): void;
};

const PAGE_SIZE = 10;

export default function CustomSelect<T>({
  header = 'Choose One',
  placeholder = 'Select One',
  options,
  value,
  onChange,
}: Props<T>) {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounceValue(searchValue, 200);
  const [page, setPage] = useState(0);

  const filterdOptions = useMemo(() => {
    if (!debouncedSearch) return options;
    return options.filter((v) =>
      v.label.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, options]);

  const pagedOptions = useMemo(
    () => filterdOptions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filterdOptions, page]
  );

  const onNext = () => {
    if (page + 1 >= Math.ceil(filterdOptions.length / PAGE_SIZE)) return;
    setPage((p) => p + 1);
  };

  const onPrev = () => {
    if (page <= 0) return;
    setPage((p) => p - 1);
  };

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  return (
    <Popover placement="bottom-start" size="lg" isLazy>
      {({ onClose, isOpen }) => (
        <>
          <PopoverTrigger>
            <Button w="full" variant="unstyled">
              <InputGroup size="lg" pointerEvents="none" w="full">
                <If condition={!!value?.iconUrl}>
                  <Then>
                    <InputLeftElement>
                      <Image
                        src={value?.iconUrl}
                        rounded="full"
                        w="20px"
                        h="20px"
                      />
                    </InputLeftElement>
                  </Then>
                </If>
                <Input
                  pl={value?.iconUrl ? '40px' : undefined}
                  isReadOnly
                  pointerEvents="none"
                  placeholder={placeholder}
                  value={value?.label}
                />
                <InputRightElement>
                  <AngleDownSmIcon
                    style={{
                      transform: `rotate(${isOpen ? '180deg' : '0deg'})`,
                      transition: 'all 0.2s',
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            mt="2"
            borderColor="gray.200"
            bg="#fff"
            px="4"
            py="20px"
            rounded="15px"
            shadow={POPOVER_SHADOW}
            w="415px"
            maxW="90vw"
          >
            <PopoverHeader
              borderBottomWidth="0px"
              display="flex"
              flexDir="row"
              justifyContent="space-between"
              alignItems="center"
              px="0"
              pt="0"
            >
              <chakra.span fontWeight="700" fontSize="16px">
                {header}
              </chakra.span>
              <PopoverCloseButton pos="static" bg="#DEE4EB" rounded="full" />
            </PopoverHeader>

            <PopoverBody px="0" pt="20px" pb="10px">
              <VStack w="full" spacing="20px">
                <InputGroup size="lg">
                  <InputLeftElement>
                    <SearchIcon />
                  </InputLeftElement>
                  <Input
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </InputGroup>

                <VStack
                  w="full"
                  spacing="0"
                  py="3"
                  px="1"
                  align="flex-start"
                  maxH="250px"
                  overflow="auto"
                  className="custom__scroll"
                >
                  <If condition={!pagedOptions.length}>
                    <Then>
                      <Text w="full" textAlign="center">
                        No options
                      </Text>
                    </Then>
                    <Else>
                      {pagedOptions.map((opt, i) => (
                        <Button
                          key={i}
                          onClick={() => {
                            if (value?.value === opt.value) return;
                            onChange(opt);
                            onClose();
                            setSearchValue('');
                          }}
                          isDisabled={value?.value === opt.value}
                          w="full"
                          py="5"
                          px="2"
                          display="flex"
                          flexDir="row"
                          alignItems="center"
                          justifyContent="flex-start"
                          gap="16px"
                          variant="unstyled"
                          rounded="none"
                          transition="all 0.2s"
                          _hover={{
                            bg: 'gray.50',
                          }}
                          _active={{
                            bg: 'gray.100',
                          }}
                          _notLast={{
                            borderBottom: '1px solid #F0F0F0',
                          }}
                        >
                          <If condition={!!opt.iconUrl}>
                            <Then>
                              <Image
                                src={opt.iconUrl}
                                rounded="full"
                                w="20px"
                                h="20px"
                              />
                            </Then>
                          </If>
                          <Text fontSize="14px" fontWeight="400">
                            {opt.label}
                          </Text>
                        </Button>
                      ))}
                    </Else>
                  </If>
                </VStack>

                <HStack justify="center" align="center" w="full">
                  <ButtonGroup size="sm" isAttached variant="outline">
                    <Button
                      fontWeight="400"
                      fontSize="sm"
                      minW="82px"
                      onClick={onPrev}
                      isDisabled={page <= 0}
                    >
                      Previous
                    </Button>
                    <Button
                      fontWeight="400"
                      fontSize="sm"
                      minW="82px"
                      onClick={onNext}
                      isDisabled={
                        page + 1 >= Math.ceil(filterdOptions.length / PAGE_SIZE)
                      }
                    >
                      Next
                    </Button>
                  </ButtonGroup>
                </HStack>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
