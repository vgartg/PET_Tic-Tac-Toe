package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.Mark;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.random.RandomGenerator;

@Component
public class HardRobot implements RobotPlayer {

    private static final int CENTER_INDEX = 4;
    private static final int[] CORNER_INDICES = {0, 2, 6, 8};

    private final RandomGenerator random;

    public HardRobot() {
        this(RandomGenerator.getDefault());
    }

    public HardRobot(RandomGenerator random) {
        this.random = random;
    }

    @Override
    public int chooseMove(Board board, Mark robotMark) {
        List<Integer> emptyCells = board.emptyCells();
        if (emptyCells.isEmpty()) {
            throw new IllegalStateException("No empty cells available");
        }

        if (isFirstMove(board, robotMark)) {
            return openingMove(board);
        }

        Integer winningMove = findCompletingMove(board, robotMark);
        if (winningMove != null) {
            return winningMove;
        }

        return emptyCells.get(random.nextInt(emptyCells.size()));
    }

    @Override
    public Difficulty difficulty() {
        return Difficulty.HARD;
    }

    private boolean isFirstMove(Board board, Mark robotMark) {
        return board.countOf(robotMark) == 0;
    }

    private int openingMove(Board board) {
        if (board.isCellEmpty(CENTER_INDEX)) {
            return CENTER_INDEX;
        }
        return CORNER_INDICES[random.nextInt(CORNER_INDICES.length)];
    }

    private Integer findCompletingMove(Board board, Mark robotMark) {
        for (int[] line : Board.winningLines()) {
            Integer emptyInLine = singleEmptyCellWithTwo(board, line, robotMark);
            if (emptyInLine != null) {
                return emptyInLine;
            }
        }
        return null;
    }

    private Integer singleEmptyCellWithTwo(Board board, int[] line, Mark mark) {
        int markCount = 0;
        Integer emptyIndex = null;
        for (int cellIndex : line) {
            Mark cell = board.cellAt(cellIndex);
            if (cell == mark) {
                markCount++;
            } else if (cell == Mark.EMPTY) {
                emptyIndex = cellIndex;
            } else {
                return null;
            }
        }
        return markCount == 2 ? emptyIndex : null;
    }
}
