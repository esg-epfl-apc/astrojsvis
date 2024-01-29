class Utils {

    static getNextBlockPosition(current_position) {

        if(current_position % Header.BLOCK_SIZE !== 0) {
            current_position += Header.BLOCK_SIZE - current_position % Header.BLOCK_SIZE;
        }

        return current_position
    }

}