package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.GameStatus;
import com.tictactoe.domain.Mark;

import java.util.List;

/**
 * Recursive perfect-play evaluator for a 3x3 board. The 3x3 search tree is
 * shallow enough (≤ 9! / 2) that no transposition table or alpha-beta pruning
 * is required to keep response times under a millisecond.
 */
public final class MinimaxEvaluator {

    public static final int WIN_SCORE = 10;
    public static final int LOSS_SCORE = -10;
    public static final int DRAW_SCORE = 0;

    private MinimaxEvaluator() {
    }

    /**
     * Returns the index of the best move for {@code self} on the supplied
     * board. Earlier wins and later losses are preferred, mirroring the
     * classic minimax-with-depth-discount formulation.
     *
     * @throws IllegalStateException if the board has no empty cells.
     */
    public static int bestMove(Board board, Mark self) {
        List<Integer> emptyCells = board.emptyCells();
        if (emptyCells.isEmpty()) {
            throw new IllegalStateException("No empty cells available");
        }

        Mark opponent = self.opponent();
        int bestScore = Integer.MIN_VALUE;
        int bestIndex = emptyCells.get(0);

        for (int cell : emptyCells) {
            Board next = board.copy();
            next.place(cell, self);
            int score = minimize(next, self, opponent, 1);
            if (score > bestScore) {
                bestScore = score;
                bestIndex = cell;
            }
        }
        return bestIndex;
    }

    private static int maximize(Board board, Mark self, Mark opponent, int depth) {
        Integer terminal = terminalScore(board, self, depth);
        if (terminal != null) {
            return terminal;
        }
        int best = Integer.MIN_VALUE;
        for (int cell : board.emptyCells()) {
            Board next = board.copy();
            next.place(cell, self);
            int score = minimize(next, self, opponent, depth + 1);
            if (score > best) {
                best = score;
            }
        }
        return best;
    }

    private static int minimize(Board board, Mark self, Mark opponent, int depth) {
        Integer terminal = terminalScore(board, self, depth);
        if (terminal != null) {
            return terminal;
        }
        int best = Integer.MAX_VALUE;
        for (int cell : board.emptyCells()) {
            Board next = board.copy();
            next.place(cell, opponent);
            int score = maximize(next, self, opponent, depth + 1);
            if (score < best) {
                best = score;
            }
        }
        return best;
    }

    private static Integer terminalScore(Board board, Mark self, int depth) {
        GameStatus status = board.computeStatus();
        if (status == GameStatus.IN_PROGRESS) {
            return null;
        }
        if (status == GameStatus.DRAW) {
            return DRAW_SCORE;
        }
        boolean selfWon =
                (status == GameStatus.X_WON && self == Mark.X)
                        || (status == GameStatus.O_WON && self == Mark.O);
        return selfWon ? WIN_SCORE - depth : LOSS_SCORE + depth;
    }
}
