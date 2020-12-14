import { ServerFactory } from "strongly";
import fastifyJwt, { FastifyJWTOptions } from "fastify-jwt";
import fastifyCookie from "fastify-cookie";
ServerFactory.create({
  logger: {
    level: "debug"
  }
}).then(app => {
  app.register(fastifyJwt, {
    secret: "supersecret",
    cookie: {
      cookieName: "token"
    }
  });
  app.register(fastifyCookie);
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      // reply.send(err);
    }
  });

  app.listen(3000, (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
});
