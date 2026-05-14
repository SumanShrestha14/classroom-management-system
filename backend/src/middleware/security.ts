import { Request, Response, NextFunction } from "express";
import aj from "../config/arcjet";
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";

const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  try {
    const role: RateLimitRole = req.user?.role ?? "guest";

    let limit: number;
    let message: string;

    switch (role) {
      case "admin":
        limit = 20;
        message = "Admins request limit exceed (20 per minute). Please wait...";
        break;
      case "teacher":
      case "student":
        limit = 10;
        message = "Admins request limit exceed (10 per minute). Please wait...";
        break;
      default:
        limit = 5;
        message =
          "Guest request limit exceed (5 per minute). Please sign-up for more requests...";
        break;
    }
    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit,
      }),
    );

    const arcjetRequest: ArcjetNodeRequest = {
      headers: req.headers,
      method: req.method,
      url: req.originalUrl ?? req.url,
      socket: {
        remoteAddress: req.socket.remoteAddress ?? req.ip ?? "0.0.0.0",
      },
    };

    const decision = await client.protect(arcjetRequest);

    if(decision.isDenied() && decision.reason.isBot()){
        res.status(403).json({error:'Forbidden', message: "Request blocked by bot protection"});
    }
    if(decision.isDenied() && decision.reason.isShield()){
        res.status(403).json({error:'Forbidden', message: "Request blocked by shield protection"});
    }
    if(decision.isDenied() && decision.reason.isRateLimit()){
        res.status(403).json({error:'Forbidden', message: "Request blocked by rate limit protection"});
    }

    next();
  } catch (error) {
    console.error("Error in security middleware:", error);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong..",
      });
  }
};


export default securityMiddleware;