package com.tictactoe.api;

import com.tictactoe.api.dto.CreateGameRequest;
import com.tictactoe.api.dto.GameResponse;
import com.tictactoe.api.dto.MoveRequest;
import com.tictactoe.domain.Game;
import com.tictactoe.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GameResponse createGame(@Valid @RequestBody CreateGameRequest request) {
        Game game = gameService.createGame(request.mode(), request.difficulty(), request.humanMark());
        return GameResponse.from(game);
    }

    @GetMapping("/{gameId}")
    public GameResponse getGame(@PathVariable String gameId) {
        return GameResponse.from(gameService.getGame(gameId));
    }

    @PostMapping("/{gameId}/moves")
    public GameResponse makeMove(@PathVariable String gameId, @Valid @RequestBody MoveRequest request) {
        Game game = gameService.applyHumanMove(gameId, request.cellIndex());
        return GameResponse.from(game);
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<Void> deleteGame(@PathVariable String gameId) {
        gameService.deleteGame(gameId);
        return ResponseEntity.noContent().build();
    }
}
