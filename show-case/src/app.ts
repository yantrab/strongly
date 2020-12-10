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

  // app.post(
  //   "/test",
  //   {
  //     preHandler: async (request, reply, done) => {
  //       try {
  //         await request.jwtVerify();
  //       } catch (err) {
  //         reply.send(err);
  //       }
  //     }
  //   },
  //   (req, replay) => {
  //     console.log("a");
  //   }
  // );

  app.listen(3000, (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
});
