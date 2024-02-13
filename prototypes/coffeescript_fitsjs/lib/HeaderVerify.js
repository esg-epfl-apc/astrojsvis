HeaderVerify = {
    verifyOrder: function(keyword, order) {
        if (order !== this.cardIndex) {
            return console.warn(`${keyword} should appear at index ${this.cardIndex} in the FITS header`);
        }
    },
    verifyBetween: function(keyword, value, lower, upper) {
        if (!(value >= lower && value <= upper)) {
            throw `The ${keyword} value of ${value} is not between ${lower} and ${upper}`;
        }
    },
    verifyBoolean: function(value) {
        if (value === "T") {
            return true;
        } else {
            return false;
        }
    },
    VerifyFns: {
        SIMPLE: function(...args) {
            var value;
            value = arguments[0];
            this.primary = true;
            this.verifyOrder("SIMPLE", 0);
            return this.verifyBoolean(value);
        },
        XTENSION: function(...args) {

            console.log("Args");
            console.log(arguments)

            this.extension = true;
            this.extensionType = arguments[0];
            this.verifyOrder("XTENSION", 0);
            return this.extensionType;
        },
        BITPIX: function(...args) {
            var key, value;
            key = "BITPIX";
            value = parseInt(arguments[0]);
            this.verifyOrder(key, 1);
            if (value !== 8 && value !== 16 && value !== 32 && value !== (-32) && value !== (-64)) {
                throw `${key} value ${value} is not permitted`;
            }
            return value;
        },
        NAXIS: function(...args) {
            var array, key, ref, required, value;
            key = "NAXIS";
            value = parseInt(arguments[0]);
            array = arguments[1];
            if (!array) {
                this.verifyOrder(key, 2);
                this.verifyBetween(key, value, 0, 999);
                if (this.isExtension()) {
                    if ((ref = this.extensionType) === "TABLE" || ref === "BINTABLE") {
                        required = 2;
                        if (value !== required) {
                            throw `${key} must be ${required} for TABLE and BINTABLE extensions`;
                        }
                    }
                }
            }
            return value;
        },
        PCOUNT: function(...args) {
            var key, order, ref, required, value;
            key = "PCOUNT";
            value = parseInt(arguments[0]);
            order = 1 + 1 + 1 + this.get("NAXIS");
            this.verifyOrder(key, order);
            if (this.isExtension()) {
                if ((ref = this.extensionType) === "IMAGE" || ref === "TABLE") {
                    required = 0;
                    if (value !== required) {
                        throw `${key} must be ${required} for the ${this.extensionType} extensions`;
                    }
                }
            }
            return value;
        },
        GCOUNT: function(...args) {
            var key, order, ref, required, value;
            key = "GCOUNT";
            value = parseInt(arguments[0]);
            order = 1 + 1 + 1 + this.get("NAXIS") + 1;
            this.verifyOrder(key, order);
            if (this.isExtension()) {
                if ((ref = this.extensionType) === "IMAGE" || ref === "TABLE" || ref === "BINTABLE") {
                    required = 1;
                    if (value !== required) {
                        throw `${key} must be ${required} for the ${this.extensionType} extensions`;
                    }
                }
            }
            return value;
        },
        EXTEND: function(...args) {
            var value;
            value = arguments[0];
            if (!this.isPrimary()) {
                throw "EXTEND must only appear in the primary header";
            }
            return this.verifyBoolean(value);
        },
        BSCALE: function(...args) {
            return parseFloat(arguments[0]);
        },
        BZERO: function(...args) {
            return parseFloat(arguments[0]);
        },
        BLANK: function(...args) {
            var value;
            value = arguments[0];
            if (!(this.get("BITPIX") > 0)) {
                console.warn(`BLANK is not to be used for BITPIX = ${this.get('BITPIX')}`);
            }
            return parseInt(value);
        },
        DATAMIN: function(...args) {
            return parseFloat(arguments[0]);
        },
        DATAMAX: function(...args) {
            return parseFloat(arguments[0]);
        },
        EXTVER: function(...args) {
            return parseInt(arguments[0]);
        },
        EXTLEVEL: function(...args) {
            return parseInt(arguments[0]);
        },
        TFIELDS: function(...args) {
            var value;
            value = parseInt(arguments[0]);
            this.verifyBetween("TFIELDS", value, 0, 999);
            return value;
        },
        TBCOL: function(...args) {
            var index, value;
            value = arguments[0];
            index = arguments[2];
            this.verifyBetween("TBCOL", index, 0, this.get("TFIELDS"));
            return value;
        },
        ZIMAGE: function(...args) {
            return this.verifyBoolean(arguments[0]);
        },
        ZCMPTYPE: function(...args) {
            var value;
            value = arguments[0];
            if (value !== 'GZIP_1' && value !== 'RICE_1' && value !== 'PLIO_1' && value !== 'HCOMPRESS_1') {
                throw `ZCMPTYPE value ${value} is not permitted`;
            }
            if (value !== 'RICE_1') {
                throw `Compress type ${value} is not yet implement`;
            }
            return value;
        },
        ZBITPIX: function(...args) {
            var value;
            value = parseInt(arguments[0]);
            if (value !== 8 && value !== 16 && value !== 32 && value !== 64 && value !== (-32) && value !== (-64)) {
                throw `ZBITPIX value ${value} is not permitted`;
            }
            return value;
        },
        ZNAXIS: function(...args) {
            var array, value;
            value = parseInt(arguments[0]);
            array = arguments[1];
            value = value;
            if (!array) {
                this.verifyBetween("ZNAXIS", value, 0, 999);
            }
            return value;
        },
        ZTILE: function(...args) {
            return parseInt(arguments[0]);
        },
        ZSIMPLE: function(...args) {
            if (arguments[0] === "T") {
                return true;
            } else {
                return false;
            }
        },
        ZPCOUNT: function(...args) {
            return parseInt(arguments[0]);
        },
        ZGCOUNT: function(...args) {
            return parseInt(arguments[0]);
        },
        ZDITHER0: function(...args) {
            return parseInt(arguments[0]);
        }
    }
};