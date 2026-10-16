import { useEffect, useState } from "react";
import { readLocal, writeLocal } from "../utils/localData";

/**
 * State backed by localStorage. Mirrors readLocal/writeLocal so pages keep the
 * existing storage keys and behaviour.
 */
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => readLocal(key, initialValue));

  useEffect(() => {
    writeLocal(key, value);
  }, [key, value]);

  return [value, setValue];
}
