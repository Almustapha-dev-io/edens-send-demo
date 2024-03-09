import { Button, Center, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

export default function ErrorBoundaryFallback() {
  const error = useRouteError();
  const navigate = useNavigate();

  const reloadHandler = () => {
    if (window) window.location.reload();
  };

  useEffect(() => {
    // Send error to monitoring/logging tool
    if (error) console.log(error);
  }, [error]);

  return (
    <Center w="full" h="100vh">
      <VStack w="full" maxW="400px" spacing="5">
        <Text fontSize="xl" textAlign="center">
          An unexpected error has occured. We&apos;re working on getting things
          fixed...
        </Text>

        <VStack spacing="3">
          <Button w="full" size="lg" onClick={reloadHandler}>
            Reload Page
          </Button>

          <Button
            w="full"
            variant="ghost"
            size="lg"
            bg="#F2F2F2"
            color="#000"
            onClick={() => navigate('/', { replace: true })}
          >
            Go Home
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
}
