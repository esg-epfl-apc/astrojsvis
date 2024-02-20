HDU = class HDU {
    constructor(header1, data1) {
        this.header = header1;
        this.data = data1;
    }

    hasData() {
        if (this.data != null) {
            return true;
        } else {
            return false;
        }
    }

};