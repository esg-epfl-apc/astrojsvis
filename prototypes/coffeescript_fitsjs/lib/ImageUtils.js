ImageUtils = {

    // Compute the minimum and maximum pixels
    getExtent: function(arr) {
        var index, max, min, value;

        // Set initial values for min and max
        index = arr.length;
        while (index--) {
            value = arr[index];
            if (isNaN(value)) {
                continue;
            }
            min = max = value;
            break;
        }
        if (index === -1) {
            return [0/0, 0/0];
        }

        // Continue loop to find extent
        while (index--) {
            value = arr[index];
            if (isNaN(value)) {
                continue;
            }
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        }
        return [min, max];
    },
    getPixel: function(arr, x, y) {
        return arr[y * this.width + x];
    }
};