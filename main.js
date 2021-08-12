const crypto = require("crypto");

const signRequest = async (context) => {
  const { request } = context;

  const timestamp = Date.now();
  const body = request.getBody();
  const payload = [request.getMethod(), request.getUrl(), timestamp];

  if (body) {
    payload.push(body);
  }

  const secret = context.request.getEnvironmentVariable("SECRET");

  const content = payload.join(",");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(content)
    .digest("hex");

  console.log(signature);

  request.setHeader("X-Request-Signature", signature.toString());
  request.setHeader("X-Request-Timestamp", timestamp.toString());
};

module.exports.requestHooks = [signRequest];
