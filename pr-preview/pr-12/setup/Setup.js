import {VisualizationComponent} from "../components/VisualizationComponent";
import {FITSSettingsComponent} from "../components/file_type/FITSSettingsComponent";
import {CSVSettingsComponent} from "../components/file_type/CSVSettingsComponent";
import {ArithmeticColumnInput} from "../components/inputs/ArithmeticColumnInput";
import {SettingsComponent} from "../components/SettingsComponent";
import {FileComponent} from "../components/FileComponent";

export class Setup {

    static main_container_id = 'js-vis-main';

    static standard_container_class = 'container';
    static double_container_class = 'container-graph-settings';

    static file_component_column_id = 'column-file';
    static visualization_component_column_id = 'column-graph';
    static settings_component_column_id = 'settings-column';

    constructor() {

    }

    static getMainContainer() {
        let div = document.createElement('div');
        div.setAttribute('id', Setup.main_container_id);

        return div;
    }

    static getStandardContainer() {
        let div = document.createElement('div');
        div.classList.add(Setup.standard_container_class);

        return div;
    }

    static getDoubleColumnContainer() {
        let div = document.createElement('div');
        div.classList.add(Setup.standard_container_class);
        div.classList.add(Setup.double_container_class);

        return div;
    }

    static getFileComponentColumn() {
        let div = document.createElement('div');
        div.setAttribute('id', Setup.file_component_column_id);

        return div;
    }

    static getFileComponentStructure() {
        let element_array = [];

        let container = Setup.getStandardContainer();
        let component_column = Setup.getFileComponentColumn();

        element_array.push(container);
        element_array.push(component_column);

        return element_array;
    }

    static getVisualizationComponentColumn() {
        let div = document.createElement('div');
        div.setAttribute('id', Setup.visualization_component_column_id);

        return div;
    }

    static getVisualizationComponentStructure() {
        let element_array = [];

        let visualization_component_column = Setup.getVisualizationComponentColumn();

        element_array.push(visualization_component_column);

        return element_array;
    }

    static getSettingsComponentColumn() {
        let div = document.createElement('div');
        div.setAttribute('id', Setup.settings_component_column_id);

        return div;
    }

    static getSettingsComponentStructure() {
        let element_array = [];

        let settings_component_column = Setup.getSettingsComponentColumn();
        element_array.push(settings_component_column);

        return element_array;
    }

    static getFileComponent(container_id = null) {
        const file_component = new FileComponent(container_id);
        file_component.setAttribute('id', 'file-component');

        return file_component;
    }

    static getCSVSettingsComponent(file, is_current) {
        const csv_component = new CSVSettingsComponent(file, is_current);

        return csv_component
    }

    static getFITSSettingsComponent(file, is_current)  {
        const fits_component = new FITSSettingsComponent(file, is_current);

        return fits_component;
    }

    static getVisualizationComponent() {
        const visualization_component = new VisualizationComponent();

        return visualization_component;
    }

    static getSettingsComponent() {
        const settings_component = new SettingsComponent();
        settings_component.setAttribute('id', 'settings-component');
        
        return settings_component;
    }

    static getArithmeticColumnComponent() {
        //const arithmetic_column_component = document.createElement('arithmetic-column-component');
        const arithmetic_column_component = new ArithmeticColumnInput();

        return arithmetic_column_component;
    }

}