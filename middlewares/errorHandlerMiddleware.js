export const errorHandler = (err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "Internal server error!";
  res.status(status).json({ status: "error", message: message });
};
