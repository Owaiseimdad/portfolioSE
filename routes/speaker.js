const express = require("express");
const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;

  router.get("/", async (req, res, next) => {
    try {
      const speakers = await speakersService.getList();
      const allArtwork = await speakersService.getAllArtwork();

      // Counting the speakers page visits.
      if (!req.session.visitCountSpeakers) {
        req.session.visitCountSpeakers = 0;
      }
      req.session.visitCountSpeakers += 1;
      console.log(
        `Number of visits to speakers page: ${req.session.visitCountSpeakers}`
      );
      return res.render("layouts", {
        pageTitle: "Speakers",
        template: "speakers",
        speakers,
        allArtwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get("/:speakername", async (req, res, next) => {
    try {
      const speaker = await speakersService.getSpeaker(req.params.speakername);
      const allArtwork = await speakersService.getArtworkForSpeaker(
        req.params.speakername
      );
      if (!req.session.visitCountSingleSpeakers) {
        req.session.visitCountSingleSpeakers = 0;
      }
      req.session.visitCountSingleSpeakers += 1;
      console.log(
        `Number of visits to individual speakers page: ${req.session.visitCountSingleSpeakers}`
      );
      return res.render("layouts", {
        pageTitle: "Speakers",
        template: "speaker-details",
        speaker,
        allArtwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
