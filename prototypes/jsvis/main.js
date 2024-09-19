import { FITSReaderWrapper } from './wrappers/FITSReaderWrapper.js'
import { BokehWrapper } from './wrappers/BokehWrapper.js'
import { D3Wrapper } from './wrappers/D3Wrapper.js'
import { WrapperContainer } from './containers/WrapperContainer.js'
import { VisualizationContainer } from './containers/VisualizationContainer.js'
import { FileComponent } from './components/FileComponent.js'
import { SettingsComponent } from './components/SettingsComponent.js'
import { VisualizationComponent } from './components/VisualizationComponent.js'
import { FITSSettingsComponent } from './components/file_type/FITSSettingsComponent.js'
import { CSVSettingsComponent } from './components/file_type/CSVSettingsComponent.js'
import { D3Graph } from "./visualizations/D3Graph";
import { BokehGraph } from "./visualizations/BokehGraph";
import {FileRegistry} from "./registries/FileRegistry";
import {RegistryContainer} from "./containers/RegistryContainer";
import {ArithmeticColumnInput} from "./components/inputs/ArithmeticColumnInput";
import {CustomColumnRegistry} from "./registries/CustomColumnRegistry";
import {Setup} from "./setup/Setup";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import '/css/styles.css';

let file_path = window.location.href + "_test_files/spiacs_lc_query.fits";

//let fits_reader_wrapper = new FITSReaderWrapper(file_path);

let bokeh_wrapper = new BokehWrapper();

let d3_wrapper = new D3Wrapper();

//WrapperContainer.setFITSReaderWrapper(fits_reader_wrapper);
WrapperContainer.setBokehWrapper(bokeh_wrapper);
WrapperContainer.setD3Wrapper(d3_wrapper);

VisualizationContainer.setBokehVisualization(new BokehGraph());
VisualizationContainer.setD3Visualization(new D3Graph());

RegistryContainer.setFileRegistry(new FileRegistry());
RegistryContainer.setCustomColumnRegistry(new CustomColumnRegistry());

customElements.define('file-component', FileComponent);
customElements.define('settings-component', SettingsComponent);
customElements.define('visualization-component', VisualizationComponent);
customElements.define('fits-component', FITSSettingsComponent);
customElements.define('csv-component', CSVSettingsComponent);
customElements.define('arithmetic-column-component', ArithmeticColumnInput);

export function init(html_anchor_id) {

    let anchor_element = document.getElementById(html_anchor_id);

    let components = getComponentsObject();
    let main_container = getMainDiv();

    let file_component_struct = getFileComponentStructure();
    let visualization_component_struct = getVisualizationComponentStructure();
    let settings_component_struct = getSettingsComponentStructure();

    let graph_settings_double_container = getDoubleContainer();

    anchor_element.appendChild(main_container);

    main_container.appendChild(file_component_struct[0]);
    file_component_struct[0].appendChild(file_component_struct[1]);
    file_component_struct[1].appendChild(components.file_component);
    components.file_component.setup();

    main_container.appendChild(graph_settings_double_container);

    graph_settings_double_container.appendChild(visualization_component_struct[0])
    visualization_component_struct[0].appendChild(components.visualization_component);
    components.visualization_component.setup();

    graph_settings_double_container.appendChild(settings_component_struct[0]);
    settings_component_struct[0].appendChild(components.settings_components);
    components.settings_components.setup();

    d3_wrapper.setup();
    VisualizationContainer.getD3Visualization().setup();

    bokeh_wrapper.setup();
    VisualizationContainer.getBokehVisualization().setup();

    loadFITSFile();
}

function getMainDiv() {
    let main_container = Setup.getMainContainer();

    return main_container;
}

function getComponentContainer() {
    let component_container = Setup.getStandardContainer();

    return component_container;
}

function getDoubleContainer() {
    let double_container = Setup.getDoubleColumnContainer();

    return double_container;
}

function getComponentsObject() {
    let components = {};

    components.file_component = Setup.getFileComponent();
    components.visualization_component = Setup.getVisualizationComponent();
    components.settings_components = Setup.getSettingsComponent();

    return components;
}

function getFileComponentStructure() {
    let file_component_struct = Setup.getFileComponentStructure();

    return file_component_struct;
}

function getVisualizationComponentStructure() {
    let visualization_component_struct = Setup.getVisualizationComponentStructure();

    return visualization_component_struct;
}

function getSettingsComponentStructure() {
    let settings_component_struct = Setup.getSettingsComponentStructure();

    return settings_component_struct;
}

function loadFITSFile() {
    let fits_reader_wrapper = new FITSReaderWrapper(file_path);
    setFITSReaderWrapper(fits_reader_wrapper);
}

function setFITSReaderWrapper(fits_reader_wrapper) {
    WrapperContainer.setFITSReaderWrapper(fits_reader_wrapper);
}