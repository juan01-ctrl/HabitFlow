import { useEffect, useState } from "react";

export const useDebounced = (value: unknown, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log('here', delay)
      setDebouncedValue(value);
    }, delay);
  
    return () => clearTimeout(handler);
  }, [value, delay]); 

  return debouncedValue;
}
  