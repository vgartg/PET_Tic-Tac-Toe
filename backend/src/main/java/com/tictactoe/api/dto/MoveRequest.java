package com.tictactoe.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MoveRequest(
        @NotNull @Min(0) @Max(8) Integer cellIndex
) {
}
