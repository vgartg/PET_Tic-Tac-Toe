package com.tictactoe.domain.ai;

import com.tictactoe.domain.Board;
import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.Mark;

public interface RobotPlayer {

    int chooseMove(Board board, Mark robotMark);

    Difficulty difficulty();
}
