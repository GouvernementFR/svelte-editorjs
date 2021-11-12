import CorePlugin from "../editorjs_files/_core_plugin";
import {Quote} from '../dist/svelte-editorjs-plugins.mjs'


export default class QuoteTest extends CorePlugin {

    constructor(...args) {
        super(...args)
        this.Plugin = Quote;
    }

    static get enableLineBreaks() {
        return true;
    }

    static get toolbox() {
        return {
            icon: 'Citation test',
        };
    }

}
