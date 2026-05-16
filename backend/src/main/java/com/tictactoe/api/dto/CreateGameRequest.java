package com.tictactoe.api.dto;

import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.GameMode;
import com.tictactoe.domain.Mark;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

public record CreateGameRequest(
        @NotNull GameMode mode,
        Difficulty difficulty,
        Mark humanMark
) {

    @AssertTrue(message = "difficulty and humanMark are required for SOLO mode")
    public boolean isSoloPayloadValid() {
        if (mode != GameMode.SOLO) {
            return true;
        }
        return difficulty != null && humanMark != null && humanMark != Mark.EMPTY;
    }
}
