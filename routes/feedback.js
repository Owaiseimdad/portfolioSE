const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const validationCritirea = [
  check("name")
    .trim()
    .isLength({ min: 4 })
    .escape()
    .withMessage("A name is required to be more than 3 chars..."),
  check("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email address is required..."),
  check("title")
    .trim()
    .isLength({ min: 4 })
    .escape()
    .withMessage("Provide the title for the feedback"),
  check("message")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Describe in the message box provided..."),
];

module.exports = (params) => {
  const { feedbackService } = params;

  router.get("/", async (req, res, next) => {
    try {
      const feedbackData = await feedbackService.getList();

      const errors = req.session.feedback ? req.session.feedback.error : false;

      const successMessage = req.session.feedback
        ? req.session.feedback.message
        : false;

      req.session.feedback = {};

      return res.render("layouts", {
        pageTitle: "Feedback",
        template: "feedback",
        feedbackData,
        errors,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post("/", validationCritirea, async (req, res, next) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        req.session.feedback = {
          error: error.array(),
        };
        return res.redirect("/feedback");
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);

      req.session.feedback = {
        message: "Thanks for your inputs",
      };
      return res.redirect("/feedback");
    } catch (err) {
      return next(err);
    }
  });

  router.post("/api", validationCritirea, async (req, res, next) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.json({ errors: error.array() });
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedback = await feedbackService.getList();
      return res.json({
        feedback,
        successMessage: "Thank you for your feedback!",
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
