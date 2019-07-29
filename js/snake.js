Vue.component('snake', {
    data: function () {
        return {
            lives: 3,
            showComponent: true,
            setInterval: null,
            direction: 'left',
            startTimeInterval: 120,
            score: 0,
            snake: {
                shakeLength: 3,
                body: [this.shakeLength]
            },
            dot: {
                isRendered: false
            },
            field: {
                fieldRows: 36,
                fieldCells: 36,
                cells: [this.fieldRows]
            }
        }
    },
    watch: {
        // Следим за очками и каждый раз, как набрали 100 новых,
        // ускоряем темп.
        score: function (val) {
            if (val % 100 === 0) {
                clearInterval(this.setInterval);
                this.startTimeInterval -= 20;
                this.startGame();
            }
        },
        // Следим за жизнями
        lives: function (val) {
            if (val <= -1) {
                clearInterval(this.setInterval);
                this.showComponent = false;
            }
        }
    },

    methods: {
        /**
         * Инициализация игрового поля.
         */
        initField: function () {
            let self = this;

            document.addEventListener('keyup', function (evt) {
                debugger;

                switch (evt.keyCode) {
                    // Пробел (пауза).
                    case 32:
                        self.pauseGame();
                        break;
                    // Влево.
                    case 37:
                        if (self.direction !== 'right') {
                            self.direction = 'left';
                        }
                        break;
                    // Вверх.
                    case 38:
                        if (self.direction !== 'bottom') {
                            self.direction = 'top';
                        }
                        break;
                    // Вправо.
                    case 39:
                        if (self.direction !== 'left') {
                            self.direction = 'right';
                        }
                        break;
                    // Вниз.
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

        /**
         * Инициализация змейки.
         */
        initSnake: function () {
            this.direction = 'left';

            let row = this.field.fieldRows / 2;
            let cell = this.field.fieldCells / 2;

            for (let i = 0; i < this.snake.shakeLength; i++) {
                if (this.snake.body[i]) {
                    this.setCell(this.snake.body[i].row, this.snake.body[i].cell, 'none');
                }

                if (cell < this.field.fieldCells - 1 && row < this.field.fieldRows - 1) {
                    this.snake.body[i] = {
                        row: row,
                        cell: cell++
                    };
                } else if (row < this.field.fieldRows - 1) {
                    this.snake.body[i] = {
                        row: row++,
                        cell: cell
                    };
                } else {
                    this.snake.body[i] = {
                        row: row,
                        cell: cell--
                    };
                }
            }
        },

        /**
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

            this.dot.row = row;
            this.dot.cell = cell;
            this.dot.isRendered = false;
        },

        /**
         * Старт игры.
         */
        startGame: function () {
            this.setInterval = setInterval(this.tick, this.startTimeInterval);
        },

        /**
         * Ставим игру на паузу.
         */
        pauseGame: function () {
            if (this.setInterval) {
                clearInterval(this.setInterval);
                this.setInterval = null;
            } else {
                this.startGame();
            }
        },

        /**
         * Обновляем скорость игры.
         */
        updateInterval: function () {
            clearInterval(this.setInterval);
            this.startGame();
        },

        /**
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

            // Если съели точку, добавляем очки.
            if (newBody[0].row === this.dot.row && newBody[0].cell === this.dot.cell) {
                this.score += 10;
            }

            this.collisionCheck(newBody);
            this.renderField(newBody);
        },

        /**
         * Отрисовываем поле.
         */
        renderField: function (newBody) {
            if (!newBody || newBody.length !== this.snake.shakeLength) {
                return;
            }

            // Рисуем точку если требуется.
            if (!this.dot.isRendered) {
                this.setCell(this.dot.row, this.dot.cell, 'dot');
            }

            let oldCellRow = this.snake.body[this.snake.shakeLength - 1].row;
            let oldCell = this.snake.body[this.snake.shakeLength - 1].cell;

            // Если точка совпадает с концом змейки, удлиняем змейку.
            if (oldCellRow === this.dot.row && oldCell === this.dot.cell) {
                this.snake.body = newBody;
                this.snake.shakeLength++;
                this.snake.body.push({
                    row: oldCellRow,
                    cell: oldCell
                });

                this.initDot();
            } else {
                this.setCell(oldCellRow, oldCell, 'none');
                this.snake.body = newBody;
            }

            // Перерисовываем змейку.
            for (let snakeBody = 0; snakeBody < this.snake.shakeLength; snakeBody++) {
                let row = this.snake.body[snakeBody].row;
                let cell = this.snake.body[snakeBody].cell;

                this.setCell(row, cell, 'snake');
            }
        },

        /**
         * Проверка на столкновения.
         */
        collisionCheck: function (newBody) {
            if (!newBody || newBody.length !== this.snake.shakeLength) {
                return;
            }

            // Столкновение с потолком или полом
            if (newBody[0].row < 0 || newBody[0].row >= this.field.fieldRows) {
                this.lives--;
                this.resetSnake(newBody);
            }

            // Столкноевение со стенами
            if (newBody[0].cell < 0 || newBody[0].cell >= this.field.fieldCells) {
                this.lives--;
                this.resetSnake(newBody);
            }

            // Столкновение с хвостом
            for (let i = 0; i < this.snake.shakeLength; i++) {
                for (let j = 0; j < this.snake.shakeLength; j++) {
                    if (j === i) {
                        continue;
                    }

                    if (newBody[i].row === newBody[j].row &&
                        newBody[i].cell === newBody[j].cell) {
                        this.lives--;
                        this.resetSnake(newBody);
                        break;
                    }
                }
            }
        },

        /**
         * Сбрасываем змейку.
         */
        resetSnake: function (newBody) {
            // Находим все секции змейки и стриаем их.
            for (let row = 0; row < this.field.fieldRows; row++) {
                for (let cell = 0; cell < this.field.fieldCells; cell++) {
                    if (this.field.cells[row][cell].status === 'snake') {
                        this.setCell(row, cell, 'none');
                    }
                }
            }

            // Если объект для отрисовки не задан, инициализируем его.
            if (!newBody) {
                newBody = [];
            }

            // Если длинна объекта для отрисовки не совпадает с длинной обхекта змейки,
            // обновляем его.
            if (newBody.length !== this.snake.shakeLength) {
                newBody = [];

                for (let i = 0; i < this.snake.shakeLength; i++) {
                    newBody[i] = {
                        row: null,
                        cell: null
                    }
                }
            }

            // Если количесов секций змейки больше, чем ее длинна, отризаем лишнее.
            if (this.snake.body.length > this.snake.shakeLength) {
                this.snake.body = this.snake.body.slice(0, this.snake.shakeLength);
            }

            // Заново инициализируем змейку.
            this.initSnake();

            // Обновляем объект для отрисовки.
            for (let i = 0; i < this.snake.shakeLength; i++) {
                newBody[i].row = this.snake.body[i].row;
                newBody[i].cell = this.snake.body[i].cell;
            }
        },

        /**
         * Задаем статус ячейки.
         */
        setCell: function (row, cell, status) {
            if (row === undefined || cell === undefined) {
                console.error("Не заданы координаты ячейки.");
                return;
            }

            if (!status) {
                console.error("Не задан статус ячейки.");
                return;
            }

            let changedRow = this.field.cells[row];
            Vue.set(changedRow, cell, {status: status});
            Vue.set(this.field.cells, row, changedRow);
        }
    },

    /**
     * Инициализация.
     */
    beforeMount() {
        this.initField();
        this.initSnake();
        this.initDot();
        this.startGame();
    }
})
;