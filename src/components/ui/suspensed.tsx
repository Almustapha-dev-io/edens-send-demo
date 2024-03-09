import { Center, CenterProps } from '@chakra-ui/react';
import { Suspense } from 'react';

import { Loader } from './loader';

export function Suspensed({ children, ...props }: CenterProps) {
  return (
    <Suspense
      fallback={
        <Center {...props}>
          <Loader />
        </Center>
      }
    >
      {children}
    </Suspense>
  );
}
