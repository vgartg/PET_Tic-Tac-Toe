package com.tictactoe.service;

import com.tictactoe.api.exception.GameNotFoundException;
import com.tictactoe.api.exception.InvalidMoveException;
import com.tictactoe.domain.Board;
import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.Game;
import com.tictactoe.domain.GameMode;
import com.tictactoe.domain.Mark;
import com.tictactoe.domain.ai.RobotPlayer;
import org.springframework.stereotype.Service;

@Service
public class GameService {

    private final GameSessionStore sessionStore;
    private final RobotResolver robotResolver;

    public GameService(GameSessionStore sessionStore, RobotResolver robotResolver) {
        this.sessionStore = sessionStore;
        this.robotResolver = robotResolver;
    }

    public Game createGame(GameMode mode, Difficulty difficulty, Mark humanMark) {
        Game game = new Game(mode, difficulty, humanMark);
        sessionStore.save(game);

        if (mode == GameMode.SOLO && !game.isHumanTurn()) {
            playRobotTurn(game);
        }
        return game;
    }

    public Game getGame(String gameId) {
        return sessionStore.find(gameId)
                .orElseThrow(() -> new GameNotFoundException(gameId));
    }

    public Game applyHumanMove(String gameId, int cellIndex) {
        Game game = getGame(gameId);

        if (game.status().isFinished()) {
            throw new InvalidMoveException("Game is already finished");
        }
        if (!game.isHumanTurn()) {
            throw new InvalidMoveException("It is not the human's turn");
        }
        if (cellIndex < 0 || cellIndex >= Board.CELL_COUNT) {
            throw new InvalidMoveException("Cell index must be in [0, " + Board.CELL_COUNT + ")");
        }
        if (!game.board().isCellEmpty(cellIndex)) {
            throw new InvalidMoveException("Cell " + cellIndex + " is already occupied");
        }

        game.applyMove(cellIndex);

        if (game.mode() == GameMode.SOLO && !game.status().isFinished()) {
            playRobotTurn(game);
        }
        return game;
    }

    public void deleteGame(String gameId) {
        sessionStore.remove(gameId);
    }

    private void playRobotTurn(Game game) {
        RobotPlayer robot = robotResolver.resolve(game.difficulty());
        int move = robot.chooseMove(game.board(), game.robotMark());
        game.applyMove(move);
    }
}
