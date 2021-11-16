export function inlineToolbarActions(node, inlineToolbar) {

    const checkButtonsState = () => {
        for (const option of inlineToolbar.inlineToolbarOptions) {
            // queryCommand is not used for the fontSize.
            if (option === "fontSize") {;
                let selection = document.getSelection();
                if (selection) {
                    const fontSize = window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-size');
                    inlineToolbar.formats[option] = fontSize !== "16px"
                }
            } else {
                inlineToolbar.formats[option] = document.queryCommandState(option) || false
            }
            // Needed by Svelte to trigger reactivity
            inlineToolbar.formats = inlineToolbar.formats
        }
    }

    const handleDown = (event) => {
        if (!inlineToolbar.hidden) {
            inlineToolbar.hidden = true
        }
        // Ensure the selection is always properly cleared
        const selection = document.getSelection()
        if (event.type === "mousedown" && selection && !selection.isCollapsed) {
            selection.removeAllRanges();
        }
    };

    const handleBlur = (e) => {
        if (!e.relatedTarget || !e.relatedTarget.matches(".fr-input") && !inlineToolbar.hidden) {
            inlineToolbar.hidden = true
        }
    };

    const handleMouseup = () => {
        let selection = document.getSelection()
        /* Check that some text is selected and that mouseup happens in the parent of the selection.
        That prevents the rare case where a user would start selecting inside an input, then drag the mouse over
        another input, and release the mouse button from there */
        if (selection.toString() !== "" && node.contains(selection.anchorNode)) {
            checkButtonsState()
            let parentRect = node.getBoundingClientRect()
            let rect = selection.getRangeAt(0).getBoundingClientRect();
            inlineToolbar.hidden = false
            inlineToolbar.top = rect.top - parentRect.top;
            inlineToolbar.left = rect.left - parentRect.left + (rect.width / 2);
        }
    };

    node.addEventListener('mousedown', handleDown);
    node.addEventListener('keydown', handleDown);
    node.addEventListener('mouseup', handleMouseup);
    node.addEventListener('blur', handleBlur);

    return {
        update(newInlineToolbar) {
            inlineToolbar = newInlineToolbar;
        },
        destroy() {
            node.removeEventListener('mousedown', handleDown);
            node.removeEventListener('keydown', handleDown);
            node.removeEventListener('mouseup', handleMouseup);
            node.removeEventListener('blur', handleBlur);
        }
    };
}

