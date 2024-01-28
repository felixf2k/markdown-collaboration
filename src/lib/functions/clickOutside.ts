/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement, onClickOutside: () => void) {
    const handleClick = (event: MouseEvent) => {
        if (!(event.target instanceof Node)) return;
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            onClickOutside();
        }
    };

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        },
    };
}
