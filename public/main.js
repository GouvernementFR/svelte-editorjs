import EditorJS from '@editorjs/editorjs';
import '@gouvfr/dsfr/dist/css/dsfr.min.css';
import '@gouvfr/dsfr/dist/js/dsfr.module.min';
import './main.css'
import Quote from "../editorjs_files/quote"

const editor = new EditorJS({
    holder: 'editorjs',
    tools: {
        Quotes:Quote
    }
});

