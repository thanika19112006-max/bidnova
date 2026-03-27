import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime: Date;
  onEnd?: () => void;
  large?: boolean;
}

export function CountdownTimer({
  endTime,
  onEnd,
  large = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calc = () =>
      Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));
    setTimeLeft(calc());
    const interval = setInterval(() => {
      const remaining = calc();
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onEnd?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft < 300;
  const isOver = timeLeft === 0;

  if (isOver) {
    return (
      <span
        className={`font-mono font-bold text-red-400 ${large ? "text-3xl" : "text-sm"}`}
      >
        Ended
      </span>
    );
  }

  if (large) {
    const urgentClass = isUrgent ? "text-red-400 animate-pulse" : "text-white";
    return (
      <div className="flex items-end gap-2">
        {days > 0 && (
          <div className="text-center">
            <span
              className={`font-mono font-bold text-4xl tabular-nums ${urgentClass}`}
            >
              {String(days).padStart(2, "0")}
            </span>
            <p className="text-gray-500 text-xs mt-1">days</p>
          </div>
        )}
        <div className="text-center">
          <span
            className={`font-mono font-bold text-4xl tabular-nums ${urgentClass}`}
          >
            {String(hours).padStart(2, "0")}
          </span>
          <p className="text-gray-500 text-xs mt-1">hrs</p>
        </div>
        <span className={`font-mono font-bold text-3xl ${urgentClass} mb-4`}>
          :
        </span>
        <div className="text-center">
          <span
            className={`font-mono font-bold text-4xl tabular-nums ${urgentClass}`}
          >
            {String(minutes).padStart(2, "0")}
          </span>
          <p className="text-gray-500 text-xs mt-1">min</p>
        </div>
        <span className={`font-mono font-bold text-3xl ${urgentClass} mb-4`}>
          :
        </span>
        <div className="text-center">
          <span
            className={`font-mono font-bold text-4xl tabular-nums ${urgentClass}`}
          >
            {String(seconds).padStart(2, "0")}
          </span>
          <p className="text-gray-500 text-xs mt-1">sec</p>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`font-mono font-semibold text-sm tabular-nums ${
        isUrgent ? "text-red-400 animate-pulse" : "text-blue-300"
      }`}
    >
      {days > 0 && `${days}d `}
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </span>
  );
}
