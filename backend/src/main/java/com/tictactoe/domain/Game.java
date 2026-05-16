package com.tictactoe.domain;

import java.util.Objects;
import java.util.UUID;

public final class Game {

    private final String id;
    private final GameMode mode;
    private final Difficulty difficulty;
    private final Mark humanMark;
    private final Board board;
    private Mark currentTurn;
    private GameStatus status;

    public Game(GameMode mode, Difficulty difficulty, Mark humanMark) {
        this.id = UUID.randomUUID().toString();
        this.mode = Objects.requireNonNull(mode, "mode");
        this.difficulty = mode == GameMode.SOLO
                ? Objects.requireNonNull(difficulty, "difficulty is required for SOLO")
                : null;
        this.humanMark = mode == GameMode.SOLO
                ? requireNonEmpty(humanMark, "humanMark is required for SOLO")
                : null;
        this.board = new Board();
        this.currentTurn = Mark.X;
        this.status = GameStatus.IN_PROGRESS;
    }

    public String id() {
        return id;
    }

    public GameMode mode() {
        return mode;
    }

    public Difficulty difficulty() {
        return difficulty;
    }

    public Mark humanMark() {
        return humanMark;
    }

    public Mark robotMark() {
        return mode == GameMode.SOLO ? humanMark.opponent() : null;
    }

    public Board board() {
        return board;
    }

    public Mark currentTurn() {
        return currentTurn;
    }

    public GameStatus status() {
        return status;
    }

    public boolean isHumanTurn() {
        return mode == GameMode.DUO || currentTurn == humanMark;
    }

    public void applyMove(int cellIndex) {
        if (status.isFinished()) {
            throw new IllegalStateException("Game already finished");
        }
        board.place(cellIndex, currentTurn);
        status = board.computeStatus();
        if (!status.isFinished()) {
            currentTurn = currentTurn.opponent();
        }
    }

    private static Mark requireNonEmpty(Mark mark, String name) {
        Objects.requireNonNull(mark, name);
        if (mark == Mark.EMPTY) {
            throw new IllegalArgumentException(name + " must be X or O");
        }
        return mark;
    }
}
