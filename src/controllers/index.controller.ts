import { Request, Response } from "express";

export const wellcome = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Wellcome to the FestivalPOS API" });
  } catch (error) {
    res.status(500).json({ message: "Could not return json" });
  }
};
