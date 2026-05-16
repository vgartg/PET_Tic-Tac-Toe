package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.Mark;
import org.junit.jupiter.api.Test;

import java.util.random.RandomGenerator;

import static org.assertj.core.api.Assertions.assertThat;

class HardRobotTest {

    @Test
    void firstMoveTakesCenterWhenAvailable() {
        HardRobot robot = new HardRobot(RandomGenerator.of("L64X128MixRandom"));
        Board board = new Board();

        int move = robot.chooseMove(board, Mark.X);

        assertThat(move).isEqualTo(4);
    }

    @Test
    void firstMoveTakesCornerWhenCenterTaken() {
        HardRobot robot = new HardRobot(RandomGenerator.of("L64X128MixRandom"));
        Board board = new Board();
        board.place(4, Mark.O);

        int move = robot.chooseMove(board, Mark.X);

        assertThat(move).isIn(0, 2, 6, 8);
    }

    @Test
    void completesOwnLineToWin() {
        HardRobot robot = new HardRobot(RandomGenerator.of("L64X128MixRandom"));
        Board board = new Board();
        board.place(0, Mark.X);
        board.place(1, Mark.X);
        board.place(8, Mark.O);

        int move = robot.chooseMove(board, Mark.X);

        assertThat(move).isEqualTo(2);
    }

    @Test
    void completesOwnDiagonal() {
        HardRobot robot = new HardRobot(RandomGenerator.of("L64X128MixRandom"));
        Board board = new Board();
        board.place(0, Mark.X);
        board.place(4, Mark.X);
        board.place(1, Mark.O);

        int move = robot.chooseMove(board, Mark.X);

        assertThat(move).isEqualTo(8);
    }
}
