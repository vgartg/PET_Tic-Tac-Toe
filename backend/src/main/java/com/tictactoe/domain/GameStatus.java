package com.tictactoe.domain;

public enum GameStatus {
    IN_PROGRESS,
    X_WON,
    O_WON,
    DRAW;

    public boolean isFinished() {
        return this != IN_PROGRESS;
    }
}
