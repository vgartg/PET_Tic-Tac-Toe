package com.tictactoe.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BoardTest {

    @Test
    void newBoardIsEmpty() {
        Board board = new Board();

        assertThat(board.emptyCells()).hasSize(Board.CELL_COUNT);
        assertThat(board.isFull()).isFalse();
        assertThat(board.computeStatus()).isEqualTo(GameStatus.IN_PROGRESS);
    }

    @Test
    void placingOccupiedCellThrows() {
        Board board = new Board();
        board.place(0, Mark.X);

        assertThatThrownBy(() -> board.place(0, Mark.O))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void detectsRowWin() {
        Board board = new Board();
        board.place(0, Mark.X);
        board.place(1, Mark.X);
        board.place(2, Mark.X);

        assertThat(board.computeStatus()).isEqualTo(GameStatus.X_WON);
    }

    @Test
    void detectsColumnWin() {
        Board board = new Board();
        board.place(1, Mark.O);
        board.place(4, Mark.O);
        board.place(7, Mark.O);

        assertThat(board.computeStatus()).isEqualTo(GameStatus.O_WON);
    }

    @Test
    void detectsDiagonalWin() {
        Board board = new Board();
        board.place(2, Mark.X);
        board.place(4, Mark.X);
        board.place(6, Mark.X);

        assertThat(board.computeStatus()).isEqualTo(GameStatus.X_WON);
    }

    @Test
    void detectsDraw() {
        Board board = new Board();
        Mark[] layout = {
                Mark.X, Mark.O, Mark.X,
                Mark.X, Mark.O, Mark.O,
                Mark.O, Mark.X, Mark.X
        };
        for (int i = 0; i < layout.length; i++) {
            board.place(i, layout[i]);
        }

        assertThat(board.isFull()).isTrue();
        assertThat(board.computeStatus()).isEqualTo(GameStatus.DRAW);
    }
}
