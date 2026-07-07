const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const aiRoutes = require("./routes/ai.routes");
const errorMiddleware = require("./middlewares/errors");

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Body Parsers & Cookie handling (Consolidated to avoid duplicate parsing glitches)
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));
app.use(cookieParser());
app.use(fileUpload());

// Reverse Proxy for Stripe (If active)
app.use("/proxy", (req, res) => {
  var url = "https://checkout.stripe.com" + req.url;
  req.pipe(request(url)).pipe(res);
});

// Import all routes
const foodRouter = require("./routes/foodItem");
const restaurant = require("./routes/restaurant");
const menuRouter = require("./routes/menu");
const coupon = require("./routes/couponRoutes");
const order = require("./routes/order");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const cart = require("./routes/cart");

// Mount API Routes
app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant); // Matches frontend api.get("/v1/eats/stores")
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/users", auth);
app.use("/api/v1", payment);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/eats/cart", cart);
app.use("/api/v1/ai", aiRoutes);

// View Engine Settings
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Catch-all 404 Route for Unmatched Routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server !`,
  });
});

// Global Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;