export default class CorePlugin {

    constructor({data}) {
        this.data = data;
    }

    render() {
        const wrapper = document.createElement("div")
        this.plugin = new this.Plugin({
            target: wrapper,
            props: {data: this.data}
        })
        return wrapper
    }


    save() {
        return this.plugin.data
    }

}
