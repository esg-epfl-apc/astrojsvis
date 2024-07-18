export class ExpressionParser {

    static standard_functions = ['Math.sqrt',
        'Math.abs',
        'Math.cos',
        'Math.sin',
        'Math.max',
        'Math.min',
        'Math.pow',
        'Math.log',
        'Math.round'
    ];

    static custom_functions = [];

    expression = null;
    blocks = [];

    constructor(expression = null) {
        this.expression = expression;
    }

    setExpression(expression) {
        this.expression = expression;
    }

    parseExpression() {
        if(this.expression) {

            for(let i = 0; this.expression.length; i++) {

                let curr_char = this.expression[i];

            }

        }
    }

    basicExpressionEvaluation() {
        let expression_result = null;

        try {
            expression_result = eval(this.expression);
        } catch(e) {

        }

        return expression_result;
    }

    customExpressionEvaluation() {

    }

    checkExpression() {

        let expression_type = 'standard';

        const regex_is_operator_number = /[+\-*/0-9.]+/;

        let expression_parts = this.expression.split(/\s+/);

        expression_parts.forEach(part => {
            if (!regex_is_operator_number.test(part)) {
                if (ExpressionParser.standard_functions.includes(part)) {

                } else if (ExpressionParser.custom_functions.includes(part)) {
                    expression_type = 'custom';
                } else {
                    expression_type = null;
                    return expression_type;
                }
            }
        });

        return expression_type;
    }

}