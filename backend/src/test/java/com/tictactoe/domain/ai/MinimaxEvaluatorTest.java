package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.Mark;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MinimaxEvaluatorTest {

    @Test
    void prefersTheImmediateWinOverADelayedOne() {
        Board board = new Board();
        board.place(0, Mark.O);
        board.place(1, Mark.O);
        board.place(3, Mark.X);
        board.place(4, Mark.X);

        int move = MinimaxEvaluator.bestMove(board, Mark.O);

        assertThat(move).isEqualTo(2);
    }

    @Test
    void blocksAForcedFork() {
        Board board = new Board();
        board.place(0, Mark.X);
        board.place(8, Mark.X);
        board.place(4, Mark.O);

        int move = MinimaxEvaluator.bestMove(board, Mark.O);

        assertThat(move).isIn(1, 3, 5, 7);
    }

    @Test
    void choosesAnyCornerOnAnEmptyBoard() {
        Board board = new Board();

        int move = MinimaxEvaluator.bestMove(board, Mark.X);

        assertThat(move).isIn(0, 2, 4, 6, 8);
    }

    @Test
    void throwsWhenTheBoardIsFull() {
        Board board = new Board();
        board.place(0, Mark.X);
        board.place(1, Mark.O);
        board.place(2, Mark.X);
        board.place(3, Mark.O);
        board.place(4, Mark.X);
        board.place(5, Mark.O);
        board.place(6, Mark.O);
        board.place(7, Mark.X);
        board.place(8, Mark.O);

        assertThat(board.isFull()).isTrue();
        assertThat(
                org.assertj.core.api.Assertions.catchThrowable(
                        () -> MinimaxEvaluator.bestMove(board, Mark.X)))
                .isInstanceOf(IllegalStateException.class);
    }
}
