export interface TelemetryData {
  x: number;
  y: number;
  focus: number;
  target: string;
}

type TelemetryListener = (data: TelemetryData) => void;

const listeners = new Set<TelemetryListener>();

let currentData: TelemetryData = {
  x: 0,
  y: 0,
  focus: 0,
  target: "ISOMETRIC DESK",
};

export function emitTelemetry(data: TelemetryData) {
  currentData = data;
  listeners.forEach((fn) => fn(data));
}

export function getTelemetrySnapshot(): TelemetryData {
  return currentData;
}

export function subscribeTelemetry(listener: TelemetryListener): () => void {
  listeners.add(listener);
  listener(currentData);
  return () => {
    listeners.delete(listener);
  };
}
