const asynchandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  };
};

export default asynchandler;
