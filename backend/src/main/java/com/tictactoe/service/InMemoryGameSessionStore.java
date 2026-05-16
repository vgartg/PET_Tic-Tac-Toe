package com.tictactoe.service;

import com.tictactoe.domain.Game;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
public class InMemoryGameSessionStore implements GameSessionStore {

    private final ConcurrentMap<String, Game> sessions = new ConcurrentHashMap<>();

    @Override
    public void save(Game game) {
        sessions.put(game.id(), game);
    }

    @Override
    public Optional<Game> find(String gameId) {
        return Optional.ofNullable(sessions.get(gameId));
    }

    @Override
    public void remove(String gameId) {
        sessions.remove(gameId);
    }
}
