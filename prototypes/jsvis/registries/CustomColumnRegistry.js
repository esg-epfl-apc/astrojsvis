import {StringUtils} from "../utils/StringUtils";
import {ColumbUtils} from "../utils/ColumnUtils";
import {ArithmeticColumnChangeEvent} from "../events/ArithmeticColumnChangeEvent";

export class CustomColumnRegistry {

    static columns = [];
    static column_counter = 0;

    constructor() {

    }

    static getAvailableColumnsList() {
        CustomColumnRegistry.columns = CustomColumnRegistry.columns.filter(obj => obj !== undefined);
        return CustomColumnRegistry.columns;
    }

    static addToAvailableColumns(column_to_add) {
        let column = { ...column_to_add,
            id: CustomColumnRegistry.column_counter,
        };

        CustomColumnRegistry.columns.push(column);

        CustomColumnRegistry.column_counter++;
    }

    static removeFromAvailableColumns(column_id) {
        CustomColumnRegistry.columns = CustomColumnRegistry.columns.filter(column => column.id !== parseInt(column_id));
    }

    static getColumnById(column_id) {
        let column = null;
        column = CustomColumnRegistry.columns.filter(column => column.id === parseInt(column_id));

        return column;
    }

    static sendRegistryChangeEvent() {
        let acce = new ArithmeticColumnChangeEvent();
        acce.dispatchToSubscribers();
    }

}