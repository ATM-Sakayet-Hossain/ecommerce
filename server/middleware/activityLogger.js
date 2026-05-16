const { createActivityLog } = require("../services/activityLogService");

const resolveActorName = (req) => {
  return (
    req.user?.fullName ||
    req.user?.email ||
    req.body?.fullName ||
    req.body?.email ||
    "System"
  );
};

const resolveActorEmail = (req) => {
  return req.user?.email || req.body?.email;
};

const getDefaultEntityName = (req, responseBody) => {
  return (
    responseBody?.data?.title ||
    responseBody?.data?.name ||
    responseBody?.data?.slug ||
    req.body?.title ||
    req.body?.name ||
    req.params?.slug ||
    req.params?.orderId ||
    req.params?.id ||
    req.body?.email ||
    null
  );
};

const activityLogger = ({
  action,
  entityType = "General",
  getEntityName,
  getEntityId,
  getDetails,
} = {}) => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    let responseBody;

    res.json = (body) => {
      responseBody = body;
      return originalJson(body);
    };

    res.on("finish", () => {
      if (!action || !responseBody?.success || res.statusCode >= 400) {
        return;
      }

      const entityName =
        typeof getEntityName === "function"
          ? getEntityName(req, responseBody)
          : getDefaultEntityName(req, responseBody);
      const entityId =
        typeof getEntityId === "function"
          ? getEntityId(req, responseBody)
          : responseBody?.data?._id?.toString?.() ||
            responseBody?.data?.id ||
            req.params?.slug ||
            req.params?.orderId ||
            req.params?.id ||
            null;
      const details =
        typeof getDetails === "function"
          ? getDetails(req, responseBody)
          : req.method === "PUT" || req.method === "POST"
            ? {
                body: req.body,
                params: req.params,
              }
            : {};

      createActivityLog({
        actor: req.user?._id,
        actorName: resolveActorName(req),
        actorEmail: resolveActorEmail(req),
        actorRole: req.user?.role || "guest",
        action,
        entityType,
        entityId,
        entityName,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        details,
      });
    });

    next();
  };
};

module.exports = { activityLogger };