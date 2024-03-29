// Base class for FITS data units (e.g. Primary, BINTABLE, TABLE, IMAGE).  Derived classes must
// define an instance attribute called length describing the byte length of the data unit.
class DataUnit extends Base {

    // Endian swaps are needed for performance.  All FITS images are stored in big
    // endian format, but typed arrays initialize based on the endianness of the CPU (typically little endian).
    // Swaps are triggered to recover the correct values.

    // TODO: Check endianness of client machine by defining a typed array with a known value.
    // Initialize a second typed array using the underlying byte representation.
    // The arrays should be identical if working on a little endian machine.
    // arr = new Uint16Array([524])
    // value = new Uint16Array(arr.buffer)[0]
    // @littleEndian = if value is 524 then true else false
    /*
    static swapEndian = {
        B: function(value) {
            return value;
        },
        I: function(value) {
            return (value << 8) | (value >> 8);
        },
        J: function(value) {
            return ((value & 0xFF) << 24) | ((value & 0xFF00) << 8) | ((value >> 8) & 0xFF00) | ((value >> 24) & 0xFF);
        }
    };

    DataUnit.swapEndian[8] = DataUnit.swapEndian['B'];

    DataUnit.swapEndian[16] = DataUnit.swapEndian['I'];

    DataUnit.swapEndian[32] = DataUnit.swapEndian['J'];
    */

    // Data units are initialized with the associated header and data that is either
    // 1) ArrayBuffer
    // 2) Blob
    // In the case of the array buffer, the entire file structure is already in memory.
    // The blob has not yet placed the file in memory.
    constructor(header, data) {
        super();
        if (data instanceof ArrayBuffer) {
            this.buffer = data;
        } else {
            this.blob = data;
        }
    }

}