import { DependencyList, useEffect, useState } from "react";

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useWait = (ms: number) => {
    const [resolved, setResolved] = useState(false);
    useEffect(() => {
        wait(ms).then(() => setResolved(true));
    },[ms])
    return resolved;
}