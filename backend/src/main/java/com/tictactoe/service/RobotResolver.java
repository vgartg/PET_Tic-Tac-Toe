package com.tictactoe.service;

import com.tictactoe.domain.Difficulty;
import com.tictactoe.domain.ai.RobotPlayer;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class RobotResolver {

    private final Map<Difficulty, RobotPlayer> robotsByDifficulty;

    public RobotResolver(List<RobotPlayer> robots) {
        Map<Difficulty, RobotPlayer> map = new EnumMap<>(Difficulty.class);
        for (RobotPlayer robot : robots) {
            map.put(robot.difficulty(), robot);
        }
        for (Difficulty difficulty : Difficulty.values()) {
            if (!map.containsKey(difficulty)) {
                throw new IllegalStateException("No RobotPlayer registered for difficulty " + difficulty);
            }
        }
        this.robotsByDifficulty = Map.copyOf(map);
    }

    public RobotPlayer resolve(Difficulty difficulty) {
        return robotsByDifficulty.get(difficulty);
    }
}
