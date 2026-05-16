package com.tictactoe.api.dto;

import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.Game;
import com.tictactoe.domain.GameMode;
import com.tictactoe.domain.GameStatus;
import com.tictactoe.domain.Mark;

import java.util.List;

public record GameResponse(
        String id,
        GameMode mode,
        Difficulty difficulty,
        Mark humanMark,
        Mark robotMark,
        List<Mark> cells,
        Mark currentTurn,
        GameStatus status,
        boolean finished
) {

    public static GameResponse from(Game game) {
        return new GameResponse(
                game.id(),
                game.mode(),
                game.difficulty(),
                game.humanMark(),
                game.robotMark(),
                game.board().snapshot(),
                game.currentTurn(),
                game.status(),
                game.status().isFinished()
        );
    }
}
