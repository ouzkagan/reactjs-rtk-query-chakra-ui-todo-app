import { Box, HStack, IconButton, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import { DOTS, usePagination } from "../hooks/usePagination";

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  // chakra theme colors
  const bg = useColorModeValue("cyan.50", "gray.600");
  const iconColors = useColorModeValue("black","rgba(255,255,255, 0.87)")
  const chosen =  useColorModeValue("#E2E8F0","rgba(255,255,255, 0.08)")
  return (
    <>
      <HStack spacing="12px" justifyContent='flex-end'>
        <Box
        onClick={onPrevious}
        
        >
          <IconButton
            aria-label="First Page"
            icon={<CgChevronLeft />}
            disabled={currentPage === 1}
            py="0"
            px="12px"
            h="32px"
            textAlign="center"
            margin="auto 4px"
            color={iconColors}
            display="flex"
            alignItems="center"
            borderRadius="16px"
            lineHeight="1.43"
            fontSize="13px"
            minWidth="32px"
            bg="none"
          />
        </Box>
        {paginationRange.map((pageNumber, index) => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber === DOTS) {
            return (
              // <li className="pagination-item dots" key={index}>
              //   &#8230;
              // </li>
              <Box
                w="40px"
                // bg="yellow.200"
                key={pageNumber + '_' +index}
              >
                &#8230;
              </Box>
            );
          }

          // Render our Page Pills
          return (
            // <li
            //   className={classnames("pagination-item", {
            //     selected: pageNumber === currentPage,
            //   })}
            //   onClick={() => onPageChange(pageNumber)}
            //   key={pageNumber}
            // >
            //   {pageNumber}
            // </li>
            <Box
              // w="40px"
              // bg="pink.100"
              as="button"
              onClick={() => onPageChange(pageNumber)}
              key={pageNumber}
              py="0"
              px="12px"
              h="32px"
              textAlign="center"
              margin="auto 4px"
              // color="rgba(255,255,255, 0.87)"
              color={iconColors}
              display="flex"
              alignItems="center"
              borderRadius="16px"
              lineHeight="1.43"
              fontSize="13px"
              minWidth="32px"
              bg={pageNumber == currentPage && chosen}
              // colorScheme="whiteAlpha"
              // colorScheme='gray'
            >
              {pageNumber}
            </Box>
          );
        })}
        <Box 
        onClick={onNext}
        
          >
          <IconButton
            aria-label="Last Page"
            icon={<CgChevronRight />}
            disabled={currentPage === lastPage}
            py="0"
            px="12px"
            h="32px"
            textAlign="center"
            margin="auto 4px"
            // color="rgba(255,255,255, 0.87)"
            color={iconColors}
            display="flex"
            alignItems="center"
            borderRadius="16px"
            lineHeight="1.43"
            fontSize="13px"
            minWidth="32px"
            bg="none"
          />
        </Box>
      </HStack>
    </>
  );
};

export default Pagination;
