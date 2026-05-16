package com.tictactoe.api.exception;

public class InvalidMoveException extends RuntimeException {

    public InvalidMoveException(String message) {
        super(message);
    }
}
