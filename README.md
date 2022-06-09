# Svelte EditorJS

Svelte EditorJS aims at easing the creation of plugins for [Editor JS](https://editorjs.io/). Plugins created this way
can be integrated in non-Svelte app.

## Table of contents

1. [Installation](#installation)
2. [Build](#build)
3. [Demo usage](#demo-usage)
   1. [Launching the test server](#launching-the-test-server)
4. [Plugins](#plugins)
   1. [Structure / how plugin are made ?](#structure--how-plugin-are-made-)
   2. [Base plugins](#base-plugins)
   3. [Available plugins](#available-plugins)
5. [TODO](#todo)
6. [Resources](#resources)

## Installation

Run `npm install`.

## Prettifying

Run `npm run prettify`.

## Build

Run `npm run build`.

This command will bundle the Svelte plugins into a javascript file named `svelte-editorjs.mjs` and a css file named `svelte-editorjs.css`. They will be located in `public/build`.

_Note : You can edit [rollup.config.js](rollup.config.js) if you need to change the build settings (e.g. bundle everything into a single file, rename the output files, change their formats etc.)._

## Demo usage

This project includes a test server / demo to show how the Svelte plugins can be integrated with editorJS (and how they are rendered).

To put it in a nutshell : once `svelte-editorjs.mjs` and `svelte-editorjs.css` have been built, Svelte plugins can directly be imported and used for the instantiation of EditorJS (`const editor = new EditorJS()...` / see [public/example_configuration.js](public/example_configuration.js)
as well as [EditorJS documentation](https://editorjs.io/base-concepts)).

The demo also includes a "check saved data" utility, which can help reviewing editorjs underlying data structure (array of json objects).

### Launching the test server

Run `npm run dev` (hot reloading is enabled).

_Note : there is also a `npm run start` command._

## Plugins

### Structure / how plugin are made ?

Compatibility with legacy editorjs plugins was needed. So the project is not 100% Svelte. Two files are needed for a plugin to work:

- A `.svelte` file that handle all the plugin logic, underlying data and aesthetics;
- A vanilla javascript file, in which a default class extending `CorePlugin` is exported (see [src/javascript/\_core_plugin.js](/src/javascript/_core_plugin.js)). The `constructor()` method of this class should define a plugin property = to the plugin imported from your `.svelte` file.

_Note : If needed, some default editorjs methods/getters/setters to customize the plugin can be added in the default class. For instance, `static get toolbox()` is always defined in the existing plugins to set the icons and titles that are displayed within editorjs toolbox (see the [documentation](https://editorjs.io/api) for the different APIs available)._

The available plugins are all located into [src/svelte_plugins](src/svelte_plugins). Their related javascript is stored in [src/javascript](src/javascript).

### Base plugins

[src/svelte_base_plugin](src/svelte_base_plugins) include some base components that can be used to create plugins.

#### Input

[src/svelte_base_plugins/Input.svelte](src/svelte_base_plugins/Input.svelte) can be used wherever a plugin requires an input.

It accepts several props when instantiated :

- `text`: sets the textContent of the input
- `html`: sets the innerHtml of the input
- `placeholder`: sets the input placeholder (`null` by default)
- `required`: specifies that the input must be filled out.
- `minlength`: defines the minimum number of characters the user can enter into the input.
- `maxlength`: defines the maximum number of characters the user can enter into the input.
- `url`: if set to `true`, the input value is automatically validated to ensure that it's a properly-formatted URL.
- `classes`: a string that specifies one or more classnames for the input.
- `inlineToolbarOptions`: an array that must contain valid toolbar options. See [InlineToolbar](#inlinetoolbar) for more information.
- `nowrap`: if `true`, the input will not wrap even if a lot of characters are entered within the input (applies `white-space: nowrap` + `overflow: hidden`).

`required`, `minlength`, `maxlength`, `url` are validated respectively with `requiredValidator`, `minLengthValidator`, `maxLengthValidator` and `linkValidator` which are all defined in [src/svelte_base_plugins/validators.js](src/svelte_base_plugins/validators.js).

Example:

```
const exampleInput = {
  placeholder: "Adds some text",
  nowrap: true,
  classes: "fr-text fr-text--xs",
};

<Input {...exampleInput}/>
```

#### InlineToolbar

[src/svelte_base_plugins/InlineToolbar.svelte](src/svelte_base_plugins/InlineToolbar.svelte) can be used to add an inline toolbar to an `<Input/>` via the `inlineToolbarOptions` prop. This toolbar allow the user to format a selection within the input.

Available options:

- `fontSize`: toggles `fr-text`/`fr-text--lg` for the selection.
- `bold`: toggles bold on/off for the selection.
- `italic`: toggles italics on/off for the selection.
- `insertOrderedList`: creates a numbered ordered list for the selection.
- `insertUnorderedList`: creates a bulleted unordered list for the selection.
- `createLink`: toggles `LinkForm` visibility, allowing to add/remove/edit an hyperlink for the selection (see [LinkForm](#linkform)).
- `anchor`: toggles `AnchorForm` visibility, allowing to add/remove/edit an anchor for the whole block (see [AnchorForm](#anchorform)).
- `createLang`: toggles `LangForm` visibility, allowing to add/remove/edit an attribute `lang` for the selection (see [LangForm](#langform)).

Example:

```
const exampleInput = {
  placeholder: "Adds some text",
  minLength: 10,
  inlineToolbarOptions: ["bold", "italic", "createLink", "anchor", "createLang"],
};

<Input {...exampleInput}/>
```

_Note : [src/svelte_base_plugins/LinkForm.svelte](src/svelte_base_plugins/LinkForm.svelte) is imported in InlineToolbar.svelte. It is only used when `inlineToolbarOptions` includes "createLink"._

### Available plugins

Plugins directly available for use with EditorJS.

_Note: The structure of the plugins underlying data being saved on editor.save() is not perfect for various reasons (to sum it up: keys/values where chosen in a hurry). It might be improved._

#### Button

Implements DSFR [buttons](https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217284660/Boutons+-+Buttons).

Keys/values saved:

- `openWindow` : either "Yes" or "No".
- `type`: either "Primary Button" or "Secondary Button".
- `size`: "Small", "Medium", "Large".
- `text`: strings.
- `link`: strings.

Example of saved data :

```
{
  openWindow:"Yes"
  type:"Primary Button"
  size:"Medium"
  text:"test"
  link:"https://www.google.fr"
}
```

#### Callout

#### Header

#### Highlight

#### Link

#### Quote

#### Paragraph

## TO DO

- [ ] Validation and UI related to validation (error messages etc.) are yet to be properly defined by the gouv team.
- [ ] Adding tests ?
- [ ] A configuration may be passed to `_core_plugin.js` containing the information necessary to instantiate a svelte
      plugin and its toolbox. Pros : only one editorjs-style class for all the plugins. Cons : EditorJS's configuration might
      become harder to read. Less flexible.

## Resources

- [EditorJS documentation](https://editorjs.io/base-concepts)
- [Svelte tutorial](https://svelte.dev/tutorial/basics). Takes a couple of hours to get through this and start working with Svelte.
