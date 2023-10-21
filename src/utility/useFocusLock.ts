import { useEffect, useRef } from "react";

/**
 * 
 * @param avoidSelectors 
 * @param directionChildren 
 * @returns 
 */
const generateQuery = (avoidSelectors: string[], directionChildren:boolean = false) => {
    const baseSelectors: string[] = ["a[href]", "button", "input", "textarea", "select", "[tabindex]"];
    const exclusionFilter = () => avoidSelectors.map((avoid) => `:not(${avoid})`).join('')
    const completeSelectors = baseSelectors.map(selector => `${selector}${exclusionFilter()}:not([disabled])`);
    const query = directionChildren ? completeSelectors.map(selector => `:scope > ${selector}`).join(',') : completeSelectors.join(',');
    return query;
}

/**
 * Adds a shake animation to a target element.
 * @param {HTMLElement} targetRef - Element to animate
 * @param {number} duration - Duration of the animation
 */
const addShakeAnimation = (targetRef: HTMLElement, duration: number) => {
	targetRef.style.animation = `shake ${duration}ms ease-in-out`;
	return setTimeout(() => (targetRef.style.animation = ""), duration);
};


/**
 * Internal parameters for the focus hook.
 * @typedef {Object} InternalFocusHookParams
 * @property {React.RefObject<HTMLDivElement>} ref - Ref to the container element
 * @property {boolean} includeLeftRightKeys - Whether to include left and right arrow keys in the focus lock
 * @property {boolean} includeUpDownKeys - Whether to include up and down arrow keys in the focus lock
 * @property {boolean} loop - Whether to loop around when reaching the end of the focusable elements
 * @property {boolean} directChildren - Whether to only focus direct children of the container element
 * @property {string[]} avoidSelectors - List of selectors to avoid
 * @property {number | boolean} focusOnMount - Whether to focus an element on mount. If a number is provided, it will focus the element at that index. If true, it will focus the first element. If false, it will not focus any element.
 * @property {(e: HTMLElement, index: number) => void} onFocus - Callback to be called when an element is focused
 */
type InternalFocusHookParams = {
	ref: React.RefObject<HTMLDivElement>;
	includeLeftRightKeys: boolean;
	includeUpDownKeys: boolean;
	loop: boolean;
	directChildren: boolean;
	avoidSelectors: string[];
	focusOnMount: number | boolean;
    preventScollToView: boolean;
	onFocus: (e: HTMLElement, index: number) => void;
};

export type FocusHookParams = Partial<InternalFocusHookParams>;


/**
 * Custom React hook for locking focus within a given container element.
 * @param {FocusHookParams} params - Hook configuration parameters
 */
export const useFocusLock = (params?: FocusHookParams) => {
    const {ref, includeLeftRightKeys, includeUpDownKeys, loop, directChildren, avoidSelectors, focusOnMount, preventScollToView, onFocus} = params || {};
	const backupRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const targetRef = ref || backupRef;
		const target = targetRef.current;
		if (!target) return;
		const p: InternalFocusHookParams = {
			ref: targetRef,
			includeLeftRightKeys: includeLeftRightKeys || false,
			includeUpDownKeys: includeUpDownKeys || false,
			loop: loop || false,
			directChildren: directChildren || false,
			avoidSelectors: avoidSelectors || [],
			focusOnMount: focusOnMount || false,
            preventScollToView: !!preventScollToView,
			onFocus: onFocus || (() => {}),
		};

		const onKeyDown = handleKeyDown({ ...p, target });
		handleMounting(p);
		target.addEventListener("keydown", onKeyDown);
		return () => target.removeEventListener("keydown", onKeyDown);

	}, [ref, includeLeftRightKeys, includeUpDownKeys, loop, directChildren, avoidSelectors, focusOnMount, onFocus, preventScollToView]);
    return ref || backupRef
};

/**
 * Determines and sets the next index based on the arrow direction and parameters.
 * @param {object} params - Parameters including the current index, the event, and other settings
 * @return {array} - Tuple containing the next index and whether a change was made
 */
const handleNextIndex = (
	params: InternalFocusHookParams & { currentIndex: number; event: KeyboardEvent; focusableElements: HTMLElement[] }
) => {
	const { currentIndex, event, focusableElements, loop } = params;
	let nextIndex = currentIndex;
	let madeChange = false;
	if (isRequestForward(event, params)) {
		nextIndex = currentIndex + 1 > focusableElements.length - 1 ? (loop ? 0 : currentIndex) : currentIndex + 1;
		madeChange = true;
	} else if (isRequestBackward(event, params)) {
		nextIndex = currentIndex - 1 < 0 ? (loop ? focusableElements.length - 1 : currentIndex) : currentIndex - 1;
		madeChange = true;
	}

	return [nextIndex, madeChange] as const;
};

/**
 * Handle the focus when the component mounts.
 * @param {InternalFocusHookParams} params - Parameters for focus
 */
const handleMounting = (params: InternalFocusHookParams) => {
	if (params.focusOnMount === false) return;
	const focusableElements = Array.from(
		params.ref.current?.querySelectorAll<HTMLElement>(generateQuery(params.avoidSelectors, params.directChildren)) ?? []
	);
	if (focusableElements.length === 0) return;
	const targetIndex = params.focusOnMount === true ? 0 : params.focusOnMount;
	const targetElement = focusableElements[targetIndex];

	targetElement?.focus();
    if(!params.preventScollToView) targetElement?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
	params.onFocus?.(targetElement, targetIndex);
};

/**
 * Handle the keydown event for navigating between focusable elements.
 * @param {object} params - Parameters for focus and keydown behavior
 * @return {function} - Event handler for keydown
 */
const handleKeyDown = (params: InternalFocusHookParams & { target: HTMLDivElement }) => (e: KeyboardEvent) => {
	const { loop, directChildren, avoidSelectors, target, onFocus, preventScollToView } = params;
    
	const focusableElements = Array.from(target.querySelectorAll<HTMLElement>(generateQuery(avoidSelectors, directChildren)))
	if (focusableElements.length === 0) return;
	const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
	const [nextIndex, madeChange] = handleNextIndex({ ...params, event: e, currentIndex, focusableElements });
    if (nextIndex === undefined) return;
    if(!madeChange) return 
    e.preventDefault()
    console.log("madeChange", madeChange, "nextIndex", nextIndex, "currentIndex", currentIndex, "loop", loop, "preventScollToView", preventScollToView)
	const lastIndex = focusableElements.length - 1;
	const blockedTop = !loop && nextIndex === 0 && currentIndex === 0;
	const blockedBottom = !loop && nextIndex === lastIndex && currentIndex === lastIndex;
	const blocked = madeChange && (blockedTop || blockedBottom);
    const nextTarget = focusableElements[nextIndex];
    let timeout:NodeJS.Timeout | null = null;
	if (blocked) timeout = addShakeAnimation(nextTarget, 500);
    else if (madeChange) {
		nextTarget?.focus();
		if(!preventScollToView) nextTarget?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center"});
		try {
			onFocus(nextTarget, nextIndex);
		} catch (e) {
			console.error(e);
		}
	}
    return () => timeout && clearTimeout(timeout);
};

const isTabForward = (e: KeyboardEvent) => e.key === "Tab" && !e.shiftKey;
const isTabBackward = (e: KeyboardEvent) => e.key === "Tab" && e.shiftKey;
const isArrowRight = (e: KeyboardEvent) => e.key === "ArrowRight";
const isArrowLeft = (e: KeyboardEvent) => e.key === "ArrowLeft";
const isArrowDown = (e: KeyboardEvent) => e.key === "ArrowDown";
const isArrowUp = (e: KeyboardEvent) => e.key === "ArrowUp";

const isRequestForward = (e: KeyboardEvent, params: FocusHookParams) =>
	isTabForward(e) || (params.includeLeftRightKeys && isArrowRight(e)) || (params.includeUpDownKeys && isArrowDown(e));
const isRequestBackward = (e: KeyboardEvent, params: FocusHookParams) =>
	isTabBackward(e) || (params.includeLeftRightKeys && isArrowLeft(e)) || (params.includeUpDownKeys && isArrowUp(e));
