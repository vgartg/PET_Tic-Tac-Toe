package com.tictactoe.api.exception;

public class GameNotFoundException extends RuntimeException {

    public GameNotFoundException(String gameId) {
        super("Game with id '" + gameId + "' was not found");
    }
}
