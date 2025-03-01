import React, { useRef, useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import Toolbar from "./Toolbar";
import { EVENTS } from "../utils/constants";
import "../styles/Canvas.css";

const socket = io("http://localhost:5001", { transports: ["websocket"] });

const Canvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [activeUsers, setActiveUsers] = useState(0);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    console.info("Socket connected:", socket.id);

    socket.on("connect", () => {
      console.info("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.info("Disconnected from server:", socket.id);
    });

    socket.on(EVENTS.UPDATE_USERS, (count) => {
      setActiveUsers(count);
    });

    socket.on(EVENTS.USER_NOTIFICATION, (data) => {
      setNotification(data.message);
      setTimeout(() => setNotification(""), 3000);
    });

    return () => {
      socket.off(EVENTS.UPDATE_USERS);
      socket.off(EVENTS.USER_NOTIFICATION);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 20;
      canvas.height = window.innerHeight - 100;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    socket.on(EVENTS.LOAD_CANVAS, (history) => {
      history.forEach(({ x, y, color, size }) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineTo(x, y);
        ctx.stroke();
      });
    });

    socket.on(EVENTS.DRAW, ({ x, y, color, size }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Listen for canvas reset
    socket.on(EVENTS.CLEAR_CANVAS, () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      socket.off(EVENTS.LOAD_CANVAS);
      socket.off(EVENTS.DRAW);
      socket.off(EVENTS.CLEAR_CANVAS);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    }
  };

  // Start drawing
  const startDrawing = useCallback((e) => {
    e.preventDefault();
    setDrawing(true);
    const { x, y } = getCoordinates(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  }, []);

  // Draw
  const draw = useCallback(
    (e) => {
      if (!drawing) return;
      e.preventDefault();
      const { x, y } = getCoordinates(e);
      ctxRef.current.lineTo(x, y);
      ctxRef.current.strokeStyle = brushColor;
      ctxRef.current.lineWidth = brushSize;
      ctxRef.current.stroke();
      socket.emit(EVENTS.DRAW, { x, y, color: brushColor, size: brushSize });
    },
    [drawing, brushColor, brushSize]
  );

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setDrawing(false);
    ctxRef.current.beginPath();
  }, []);

  // Clear the canvas
  const clearCanvas = () => {
    socket.emit(EVENTS.CLEAR_CANVAS);
  };

  return (
    <>
      <div className="canvas-header">
        <h3 className="active-users">Active Users: {activeUsers} 👥</h3>
        <h2 className="canvas-title">Collaborative Drawer</h2>
        <Toolbar
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          clearCanvas={clearCanvas}
        />
      </div>
      {/* Show notifications */}
      {notification && <div className="notification">{notification}</div>}

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="canvas"
      />
    </>
  );
};

export default Canvas;

