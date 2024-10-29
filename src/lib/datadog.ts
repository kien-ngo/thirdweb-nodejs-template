import dd from "dd-trace";

import { defaultLogger } from "./logger.js";

// Only start the tracer when DD is activated and running in K8S through Zeet
if (Boolean(process.env.DD_TRACER_ACTIVATED) && process.env.DD_ENV) {
  dd.tracer.init({
    logInjection: true,
    service: process.env.DD_SERVICE || process.env.ZEET_PROJECT_NAME,
    profiling: true,
    runtimeMetrics: true,
    clientIpEnabled: true,
    env: process.env.DD_ENV,
  }); // initialized in a different file to avoid hoisting.
  defaultLogger.info("DD_TRACER_ACTIVATED enabled");
} else {
  defaultLogger.info("DD_TRACER_ACTIVATED is not enabled");
}
