import {ExpressionParser} from "./ExpressionParser";

export class ExpressionBlock {

    content = null;

    start_pos = null;
    stop_pos = null;

    expression_parser = null;

    constructor(block, start, stop) {
        this.content = block;
        this.start_pos = start;
        this.stop_pos = stop;

        this.expression_parser = new ExpressionParser(block);
    }

    parseBlock() {
        //this.expression_parser.parseExpression(this.content);

        let expression_type = this.isBlockStandard();

        if(expression_type) {
            let result = this.expression_parser.basicExpressionEvaluation(this.content);
        } else if(expression_type === false) {

        } else {

        }
    }

    isBlockStandard() {

        let expression_type = this.expression_parser.checkExpression(this.content);

        if(expression_type === 'standard') {
            return true;
        } else if(expression_type === 'custom') {
            return false;
        } else {
            return null;
        }
    }

}