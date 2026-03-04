import multer, { type FileFilterCallback } from "multer";
import path from "node:path";
import crypto from "crypto";
import type { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // cria um nome único
    const fileHash = crypto.randomBytes(10).toString("hex");
    const fileName = `${fileHash}-${Date.now()}${path.extname(file.originalname)}`;

    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const suportedMimes = ["image/jpeg", "image/png", "image/pjpeg"];

  if (suportedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Formato de arquivos inválido. Apenas JPG e PNG são aceitos."),
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
