export function inlineToolbarActions(node, inlineToolbar) {
    const headerTags = ['h2', 'h3', 'h4'];

    const checkButtonsState = (selection) => {
        const inlineToolbarOptions = inlineToolbar.inlineToolbarOptions.filter(
            (e) => !headerTags.includes(e)
        );
        for (const option of inlineToolbarOptions) {
            // queryCommand is not used for the fontSize.
            if (option === 'fontSize') {
                const fontSize = window
                    .getComputedStyle(selection.anchorNode.parentElement, null)
                    .getPropertyValue('font-size');
                inlineToolbar.formats[option] = fontSize === '16px';
            } else {
                inlineToolbar.formats[option] =
                    document.queryCommandState(option) || false;
            }
        }
        // Sets the active state for the headers buttons
        const headerLvl = headerTags.find(
            (e) => e === document.queryCommandValue('formatBlock')
        );
        inlineToolbar.formats.headerLevel = headerLvl
            ? parseInt(headerLvl.slice(-1))
            : false;
        // The font weight on title elements makes some browsers believe there is bold applied. That should not happen.
        if (inlineToolbar.formats.bold && inlineToolbar.formats.headerLevel) {
            inlineToolbar.formats.bold = false;
        }
        // Check if there is an hyperlink
        selectionHasLink(selection);
        // Needed by Svelte to trigger reactivity
        /* eslint no-self-assign: "off" */
        inlineToolbar.formats = inlineToolbar.formats;
    };

    function getFirefoxBadSelection(range) {
        const a = range.startContainer.nextSibling;
        const b = range.endContainer.previousSibling;
        let badSelection = false;
        if (a && b && a.isSameNode(b) && a.tagName === 'A') {
            badSelection = a;
        }
        return badSelection;
    }

    function selectionHasLink(selection) {
        const range =
            selection.rangeCount === 0 ? null : selection.getRangeAt(0);
        if (range) {
            const nodes = [
                range.startContainer,
                range.endContainer,
                range.startContainer.parentNode,
                range.endContainer.parentNode,
            ];
            inlineToolbar.linkFormHasLink =
                getFirefoxBadSelection(range) ||
                nodes.find((node) => node.tagName === 'A');
        }
    }

    const handleSelectionStarts = () => {
        // Sets a one-time mouseup event when a selection starts.
        document.addEventListener('mouseup', handleSelectionEnds, {once: true});
    };

    const handleDown = () => {
        if (!inlineToolbar.hidden) {
            inlineToolbar.hidden = true;
        }
    };

    const handleBlur = (e) => {
        if (
            !e.relatedTarget ||
            (!e.relatedTarget.matches('.fr-input') && !inlineToolbar.hidden)
        ) {
            inlineToolbar.hidden = true;
        }
    };

    const handleSelectionEnds = () => {
        const selection = document.getSelection();
        if (selection && selection.toString() !== '') {
            checkButtonsState(selection);
            const parentRect = node.getBoundingClientRect();
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            inlineToolbar.hidden = false;
            inlineToolbar.top = rect.top - parentRect.top;
            inlineToolbar.left = rect.left - parentRect.left + rect.width / 2;
        }
    };

    node.addEventListener('selectstart', handleSelectionStarts);
    node.addEventListener('mousedown', handleDown);
    node.addEventListener('keydown', handleDown);
    node.addEventListener('blur', handleBlur);

    return {
        update(newInlineToolbar) {
            inlineToolbar = newInlineToolbar;
        },
        destroy() {
            node.removeEventListener('selectstart', handleSelectionStarts);
            node.removeEventListener('mousedown', handleDown);
            node.removeEventListener('keydown', handleDown);
            node.removeEventListener('blur', handleBlur);
        },
    };
}
