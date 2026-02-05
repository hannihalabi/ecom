"use client";

import { useEffect, useMemo, useState } from "react";

const formatTime = (seconds: number) => {
  const clamped = Math.max(seconds, 0);
  const days = Math.floor(clamped / 86400);
  const hours = Math.floor((clamped % 86400) / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  return `${hours}h ${minutes}m ${secs}s`;
};

type DealCountdownProps = {
  endsAt: string;
};

export const DealCountdown = ({ endsAt }: DealCountdownProps) => {
  const endTime = useMemo(() => new Date(endsAt).getTime(), [endsAt]);
  const [remaining, setRemaining] = useState(() =>
    Math.floor((endTime - Date.now()) / 1000),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.floor((endTime - Date.now()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (remaining <= 0) {
    return <span className="text-xs text-rose-600">Erbjudandet är slut</span>;
  }

  return (
    <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">
      Slutar om {formatTime(remaining)}
    </span>
  );
};
