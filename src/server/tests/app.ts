import { ServerFactory } from "../server";

const start = async () => {
  ServerFactory.create({
    logger: {
      level: "debug",
    },
  }).then((app) => {
    app.listen(3000, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  });
};
start();
