import React, { useEffect, useState } from "react";

const PongGame = () => {
  const canvasWidth = 800;
  const canvasHeight = 400;
  const paddleWidth = 10;
  const paddleHeight = 80;
  const ballSize = 10;
  const paddleSpeed = 8;

  const [ball, setBall] = useState({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    dx: 4, // Ball speed X-direction
    dy: 4, // Ball speed Y-direction
  });

  const [leftPaddle, setLeftPaddle] = useState({ y: canvasHeight / 2 - 40 });
  const [rightPaddle, setRightPaddle] = useState({ y: canvasHeight / 2 - 40 });

  const [score, setScore] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "w" && leftPaddle.y > 0) {
        setLeftPaddle((prev) => ({ y: prev.y - paddleSpeed }));
      }
      if (e.key === "s" && leftPaddle.y < canvasHeight - paddleHeight) {
        setLeftPaddle((prev) => ({ y: prev.y + paddleSpeed }));
      }
      if (e.key === "ArrowUp" && rightPaddle.y > 0) {
        setRightPaddle((prev) => ({ y: prev.y - paddleSpeed }));
      }
      if (e.key === "ArrowDown" && rightPaddle.y < canvasHeight - paddleHeight) {
        setRightPaddle((prev) => ({ y: prev.y + paddleSpeed }));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [leftPaddle, rightPaddle]);

  useEffect(() => {
    const updateGame = () => {
      setBall((prev) => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;

        // Ball collision with top and bottom walls
        if (newY <= 0 || newY >= canvasHeight - ballSize) {
          newDy = -newDy;
        }

        // Ball collision with left paddle
        if (newX <= paddleWidth && newY >= leftPaddle.y && newY <= leftPaddle.y + paddleHeight) {
          newDx = -newDx;
        }

        // Ball collision with right paddle
        if (newX >= canvasWidth - paddleWidth - ballSize && newY >= rightPaddle.y && newY <= rightPaddle.y + paddleHeight) {
          newDx = -newDx;
        }

        // Scoring conditions
        if (newX <= 0) {
          setScore((prev) => ({ ...prev, right: prev.right + 1 }));
          return { x: canvasWidth / 2, y: canvasHeight / 2, dx: 4, dy: 4 };
        }

        if (newX >= canvasWidth - ballSize) {
          setScore((prev) => ({ ...prev, left: prev.left + 1 }));
          return { x: canvasWidth / 2, y: canvasHeight / 2, dx: -4, dy: 4 };
        }

        return { x: newX, y: newY, dx: newDx, dy: newDy };
      });
    };

    const gameInterval = setInterval(updateGame, 20);
    return () => clearInterval(gameInterval);
  }, [leftPaddle, rightPaddle]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Ping Pong Game</h2>
      <p>Left Paddle: Use **W** / **S** | Right Paddle: Use **Arrow Up / Down**</p>
      <h3>Score: Left {score.left} - {score.right} Right</h3>

      <div style={{ position: "relative", width: canvasWidth, height: canvasHeight, background: "black", margin: "auto" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: leftPaddle.y,
            width: paddleWidth,
            height: paddleHeight,
            background: "white",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            right: 0,
            top: rightPaddle.y,
            width: paddleWidth,
            height: paddleHeight,
            background: "white",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            left: ball.x,
            top: ball.y,
            width: ballSize,
            height: ballSize,
            background: "red",
            borderRadius: "50%",
          }}
        ></div>
      </div>
    </div>
  );
};


