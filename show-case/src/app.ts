import { ServerFactory } from "strongly";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "fastify-cookie";
import { MongoClient } from "mongodb";
import { mongoUrl } from "./services/config/config.service";
import { MongoMemoryServer } from "mongodb-memory-server";

const start = async () => {
  const url = mongoUrl || (await new MongoMemoryServer().getUri());
  const mongo = await new MongoClient(url);
  await mongo.connect();
  ServerFactory.create({
    logger: {
      level: "debug"
    },
    providers: [{ provide: MongoClient, useValue: mongo }]
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
        reply.setCookie("token", request.cookies.token, {
          path: "/",
          secure: false,
          httpOnly: true,
          sameSite: false,
          maxAge: 3600
        });
      } catch (err) {}
    });

    app.listen(3000, err => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  });
};
start();
