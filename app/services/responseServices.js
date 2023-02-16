exports.response = (res, message, data, code) => {
  try {
    res
      .status(code)
      .send({ results: { data: data }, message: message, code: code });
  } catch (err) {
    console.log("Oops! Something went wrong while sending response", err);
  }
};
