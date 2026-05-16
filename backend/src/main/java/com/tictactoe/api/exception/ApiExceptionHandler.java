package com.tictactoe.api.exception;

import com.tictactoe.api.dto.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(GameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(GameNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, "Game not found", ex.getMessage());
    }

    @ExceptionHandler(InvalidMoveException.class)
    public ResponseEntity<ErrorResponse> handleInvalidMove(InvalidMoveException ex) {
        return build(HttpStatus.BAD_REQUEST, "Invalid move", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getAllErrors().stream()
                .map(e -> e.getDefaultMessage() == null ? "invalid" : e.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return build(HttpStatus.BAD_REQUEST, "Validation failed", details);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraint(ConstraintViolationException ex) {
        return build(HttpStatus.BAD_REQUEST, "Validation failed", ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return build(HttpStatus.BAD_REQUEST, "Bad request", ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex) {
        return build(HttpStatus.CONFLICT, "Conflict", ex.getMessage());
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String error, String message) {
        return ResponseEntity.status(status).body(ErrorResponse.of(status.value(), error, message));
    }
}
