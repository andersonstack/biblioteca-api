import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: number;
  userName: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function autenticarToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return void res.status(401).json({ message: "Sem token" });

  jwt.verify(token, process.env.APP_KEY!, (err, decoded) => {
    if (err) return void res.status(403).json({ message: "Token inválido" });
    req.user = decoded as TokenPayload;
    next();
  });
}

export function verificarAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "admin") {
    return void res.status(403).json({ message: "Acesso negado: apenas admins" });
  }
  next();
}
