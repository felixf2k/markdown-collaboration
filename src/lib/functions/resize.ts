export const resize = (
    node: HTMLElement,
    resized: (mouseX: number) => void,
) => {
    const onResize = (e: PointerEvent) => {
        resized(e.clientX);
    };

    const onResizeEnd = () => {
        window.removeEventListener('pointermove', onResize);
        window.removeEventListener('pointerup', onResizeEnd);
        document.getElementsByTagName('html')[0].style.userSelect = '';
    };

    const onResizeStart = () => {
        window.addEventListener('pointermove', onResize);
        window.addEventListener('pointerup', onResizeEnd);
        document.getElementsByTagName('html')[0].style.userSelect = 'none';
    };
    node.addEventListener('pointerdown', onResizeStart);

    return {
        destroy() {
            node.removeEventListener('pointerdown', onResizeStart);
        },
    };
};
