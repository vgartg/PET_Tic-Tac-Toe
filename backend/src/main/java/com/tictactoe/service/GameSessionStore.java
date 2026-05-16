package com.tictactoe.service;

import com.tictactoe.domain.Game;

import java.util.Optional;

public interface GameSessionStore {

    void save(Game game);

    Optional<Game> find(String gameId);

    void remove(String gameId);
}
