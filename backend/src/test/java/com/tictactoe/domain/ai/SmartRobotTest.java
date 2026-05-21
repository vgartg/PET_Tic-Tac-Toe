package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.GameStatus;
import com.tictactoe.domain.Mark;
import org.junit.jupiter.api.Test;

import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

import static org.assertj.core.api.Assertions.assertThat;

class SmartRobotTest {

    private static final long SEED = 0xC0FFEEL;

    private static RandomGenerator seededRandom() {
        return RandomGeneratorFactory.of("L64X128MixRandom").create(SEED);
    }

    @Test
    void reportsImpossibleDifficulty() {
        SmartRobot robot = new SmartRobot(seededRandom());
        assertThat(robot.difficulty()).isEqualTo(Difficulty.IMPOSSIBLE);
    }

    @Test
    void takesAnImmediateWinWhenAvailable() {
        Board board = new Board();
        board.place(0, Mark.O);
        board.place(1, Mark.O);
        board.place(3, Mark.X);
        board.place(4, Mark.X);
        SmartRobot robot = new SmartRobot(seededRandom());

        int move = robot.chooseMove(board, Mark.O);

        assertThat(move).isEqualTo(2);
    }

    @Test
    void blocksAnOpponentImmediateWin() {
        Board board = new Board();
        board.place(0, Mark.X);
        board.place(1, Mark.X);
        board.place(4, Mark.O);
        SmartRobot robot = new SmartRobot(seededRandom());

        int move = robot.chooseMove(board, Mark.O);

        assertThat(move).isEqualTo(2);
    }

    @Test
    void choosesTheCenterAgainstACornerOpening() {
        Board board = new Board();
        board.place(0, Mark.X);
        SmartRobot robot = new SmartRobot(seededRandom());

        int move = robot.chooseMove(board, Mark.O);

        assertThat(move).isEqualTo(4);
    }

    @Test
    void choosesACornerOrEdgeAgainstACenterOpening() {
        Board board = new Board();
        board.place(4, Mark.X);
        SmartRobot robot = new SmartRobot(seededRandom());

        int move = robot.chooseMove(board, Mark.O);

        assertThat(move).isIn(0, 2, 6, 8);
    }

    @Test
    void neverLosesWhenPlayingSecondAgainstRandomOpponent() {
        for (long seed = 0L; seed < 60L; seed++) {
            playFullGameAndAssertNoLoss(seed);
        }
    }

    @Test
    void playsToADrawAgainstItself() {
        SmartRobot xRobot = new SmartRobot(seededRandom());
        SmartRobot oRobot = new SmartRobot(seededRandom());
        Board board = new Board();
        Mark turn = Mark.X;

        while (board.computeStatus() == GameStatus.IN_PROGRESS) {
            int move = (turn == Mark.X)
                    ? xRobot.chooseMove(board, Mark.X)
                    : oRobot.chooseMove(board, Mark.O);
            board.place(move, turn);
            turn = turn.opponent();
        }

        assertThat(board.computeStatus()).isEqualTo(GameStatus.DRAW);
    }

    private static void playFullGameAndAssertNoLoss(long seed) {
        RandomGenerator opponentRng =
                RandomGeneratorFactory.of("L64X128MixRandom").create(seed);
        RandomGenerator robotRng =
                RandomGeneratorFactory.of("L64X128MixRandom").create(seed ^ 0xDEADBEEFL);
        SmartRobot smart = new SmartRobot(robotRng);
        Board board = new Board();
        Mark humanMark = Mark.X;
        Mark smartMark = Mark.O;
        Mark turn = Mark.X;

        while (board.computeStatus() == GameStatus.IN_PROGRESS) {
            int move;
            if (turn == humanMark) {
                var empties = board.emptyCells();
                move = empties.get(opponentRng.nextInt(empties.size()));
            } else {
                move = smart.chooseMove(board, smartMark);
            }
            board.place(move, turn);
            turn = turn.opponent();
        }

        GameStatus status = board.computeStatus();
        assertThat(status)
                .as("SmartRobot must never lose, seed=%d, board=%s", seed, board.snapshot())
                .isNotEqualTo(GameStatus.X_WON);
    }
}
