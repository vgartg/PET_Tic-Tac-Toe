package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.Mark;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.random.RandomGenerator;

/**
 * A {@link RobotPlayer} that plays a provably optimal game by exhausting the
 * minimax tree on every turn. Because Tic-Tac-Toe is a solved game, a SmartRobot
 * cannot lose: a human can at best force a draw.
 *
 * <p>To keep play visually interesting we still randomise between equally
 * scored moves — minimax produces a set of choices that all share the same
 * optimal value, and any of them is acceptable.</p>
 */
@Component
public class SmartRobot implements RobotPlayer {

    private final RandomGenerator random;

    public SmartRobot() {
        this(RandomGenerator.getDefault());
    }

    public SmartRobot(RandomGenerator random) {
        this.random = random;
    }

    @Override
    public int chooseMove(Board board, Mark robotMark) {
        List<Integer> emptyCells = board.emptyCells();
        if (emptyCells.isEmpty()) {
            throw new IllegalStateException("No empty cells available");
        }

        List<Integer> bestMoves = collectBestMoves(board, robotMark, emptyCells);
        return bestMoves.get(random.nextInt(bestMoves.size()));
    }

    @Override
    public Difficulty difficulty() {
        return Difficulty.IMPOSSIBLE;
    }

    private List<Integer> collectBestMoves(Board board, Mark robotMark, List<Integer> emptyCells) {
        int bestScore = Integer.MIN_VALUE;
        List<Integer> bestMoves = new ArrayList<>();

        for (int cell : emptyCells) {
            int score = scoreOf(board, robotMark, cell);
            if (score > bestScore) {
                bestScore = score;
                bestMoves.clear();
                bestMoves.add(cell);
            } else if (score == bestScore) {
                bestMoves.add(cell);
            }
        }
        return bestMoves;
    }

    private static int scoreOf(Board board, Mark robotMark, int cell) {
        Board candidate = board.copy();
        candidate.place(cell, robotMark);
        Mark opponent = robotMark.opponent();
        return minimizeOpponent(candidate, robotMark, opponent, 1);
    }

    private static int minimizeOpponent(Board board, Mark self, Mark opponent, int depth) {
        Integer terminal = terminalScore(board, self, depth);
        if (terminal != null) {
            return terminal;
        }
        int best = Integer.MAX_VALUE;
        for (int cell : board.emptyCells()) {
            Board next = board.copy();
            next.place(cell, opponent);
            int score = maximizeSelf(next, self, opponent, depth + 1);
            if (score < best) {
                best = score;
            }
        }
        return best;
    }

    private static int maximizeSelf(Board board, Mark self, Mark opponent, int depth) {
        Integer terminal = terminalScore(board, self, depth);
        if (terminal != null) {
            return terminal;
        }
        int best = Integer.MIN_VALUE;
        for (int cell : board.emptyCells()) {
            Board next = board.copy();
            next.place(cell, self);
            int score = minimizeOpponent(next, self, opponent, depth + 1);
            if (score > best) {
                best = score;
            }
        }
        return best;
    }

    private static Integer terminalScore(Board board, Mark self, int depth) {
        switch (board.computeStatus()) {
            case IN_PROGRESS:
                return null;
            case DRAW:
                return MinimaxEvaluator.DRAW_SCORE;
            case X_WON:
                return self == Mark.X
                        ? MinimaxEvaluator.WIN_SCORE - depth
                        : MinimaxEvaluator.LOSS_SCORE + depth;
            case O_WON:
                return self == Mark.O
                        ? MinimaxEvaluator.WIN_SCORE - depth
                        : MinimaxEvaluator.LOSS_SCORE + depth;
            default:
                throw new IllegalStateException("Unknown status");
        }
    }
}
