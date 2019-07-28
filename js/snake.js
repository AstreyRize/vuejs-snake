Vue.component('snake', {
    data: function () {
        return {
            showComponent: true,
            direction: 'left',
            startTimeInterval: 120,
            snake: {
                shakeLength: 5,
                body: [this.shakeLength]
            },
            field: {
                fieldRows: 50,
                fieldCells: 50,
                cells: [this.fieldRows]
            }
        }
    },

    methods: {
        /*
        * Инициализация игрового поля.
        */
        initField: function () {
            let self = this;

            document.addEventListener('keyup', function (evt) {
                debugger;

                switch (evt.keyCode) {
                    case 37:
                        if (self.direction !== 'right') {
                            self.direction = 'left';
                        }
                        break;
                    case 38:
                        if (self.direction !== 'bottom') {
                            self.direction = 'top';
                        }
                        break;
                    case 39:
                        if (self.direction !== 'left') {
                            self.direction = 'right';
                        }
                        break;
                    case 40:
                        if (self.direction !== 'top') {
                            self.direction = 'bottom';
                        }
                        break;
                }
            });

            for (let row = 0; row < this.field.fieldRows; row++) {
                this.field.cells[row] = [this.field.fieldCells];

                for (let cell = 0; cell < this.field.fieldCells; cell++) {
                    this.field.cells[row][cell] = {
                        status: 'none'
                    }
                }
            }
        },

        /*
        * Инициализация змейки.
        */
        initSnake: function () {
            let startRow = this.field.fieldRows / 2;
            let startCell = this.field.fieldCells / 2;

            for (let snakeBody = 0; snakeBody < this.snake.shakeLength; snakeBody++) {
                // Координаты каждой секции змейки.
                this.snake.body[snakeBody] = {
                    row: startRow,
                    cell: startCell + snakeBody
                };
            }
        },

        /*
        * Инициализация точки.
        */
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
            } while (this.field.cells[row][cell].status === 'snake');

            this.field.cells[row][cell].status = 'dot';
        },

        /*
        * Старт игры.
        */
        startGame: function (event) {
            setInterval(this.tick, this.startTimeInterval);
        },

        /*
        * Логика нового кадра.
        */
        tick: function () {
            let newBody = [this.snake.shakeLength];

            // На основенаправления задаем новые координаты головы
            switch (this.direction) {
                case 'top':
                    newBody[0] = {
                        row: this.snake.body[0].row - 1,
                        cell: this.snake.body[0].cell,
                    };
                    break;
                case 'bottom':
                    newBody[0] = {
                        row: this.snake.body[0].row + 1,
                        cell: this.snake.body[0].cell,
                    };
                    break;
                case 'left':
                    newBody[0] = {
                        row: this.snake.body[0].row,
                        cell: this.snake.body[0].cell - 1,
                    };
                    break;
                case 'right':
                    newBody[0] = {
                        row: this.snake.body[0].row,
                        cell: this.snake.body[0].cell + 1,
                    };
                    break;
            }

            // Пересчитываем координаты тела змейки.
            for (let snakeBody = 1; snakeBody < this.snake.body.length; snakeBody++) {
                newBody[snakeBody] = {
                    row: this.snake.body[snakeBody - 1].row,
                    cell: this.snake.body[snakeBody - 1].cell
                }
            }

            this.renderField(newBody);
        },

        /*
        * Отрисовываем поле.
        */
        renderField: function (newBody) {
            let oldCellRow = this.snake.body[this.snake.shakeLength - 1].row;
            let oldCell = this.snake.body[this.snake.shakeLength - 1].cell;

            this.setCell(oldCellRow, oldCell, 'none');
            this.snake.body = newBody;

            for (let snakeBody = 0; snakeBody < this.snake.shakeLength; snakeBody++) {
                let row = this.snake.body[snakeBody].row;
                let cell = this.snake.body[snakeBody].cell;

                this.setCell(row, cell, 'snake');
            }
        },

        /*
        * Задаем статус ячейки.
        */
        setCell: function (row, cell, status) {
            let changedRow = this.field.cells[row];
            Vue.set(changedRow, cell, {status: status});
            Vue.set(this.field.cells, row, changedRow);
        }
    },

    /*
    * Инициализация.
    */
    beforeMount() {
        this.initField();
        this.initSnake();
        this.initDot();
        this.startGame();
    }
});