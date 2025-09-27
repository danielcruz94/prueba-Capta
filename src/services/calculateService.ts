import axios from "axios";
import { DateTime } from "luxon";
import type { BusinessDateResult } from "../types.js";
const HOLIDAYS_URL = "https://content.capta.co/Recruitment/WorkingDays.json";

// Obtener festivos de Colombia
const getHolidays = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(HOLIDAYS_URL);
  return response.data;
};

// Verificar si es día hábil
const isWorkingDay = (date: DateTime, holidays: string[]): boolean => {
  const isWeekend = date.weekday === 6 || date.weekday === 7; // sábado o domingo
  const isHoliday = holidays.includes(date.toISODate()!);
  return !isWeekend && !isHoliday;
};

// Buscar siguiente día hábil a las 8:00 a.m.
const nextWorkingDay = (date: DateTime, holidays: string[]): DateTime => {
  let current = date.plus({ days: 1 }).startOf("day").set({ hour: 8 });
  while (!isWorkingDay(current, holidays)) {
    current = current.plus({ days: 1 });
  }
  return current;
};

// Ajustar fecha hacia atrás al último día hábil válido
const previousWorkingDate = (date: DateTime, holidays: string[]): DateTime => {
  let current = date;

  while (!isWorkingDay(current, holidays)) {
    current = current.minus({ days: 1 }).set({ hour: 17, minute: 0 });
  }

  if (current.hour >= 17) {
    current = current.set({ hour: 17, minute: 0 });
  } else if (current.hour < 8) {
    do {
      current = current.minus({ days: 1 }).set({ hour: 17, minute: 0 });
    } while (!isWorkingDay(current, holidays));
  } else if (current.hour >= 12 && current.hour < 13) {
    current = current.set({ hour: 12, minute: 0 });
  }

  return current;
};

// Cálculo principal
export const calculateBusinessDate = async (
  days: number,
  hours: number,
  baseDate?: string
): Promise<BusinessDateResult> => {
  const holidays = await getHolidays();

  let current = baseDate
    ? DateTime.fromISO(baseDate, { zone: "utc" }).setZone("America/Bogota")
    : DateTime.now().setZone("America/Bogota");

  // Ajustar si la fecha inicial está fuera del horario laboral o no es hábil
  if (
    !isWorkingDay(current, holidays) ||
    current.hour < 8 ||
    current.hour >= 17 ||
    (current.hour === 12 && current.minute > 0) ||
    (current.hour > 12 && current.hour < 13)
  ) {
    current = previousWorkingDate(current, holidays);
  }

  // Agregar días hábiles completos
  for (let i = 0; i < days; i++) {
    current = nextWorkingDay(current, holidays).set({
      hour: current.hour,
      minute: current.minute,
    });
  }

  // Agregar horas hábiles
  let hoursToAdd = hours;
  while (hoursToAdd > 0) {
    let remainingToday =
      17 - current.hour - (current.minute > 0 ? 1 : 0) + current.minute / 60;

    if (current.hour < 8) {
      current = current.set({ hour: 8, minute: 0 });
      remainingToday = 9;
    }

    // Si cruzamos el almuerzo
    if (
      (current.hour < 12 && current.hour + hoursToAdd > 12) ||
      (current.hour === 11 && current.minute > 0 && current.hour + hoursToAdd >= 12)
    ) {
      const minutesToLunch = (12 - current.hour) * 60 - current.minute;
      hoursToAdd -= minutesToLunch / 60;
      current = current.plus({ minutes: minutesToLunch }).set({ hour: 13, minute: 0 });
      remainingToday = 17 - 13;
      continue;
    }

    // Si estamos en almuerzo
    if (current.hour >= 12 && current.hour < 13) {
      current = current.set({ hour: 13, minute: 0 });
      remainingToday = 17 - 13;
    }

    if (hoursToAdd <= remainingToday) {
      current = current.plus({ hours: hoursToAdd });
      hoursToAdd = 0;
    } else {
      hoursToAdd -= remainingToday;
      current = nextWorkingDay(current, holidays).set({ hour: 8, minute: 0 });
    }
  }

  return {
    utc: current.setZone("utc").toISO()!
  };
};
