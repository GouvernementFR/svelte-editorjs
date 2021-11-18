import CorePlugin from "../editorjs_files/_core_plugin";
import {Header} from '../dist/svelte-editorjs-plugins.mjs'


export default class HeaderPlugin extends CorePlugin {

    constructor(...args) {
        super(...args)
        this.Plugin = Header;
    }

    static get enableLineBreaks() {
        return true;
    }

    static get toolbox() {
        return {
            icon: 'Header test',
        };
    }

}
