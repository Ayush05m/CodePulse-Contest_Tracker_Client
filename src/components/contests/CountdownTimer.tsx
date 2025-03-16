"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({
  targetDate,
  label = "Starts in",
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft()
  );

  function calculateTimeLeft(): TimeLeft | null {
    const difference = +new Date(targetDate) - +new Date();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  if (!timeLeft) {
    return (
      <div className="bg-accent p-3 rounded-md">
        <span className="text-lg font-bold text-primary">
          Contest has started!
        </span>
      </div>
    );
  }

  return (
    <div className="bg-accent p-3 rounded-md">
      <p className="text-xs font-medium mb-1">{label}</p>
      <div className="flex justify-between">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-lg font-bold">{formatTime(timeLeft.days)}</span>
          <p className="text-xs">Days</p>
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="text-lg font-bold">
            {formatTime(timeLeft.hours)}
          </span>
          <p className="text-xs">Hours</p>
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <span className="text-lg font-bold">
            {formatTime(timeLeft.minutes)}
          </span>
          <p className="text-xs">Minutes</p>
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <span className="text-lg font-bold">
            {formatTime(timeLeft.seconds)}
          </span>
          <p className="text-xs">Seconds</p>
        </motion.div>
      </div>
    </div>
  );
};

export default CountdownTimer;
