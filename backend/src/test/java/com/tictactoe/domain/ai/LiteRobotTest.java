package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.Mark;
import org.junit.jupiter.api.Test;

import java.util.random.RandomGenerator;

import static org.assertj.core.api.Assertions.assertThat;

class LiteRobotTest {

    @Test
    void picksOnlyAvailableCell() {
        LiteRobot robot = new LiteRobot(RandomGenerator.of("L64X128MixRandom"));
        Board board = new Board();
        for (int i = 0; i < Board.CELL_COUNT - 1; i++) {
            board.place(i, i % 2 == 0 ? Mark.X : Mark.O);
        }

        int move = robot.chooseMove(board, Mark.X);

        assertThat(move).isEqualTo(Board.CELL_COUNT - 1);
    }

    @Test
    void alwaysPicksEmptyCell() {
        LiteRobot robot = new LiteRobot(RandomGenerator.of("L64X128MixRandom"));
        Board board = new Board();
        board.place(0, Mark.X);
        board.place(4, Mark.O);
        board.place(8, Mark.X);

        for (int i = 0; i < 50; i++) {
            int move = robot.chooseMove(board, Mark.O);
            assertThat(board.isCellEmpty(move)).isTrue();
        }
    }
}
