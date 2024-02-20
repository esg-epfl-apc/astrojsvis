class Base {
    static include(obj) {
        var key, value;
        for (key in obj) {
            value = obj[key];
            this.prototype[key] = value;
        }
        return this;
    }

    static extend(obj) {
        var key, value;
        for (key in obj) {
            value = obj[key];
            this[key] = value;
        }
        return this;
    }

    proxy(func) {
        return () => {
            return func.apply(this, arguments);
        };
    }

    invoke(callback, opts, data) {
        var context;
        context = (opts != null ? opts.context : void 0) != null ? opts.context : this;
        if (callback != null) {
            return callback.call(context, data, opts);
        }
    }

};