# strongly
Make your server strongly typed without adding any piece of code.

## the motivation

All of us doing type validation in the server, we don't want to make any expensive think for free, for example if your api return the user by id from the database, and client sent invalid id type, you don't want to do database query at all.

So, probably you do something like:

```
const schema = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required()
});
```

The question is, if I already declare the parameters type, why should I do it twice?

This package will help you to avoid this annoying things and let you focus on the really important work.

## Get started
#### install
```
npm i strongly
```

#### create your controller:
```typescript
class Contact {
  address?: string;
  id: number;
}
class UserDetails {
  name: string;
  somePrimitiveArray?: string[];
  contacts: Contact[];
}

class ShowCaseController {
  @post getUsers(@body("id") id: number) {
    return id;
  }

  @post getUsers4(@body user: { id?: number }) {
    return user;
  }
  @post getUsers5(@body user: number[]) {
    return user;
  }
  @post getUsers6(@body user: { id?: number; name: string }) {
    return user;
  }
  /**
   * some description for the method
   */
  @post getUsers7(@body user: UserDetails) {
    return user;
  }
  @post getUsers8(@body user: { id?: number; name: string }[]) {
    return user[0].name;
  }
  @post getUsers9(@body<number>("id", { minimum: 1 }) id?: number) {
    return 5;
  }
  @post getUsers10(@body<Contact>({ properties: { address: { maxLength: 10 } } }) contact: Contact) {
    return 5;
  }
}
```

#### create the server:

```typescript
ServerFactory.create({
  controllers: [
    ShowCaseController
  ] /*you can pass your controllers,
// or the path to the controller, or nothing if your controllers located in controllers folder **/
}).then(app =>
  app.listen(3000, (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  })
);
```

#### run your app

```
ts-node ./src/app.ts
```

open http://localhost:3000/api-doc to see the result.

