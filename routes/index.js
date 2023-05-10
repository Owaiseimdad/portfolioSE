const express = require("express");
const router = express.Router();
const speakerRoute = require("./speaker");
const feedbackRoute = require("./feedback");

console.log("Index.js");

module.exports = (params) => {
  const { speakersService } = params;

  router.get("/", async (req, res, next) => {
    try {
      const topSpeakersTitles = await speakersService.getList();
      const allArtwork = await speakersService.getAllArtwork();
      res.locals.speakersDeatils = topSpeakersTitles;
      if (!req.session.visitCount) {
        req.session.visitcount = 0;
      }
      req.session.visitCount += 1;
      console.log(`Number of visits: ${req.session.visitCount}`);
      return res.render("layouts", {
        pageTitle: "Welcome",
        template: "index",
        allArtwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use("/feedback", feedbackRoute(params));
  router.use("/speaker", speakerRoute(params));

  return router;
};
