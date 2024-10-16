export class VisualizationComponent extends HTMLElement {

    container_id;
    container

    content = '<div id="visualization-container">' +
                     '</div>'

    constructor(container_id = 'visualization-container') {
        super();

        this.innerHTML = this.content;

        this.container_id = container_id;
        //this._setContainer();
    }

    setup() {
        this._setContainer();
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    resetContainer() {
        this.container.innerHTML = "";
    }

}