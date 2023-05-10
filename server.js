const express = require("express");
const path = require("path");
const cookiesSession = require("cookie-session");
const createError = require("http-errors");
const bodyParser = require("body-parser");

const FeedbackService = require("./services/FeedbackService");
const SpeakersService = require("./services/SpeakerService");

const feedbackService = new FeedbackService("./data/feedback.json");
const speakersService = new SpeakersService("./data/speakers.json");

const route = require("./routes");

const app = express();
const PORT = 3000;

app.locals.TITLE = "FindSpace";
app.set("trust proxy", 1);

//Throwing the error.
// app.get("/throw", (req, res, next) => {
//   setTimeout(() => {
//     return next(new Error("Something went wrong"));
//   }, 500);
// });

app.use(
  cookiesSession({
    name: "session",
    keys: ["adsadajhcaisbd", "acsakjcansncaso"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(async (req, res, next) => {
  try {
    if (await speakersService.getNames()) {
      res.locals.speakerNames = await speakersService.getNames();
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(express.static("./provided/static"));
app.use(
  "/",
  route({
    feedbackService,
    speakersService,
  })
);

app.use((req, res, next) => {
  next(createError(404, "Page Not found.."));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  console.log(status);
  res.status(status);
  res.render("error", { status });
});

app.listen(PORT, () => {
  console.log("I am here, listening!!!!", PORT);
});
