import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { apiLayerKey } from '@/lib/env';

export function useWillUnmount(fn: () => void) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}

export function useOnMount(fn: () => void) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    fnRef.current();
  }, []);
}

type TLocationRes = {
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_name: string;
  city: string;
  location: {
    capital: string;
    native_name: string;
    flag: string;
  };
};

export function useGetUserLocation() {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isError, setIsError] = useState<boolean>();
  const [isSuccess, setIsSuccess] = useState<boolean>();
  const [data, setData] = useState<TLocationRes>();

  const reset = useCallback(() => {
    setIsError(undefined);
    setIsLoading(undefined);
    setIsSuccess(undefined);
  }, []);

  const doRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(undefined);
      setIsSuccess(undefined);
      setData(undefined);

      const ipResponse: AxiosResponse<Record<'ip', string>> = await axios.get(
        'https://api.ipify.org',
        {
          params: {
            format: 'json',
          },
        }
      );

      const locationRes: AxiosResponse<TLocationRes> = await axios.get(
        `https://api.apilayer.com/ip_to_location/${ipResponse.data.ip}`,
        {
          headers: {
            apikey: apiLayerKey,
          },
        }
      );

      setData(locationRes.data);
      setIsSuccess(true);
      setIsError(undefined);
    } catch (error) {
      setIsError(true);
      setIsSuccess(false);
      setData(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    doRequest();
  }, [doRequest]);

  return {
    isLoading,
    isError,
    isSuccess,
    data,
    reset,
    retry: doRequest,
  };
}
