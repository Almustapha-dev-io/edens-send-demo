import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import {
  Button,
  chakra,
  HStack,
  StackProps,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Pagination } from 'react-headless-pagination';

type Props = {
  page: number;
  pageSize: number;
  setPage(page: number): void;
  toFirstPage(): void;
  toLastPage(): void;
  setPageSize(pageSize: number): void;
  totalPages: number;
  totalItems: number;
  canNext?: boolean;
  canPrev?: boolean;
  hidePageSizeSelect?: boolean;
  hidePageStat?: boolean;
} & Omit<StackProps, 'children'>;

export default function CustomPaginator({
  page,
  setPage,
  totalPages,
  totalItems,
  toFirstPage,
  toLastPage,
  canPrev,
  canNext,
  pageSize,
  setPageSize,
  hidePageSizeSelect,
  hidePageStat,
  ...containerProps
}: Props) {
  const truncableDisplay = useBreakpointValue({ base: 'none', lg: 'flex' });

  return (
    <>
      <style>
        {`
            .paginator__truncable {
              display: ${truncableDisplay};
              justify-content: center;
              align-items: center;
              border-color: #E9E5E5;
              border-width: 1px;
              color: #4B4B4B;
              border-radius: 8px;
              cursor: default;
              height: 32px;
              width: 32px;
              font-size: 14px;
              font-weight: 400;
              letter-spacing: 0.14px;
              line-height: 150%;
            }
          `}
      </style>

      <HStack
        flexWrap="wrap"
        rowGap="4"
        columnGap="6"
        justify="space-between"
        w="full"
        px="3"
        {...containerProps}
      >
        <div />

        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={totalPages}
          middlePagesSiblingCount={2}
          edgePageCount={2}
          truncableClassName="paginator__truncable"
        >
          <HStack gap="2" flexWrap="wrap">
            <Tooltip label="First Page" hasArrow isDisabled={!canPrev}>
              <Button
                size="sm"
                maxW="32px"
                fontSize="14px"
                lineHeight="150%"
                fontWeight="400"
                letterSpacing="0.14px"
                rounded="8px"
                color="#000"
                variant="ghost"
                colorScheme="gray"
                onClick={toFirstPage}
                isDisabled={!canPrev}
              >
                <ArrowLeftIcon color="inherit" w="10px" h="10px" />
              </Button>
            </Tooltip>
            <Pagination.PrevButton>
              <Tooltip label="Previous Page" hasArrow isDisabled={!canPrev}>
                <Button
                  size="sm"
                  maxW="32px"
                  fontSize="14px"
                  lineHeight="150%"
                  fontWeight="400"
                  letterSpacing="0.14px"
                  rounded="8px"
                  color="#000"
                  variant="ghost"
                  colorScheme="gray"
                  isDisabled={!canPrev}
                >
                  <ChevronLeftIcon color="inherit" fontSize="xl" />
                </Button>
              </Tooltip>
            </Pagination.PrevButton>

            <chakra.nav
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
            >
              <chakra.ul
                display={{ base: 'none', lg: 'flex' }}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap="2"
                listStyleType="none"
                sx={{
                  li: {
                    a: {
                      px: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#000',
                      rounded: '8px',
                      cursor: 'pointer',
                      h: '32px',
                      w: 'fit-content',
                      minWidth: '32px',
                      fontSize: 'sm',
                      transition: 'all 0.3s',
                      _hover: {
                        bg: 'gray.50',
                      },
                      _active: {
                        bg: 'gray.100',
                      },
                      '&.active-page': {
                        bg: 'primary.500',
                        color: '#fff',
                      },
                    },
                  },
                }}
              >
                <Pagination.PageButton
                  activeClassName="active-page"
                  inactiveClassName=""
                />
              </chakra.ul>
            </chakra.nav>

            <Pagination.NextButton>
              <Tooltip label="Next Page" hasArrow isDisabled={!canNext}>
                <Button
                  size="sm"
                  maxW="32px"
                  fontSize="14px"
                  lineHeight="150%"
                  fontWeight="400"
                  letterSpacing="0.14px"
                  rounded="8px"
                  color="#000"
                  variant="ghost"
                  colorScheme="gray"
                  isDisabled={!canNext}
                >
                  <ChevronRightIcon fontSize="xl" />
                </Button>
              </Tooltip>
            </Pagination.NextButton>

            <Tooltip label="Last Page" hasArrow isDisabled={!canNext}>
              <Button
                size="sm"
                maxW="32px"
                fontSize="14px"
                lineHeight="150%"
                fontWeight="400"
                letterSpacing="0.14px"
                rounded="8px"
                color="#000"
                variant="ghost"
                colorScheme="gray"
                isDisabled={!canNext}
                onClick={toLastPage}
              >
                <ArrowRightIcon color="inherit" w="10px" h="10px" />
              </Button>
            </Tooltip>
          </HStack>
        </Pagination>
      </HStack>
    </>
  );
}
