const childProcess = require("child_process");
const crypto = require("crypto");
const dotenv = require("dotenv");
const path = require("path");
const { promisify } = require("util");

const { getAddress } = require("./superface");

const exec = promisify(childProcess.exec);

const main = async () => {
  // load enviroment variables
  dotenv.config();

  // Create fastify server
  const server = require("fastify")({
    // set this to true for detailed logging:
    logger: false
  });

  // Setup static files
  await server.register(require("fastify-static"), {
    root: path.join(__dirname, "public"),
    prefix: "/"
  });

  // fastify-formbody lets us parse incoming forms
  await server.register(require("fastify-formbody"));

  // point-of-view is a templating manager for fastify
  await server.register(require("point-of-view"), {
    engine: {
      handlebars: require("handlebars")
    },
    includeViewExtension: true
  });

  // load and parse SEO data
  const seo = require("./src/seo.json");
  if (seo.url === "glitch-default") {
    seo.url = `https://${process.env.PROJECT_DOMAIN ?? "default"}.glitch.me`;
  }

  // homepage route
  server.get("/", async (_request, reply) => {
    const params = { seo: seo };
    await reply.view("/src/pages/index", params);
  });

  // homepage form
  server.post("/", async (request, reply) => {
    const { latitude, longitude, service } = request.body;

    // "Validate form input"
    let errorMessage;
    if (!latitude || !longitude) {
      errorMessage = "please enter latitude and longitude";
    } else if (!service) {
      errorMessage = "please select service";
    }

    let success, message, log;
    if (!errorMessage) {
      ({ success, message, log } = await getAddress(
        latitude,
        longitude,
        service
      ));
    }

    const params = {
      seo,
      errorMessage,
      message,
      success,
      log: JSON.stringify(log, null, 2)
    };

    await reply.view("/src/pages/index", params);
  });

  // webhook route for synchronization with github repository
  // https://github.com/superfaceai/reverse-geocode-example
  server.post("/git", async (request, reply) => {
    if (process.env.SECRET === undefined) {
      await reply.status(500);
    }

    const commitPushed = request.headers["x-github-event"] === "push";
    const refArray = commitPushed ? request.body.ref.split("/") : [];
    const branch = refArray[refArray.length - 1];

    const pushedToMaster = commitPushed && branch === "main";
    const pullRequestMerged =
      request.headers["x-github-event"] === "pullrequest" &&
      request.body.action === "closed" &&
      request.body.pull_request.merged;

    const hmac = crypto.createHmac("sha1", process.env.SECRET);
    const sig =
      "sha1=" + hmac.update(JSON.stringify(request.body)).digest("hex");

    if (
      (pushedToMaster || pullRequestMerged) &&
      sig === request.headers["x-hub-signature"]
    ) {
      {
        const { stdout, stderr } = await exec("chmod 777 git.sh");
        server.log.info(stdout);
        server.log.error(stderr);
      }
      {
        const { stdout, stderr } = await exec("./git.sh");
        server.log.info(stdout);
        server.log.error(stderr);
      }
      request.body;
      {
        const { stdout, stderr } = await exec("refresh");
        server.log.info(stdout);
        server.log.error(stderr);
      }

      server.log.info("> [GIT] Updated with origin/master");
    }

    reply.status(200);
    reply.send("webhook completed");
  });

  // Run the server and report out to the logs
  server.listen(process.env.PORT ?? 64187, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }

    console.log(`Your app is listening on ${address}`);
    server.log.info(`server listening on ${address}`);
  });
};

(async function() {
  await main();
})();
