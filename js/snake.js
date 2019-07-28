Vue.component('snake', {
    data: function () {
        return {
            showComponent: true,
            shakeLength: 5,
            field: {
                fieldRows: 50,
                fieldCells: 50,
                cells: [this.fieldRows]
            }
        }
    },
    methods: {
        initField: function () {
            for (let row = 0; row < this.field.fieldRows; row++) {
                this.field.cells[row] = [this.field.fieldCells];

                for (let cell = 0; cell < this.field.fieldCells; cell++) {
                    this.field.cells[row][cell] = {
                        status: 'none'
                    }
                }
            }
        },
        initSnake: function () {
            let startRow = this.field.fieldRows / 2;
            let startCell = this.field.fieldCells / 2;

            for (let snakeBody = 0; snakeBody < this.shakeLength; snakeBody++) {
                this.field.cells[startRow][startCell + snakeBody].status = 'snake';
            }
        },
        initDot: function () {
            let row;
            let cell;

            do {
                let minRow = 0;
                let maxRow = this.field.fieldRows;
                row = Math.floor(Math.random() * (+maxRow - +minRow)) + +minRow;

                let minCell = 0;
                let maxCell = this.field.fieldRows;
                cell = Math.floor(Math.random() * (+maxCell - +minCell)) + +minCell;
            } while (this.field.cells[row][cell].status == 'snake');

            this.field.cells[row][cell].status = 'dot';
        },
        start: function (event) {
            debugger;
        }
    },
    beforeMount() {
        this.initField();
        this.initSnake();
        this.initDot();
    }
})
;