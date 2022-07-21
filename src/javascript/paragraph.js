import CorePlugin from './_core_plugin';
import Paragraph from '../svelte_plugins/Paragraph.svelte';

export default class SvelteParagraph extends CorePlugin {
    constructor(...args) {
        super(...args);
        this.Plugin = Paragraph;
    }

    static get enableLineBreaks() {
        return true;
    }

    static get toolbox() {
        return {
            icon: 'Paragraphe',
        };
    }

    static get sanitize() {
        return true;
    }

    static get pasteConfig() {
        return {
            tags: ['P', 'UL', 'OL', 'LI'],
        };
    }

    merge(data) {
        this.plugin.data = {
            text: this.plugin.data.text + data.text,
        };
    }

    onPaste(event) {
        const element = event.detail.data;
        let data = element.innerHTML;
        switch (element.tagName) {
            case 'OL':
            case 'UL':
                data = element.outerHTML;
                break;
            case 'LI':
                data = `<ul>${element.outerHTML}</ul>`;
                break;
        }
        this.plugin.data = {
            text: data,
        };
    }

    save() {
        // Needs refacto
        let text = this.plugin.data.text
        if (text.includes("<div lang=")) {
            const parser = new DOMParser();
            const html = parser.parseFromString(text, 'text/html');
            const langDivs = html.querySelectorAll("div[lang]")
            langDivs.forEach(e => {
                const newTag = document.createElement("span")
                newTag.innerHTML = e.innerHTML
                newTag.setAttribute("lang", e.getAttribute("lang"))
                e.replaceWith(newTag)
            })
            this.plugin.data.text = html.body.innerHTML
        }
        return this.plugin.data
    }

    validate(savedData) {
        return savedData.text.trim() !== '';
    }
}
