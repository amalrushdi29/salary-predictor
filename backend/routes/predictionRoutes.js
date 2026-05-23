import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

// POST /api/predict
router.post("/", async (req, res) => {
    try {
        const { job_title, experience_level, work_models, company_location, company_size } = req.body;

        // ── Validate inputs ───────────────────────────────────
        if (!job_title || !experience_level || !work_models || !company_location || !company_size) {
            return res.status(400).json({
                success: false,
                error: "All fields are required"
            });
        }

        // ── Forward request to Flask ML service ───────────────
        const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ job_title, experience_level, work_models, company_location, company_size })
        });

        const mlData = await mlResponse.json();

        return res.status(200).json(mlData);

    } catch (error) {
        console.error("Prediction error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to connect to ML service"
        });
    }
});

export default router;