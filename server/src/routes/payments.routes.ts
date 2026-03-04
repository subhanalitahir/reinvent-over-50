import { Router, Request, Response, NextFunction } from "express";
import express from "express";
import { stripeWebhook } from "../controllers/payments.controller";

const router = Router();

/**
 * POST /api/payments/webhook
 *
 * Stripe sends a raw body – we must parse it as a Buffer BEFORE express.json().
 * This inline middleware overrides the global JSON parser for this single route.
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export default router;
