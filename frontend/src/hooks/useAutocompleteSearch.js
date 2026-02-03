import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_DEBOUNCE_MS = 250;

export default function useAutocompleteSearch({ searchFn, debounceMs = DEFAULT_DEBOUNCE_MS }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const latestRequestRef = useRef(0);

  const load = useCallback(
    async (query) => {
      const requestId = ++latestRequestRef.current;
      setIsLoading(true);
      try {
        const data = await searchFn(query);
        if (latestRequestRef.current !== requestId) {
          return;
        }
        setOptions(data ?? []);
        setError('');
      } catch (err) {
        if (latestRequestRef.current !== requestId) {
          return;
        }
        setError(err.message ?? 'Nie udało się pobrać podpowiedzi.');
        setOptions([]);
      } finally {
        if (latestRequestRef.current === requestId) {
          setIsLoading(false);
        }
      }
    },
    [searchFn]
  );

  useEffect(() => {
    const trimmed = inputValue.trim();
    const timeoutId = setTimeout(() => {
      load(trimmed);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [inputValue, debounceMs, load]);

  return {
    options,
    inputValue,
    setInputValue,
    isLoading,
    error,
    reload: () => load(inputValue.trim())
  };
}
