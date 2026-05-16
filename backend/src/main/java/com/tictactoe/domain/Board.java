package com.tictactoe.domain;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public final class Board {

    public static final int SIZE = 3;
    public static final int CELL_COUNT = SIZE * SIZE;

    private static final int[][] WINNING_LINES = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8},
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
            {0, 4, 8}, {2, 4, 6}
    };

    private final Mark[] cells;

    public Board() {
        this.cells = new Mark[CELL_COUNT];
        Arrays.fill(this.cells, Mark.EMPTY);
    }

    private Board(Mark[] cells) {
        this.cells = cells.clone();
    }

    public Mark cellAt(int index) {
        validateIndex(index);
        return cells[index];
    }

    public void place(int index, Mark mark) {
        validateIndex(index);
        if (mark == Mark.EMPTY) {
            throw new IllegalArgumentException("Cannot place EMPTY mark");
        }
        if (cells[index] != Mark.EMPTY) {
            throw new IllegalStateException("Cell " + index + " is already occupied");
        }
        cells[index] = mark;
    }

    public boolean isCellEmpty(int index) {
        return cellAt(index) == Mark.EMPTY;
    }

    public boolean isFull() {
        for (Mark cell : cells) {
            if (cell == Mark.EMPTY) {
                return false;
            }
        }
        return true;
    }

    public List<Integer> emptyCells() {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < cells.length; i++) {
            if (cells[i] == Mark.EMPTY) {
                result.add(i);
            }
        }
        return result;
    }

    public int countOf(Mark mark) {
        int count = 0;
        for (Mark cell : cells) {
            if (cell == mark) {
                count++;
            }
        }
        return count;
    }

    public GameStatus computeStatus() {
        for (int[] line : WINNING_LINES) {
            Mark a = cells[line[0]];
            if (a != Mark.EMPTY && a == cells[line[1]] && a == cells[line[2]]) {
                return a == Mark.X ? GameStatus.X_WON : GameStatus.O_WON;
            }
        }
        return isFull() ? GameStatus.DRAW : GameStatus.IN_PROGRESS;
    }

    public List<Mark> snapshot() {
        return Collections.unmodifiableList(Arrays.asList(cells.clone()));
    }

    public Board copy() {
        return new Board(cells);
    }

    public static int[][] winningLines() {
        return WINNING_LINES;
    }

    private static void validateIndex(int index) {
        if (index < 0 || index >= CELL_COUNT) {
            throw new IllegalArgumentException("Cell index must be in [0, " + CELL_COUNT + "), got " + index);
        }
    }
}
