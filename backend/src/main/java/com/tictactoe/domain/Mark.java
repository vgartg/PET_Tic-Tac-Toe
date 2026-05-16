package com.tictactoe.domain;

public enum Mark {
    X,
    O,
    EMPTY;

    public Mark opponent() {
        return switch (this) {
            case X -> O;
            case O -> X;
            case EMPTY -> throw new IllegalStateException("EMPTY has no opponent");
        };
    }
}
