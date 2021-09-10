# Svelte EditorJS

Svelte EditorJS aims at easing the creation of plugins for [Editor JS](https://editorjs.io/). Plugins created this way
can be integrated in non-Svelte app.

## Table of contents
1. [Installation](#installation)
2. [Usage](#usage)
   1. [Launching the server](#launching-the-server)
   2. [Consuming components](#consuming-components)
   3. [Exemple](#exemple)
3. [TODO](#todo)
4. [Resources](#resources)

## Installation

* Run `npm install`

## Usage

### Launching the server

* Run `npm run start`

### Consuming components

`npm run build` will bundle the component's source code into a plain JavaScript
module (`dist/svelte-editorjs-plugins.mjs`) and a UMD script (`dist/svelte-editorjs-plugins.js`).

Place this file into your project and import the components from it (this may change)

### Exemple

First you create a plugin in Svelte (like `svelte_base_components/Quote.svete`).

When you're happy with it, you `npm run build`, get the `svelte-editorjs-plugins.mjs` and place it in the project
requiring EditorJS.

There, you can create a class for your EditorJS block the usual way, meaning it should have a `render()` and `save()`
methods. Eg:

    import {Quote} from '../svelte-editorjs-plugins.mjs'

    export default class Quote {
    
        constructor({data}) {
            this.data = data;
        }
    

        static get toolbox() {
            return {
                title: 'Ajouter une citation',
                icon: 'Citation',
            };
        }
    
        render() {
            const wrapper = document.createElement("div")
            this.plugin = new Quote({
                target: wrapper,
                props: {data:this.data}
            })
            return wrapper
        }
    
        save() {
            return this.plugin.data
        }
    
    }

This can easily be abstracted with a base class, like the one in [editorjs_files/_core_plugin.js](https://github.com/GouvernementFR/svelte-editorjs/blob/main/editorjs_files/_core_plugin.js).

You can rapidly develop plugins extending `_core_plugin.js`. For instance:

    import CorePlugin from "./_core_plugin";
    import {Quote} from '../svelte-editorjs-plugins.mjs'

    export default class Quote2 extends CorePlugin {
    
        constructor(...args) {
            super(...args)
            this.Plugin = Quote;
        }
    
        static get toolbox() {
            return {
                title: 'Ajouter une citation 2',
                icon: 'Citation',
            };
        }
    }

Editor is instantiated the traditional way within your project, like this (taken from gvt_website_bo):

    editor = new EditorJS({
        holder: editorSelector,
        tools: configuration,
        data: JSON.parse(json),
    });

## TODO

* [ ] Update the demo : include a form (and update the style of editorjs'UI so that it looks like the BO)
* [ ] Editor instantiation (`editor = new EditorJS()`) may be handled within this project ? This may help to simplify
  form validation, haven't looked much into this though (because we need retro-compatibility with legacy editorjs plugins, for the moment)
* [ ] Adding slots to improve readbility for InlineToolbar component ?
* [ ] Adding tests ?
* [ ] More a note for gvt_website_bo: A configuration may be passed to `_core_plugin.js` containing the information necessary to instantiate a svelte
  plugin and its toolbox. Pros = only one editorjs-style class for all the plugins. Cons: EditorJS's configutation might
  become harder to read. Less easy to see wich plugins are available.

## Resources

- [EditorJS documentation](https://editorjs.io/base-concepts)
- [Svelte tutorial](https://svelte.dev/tutorial/basics). Takes a couple of hours to get through this and start working with Svelte.
