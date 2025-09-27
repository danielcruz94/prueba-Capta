import type { Request, Response } from "express";
import { calculateBusinessDate } from "../services/calculateService.js";
import type { ApiError, ApiSuccess } from "../types.js";

export const calculateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { days, hours, date } = req.query;


    const daysNum = days !== undefined ? Number(days) : 0;
    const hoursNum = hours !== undefined ? Number(hours) : 0;

    if (Number.isNaN(daysNum) || Number.isNaN(hoursNum)) {
      const errorResponse: ApiError = {
        error: "InvalidParameters",
        message: "Los parámetros days y hours deben ser numéricos",
      };
      res.status(400).json(errorResponse);
      return;
    }

    if (daysNum === 0 && hoursNum === 0 && !date) {
      const errorResponse: ApiError = {
        error: "InvalidParameters",
        message: "Debe enviar al menos uno de los parámetros: days, hours o date",
      };
      res.status(400).json(errorResponse);
      return;
    }

    const result = await calculateBusinessDate(
      daysNum,
      hoursNum,
      date ? String(date) : undefined
    );

    const response: ApiSuccess = { date: result.utc };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "InternalError",
      message: "No se pudo calcular la fecha",
    });
  }
};
