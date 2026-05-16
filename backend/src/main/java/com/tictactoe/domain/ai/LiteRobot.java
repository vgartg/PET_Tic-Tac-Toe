package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.Mark;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.random.RandomGenerator;

@Component
public class LiteRobot implements RobotPlayer {

    private final RandomGenerator random;

    public LiteRobot() {
        this(RandomGenerator.getDefault());
    }

    public LiteRobot(RandomGenerator random) {
        this.random = random;
    }

    @Override
    public int chooseMove(Board board, Mark robotMark) {
        List<Integer> emptyCells = board.emptyCells();
        if (emptyCells.isEmpty()) {
            throw new IllegalStateException("No empty cells available");
        }
        return emptyCells.get(random.nextInt(emptyCells.size()));
    }

    @Override
    public Difficulty difficulty() {
        return Difficulty.LITE;
    }
}
