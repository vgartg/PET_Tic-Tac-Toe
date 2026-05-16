package com.tictactoe.service;

import com.tictactoe.api.exception.InvalidMoveException;
import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.Game;
import com.tictactoe.domain.GameMode;
import com.tictactoe.domain.GameStatus;
import com.tictactoe.domain.Mark;
import com.tictactoe.domain.ai.HardRobot;
import com.tictactoe.domain.ai.LiteRobot;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.random.RandomGenerator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class GameServiceTest {

    private GameService service;

    @BeforeEach
    void setUp() {
        RandomGenerator deterministic = RandomGenerator.of("L64X128MixRandom");
        RobotResolver resolver = new RobotResolver(List.of(
                new LiteRobot(deterministic),
                new HardRobot(deterministic)
        ));
        service = new GameService(new InMemoryGameSessionStore(), resolver);
    }

    @Test
    void duoGameAllowsBothPlayersToMove() {
        Game game = service.createGame(GameMode.DUO, null, null);

        service.applyHumanMove(game.id(), 0);
        Game state = service.applyHumanMove(game.id(), 4);

        assertThat(state.board().cellAt(0)).isEqualTo(Mark.X);
        assertThat(state.board().cellAt(4)).isEqualTo(Mark.O);
        assertThat(state.currentTurn()).isEqualTo(Mark.X);
    }

    @Test
    void soloGameWithHumanAsOLetsRobotMoveFirst() {
        Game game = service.createGame(GameMode.SOLO, Difficulty.HARD, Mark.O);

        assertThat(game.board().countOf(Mark.X)).isEqualTo(1);
        assertThat(game.board().cellAt(4)).isEqualTo(Mark.X);
        assertThat(game.currentTurn()).isEqualTo(Mark.O);
    }

    @Test
    void soloGameTriggersRobotAfterHumanMove() {
        Game game = service.createGame(GameMode.SOLO, Difficulty.HARD, Mark.X);

        Game state = service.applyHumanMove(game.id(), 0);

        assertThat(state.board().countOf(Mark.X)).isEqualTo(1);
        assertThat(state.board().countOf(Mark.O)).isEqualTo(1);
    }

    @Test
    void rejectsMoveOnOccupiedCell() {
        Game game = service.createGame(GameMode.DUO, null, null);
        service.applyHumanMove(game.id(), 0);

        assertThatThrownBy(() -> service.applyHumanMove(game.id(), 0))
                .isInstanceOf(InvalidMoveException.class);
    }

    @Test
    void rejectsMoveAfterGameFinished() {
        Game game = service.createGame(GameMode.DUO, null, null);
        service.applyHumanMove(game.id(), 0);
        service.applyHumanMove(game.id(), 3);
        service.applyHumanMove(game.id(), 1);
        service.applyHumanMove(game.id(), 4);
        Game state = service.applyHumanMove(game.id(), 2);

        assertThat(state.status()).isEqualTo(GameStatus.X_WON);
        assertThatThrownBy(() -> service.applyHumanMove(game.id(), 8))
                .isInstanceOf(InvalidMoveException.class);
    }
}
