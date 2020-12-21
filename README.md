# strongly
Node.js Framework on top of fastify js. It helps you build your server-side application easily with decorators. 
With strongly js you don't need to add type validation, we do it for you on the fly. 

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
import { body, post, get, params, min, email } from "strongly";

class Contact {
    address?: string;
    id: number;
}
class UserDetails {
    @min(10)
    name: string;
    somePrimitiveArray?: string[];
    contacts: Contact[];
}

export class ShowCaseController {
    /**
     * id is required in the param and should by number
     */
    @get("getUser/:id") getUser(@params params: { id: number }) {
        return { name: "saba" };
    }

    /**
     * this is the same as previous one, with convenient way
     */
    @get("getUsers2/:id") getUsers2(@params("id") id: number) {
        return { name: "saba" };
    }

    /**
     * you can add validation as you want
     */
    @post login(@body("email") @email email: string, @body("password") @min(6) password: string) {
        return { name: "saba" };
    }

    /**
     * you can add validation on the class,  name should be ta least 10 letters
     */
    @post saveUser(@body user: UserDetails) {
        return user;
    }

    /**
     *  or send your schema validation
     */
    @post saveContact(@body<Contact>({ properties: { address: { maxLength: 10 } } }) contact: Contact) {
        return contact;
    }
}

```

#### create the server:

```typescript
ServerFactory.create({
  controllers: [ ShowCaseController ] /* controllers / path to the controller, or nothing if your controllers located in controllers folder **/
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
ts-node ./src/app.ts // or - tsc & node ./dist/app.js
```

open http://localhost:3000/api-doc to see the result.

### Dependency injection

just add your dependencies to the constructor params:

```typescript
export class AuthController {
    constructor(private userService: UserService) {}
    @post login(@body("email") @email email: string, @body("password") @min(6) password: string) {
        return this.userService.validateAndGetUser(email, password);
    }
}
```

use @mock decorator:
```typescript
@test("should return mocked user")
@mock<UserService>(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
async login() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } );
    expect(res.json()).toStrictEqual({ fName: "lo", lName: "asbaba" });
}
```

## Documentation
* [Server](https://github.com/yantrab/strongly#server)
* [Controllers](https://github.com/yantrab/strongly#controllers)
* [Route decorators](https://github.com/yantrab/strongly#Route-decorators)

## Server
#### create Fastify server instance
```typescript
ServerFactory.create(options)
```

```options: ```[FastifyServerOptions](https://github.com/fastify/fastify/blob/master/docs/Server.md) ```& { controllers, providers}```
* controller - your controllers or path to your controllers or nothing when your controllers is under controllers' folder.
* providers - services that you want to inject.

return [Fastify server instance](https://github.com/fastify/fastify/blob/master/docs/Server.md#instance).

## controllers
controller is group of routes that handle the http request/response. 
actually you don't need to decorate your controllers  with ```@controller``` decorator. 
we are taking the base path from the class name, with [punctuation](https://developers.google.com/search/docs/advanced/guidelines/url-structure?hl=en&visit_id=637441135196055730-2755038&rd=1), the base path for [ShowCaseController](https://github.com/yantrab/strongly/blob/master/show-case/src/controllers/show-case/show-case.controller.ts)  for example  will be "show-case".

if you want to set another url postfix you can pass it to the controller decorator -
```typescript
@Controller("base-path")
class SomeController {}
```

## Route decorators
```typescript
@get
@head
@post
@put
@delete
@options
@patch
```
we are taking the route path from the method name, with [punctuation](https://developers.google.com/search/docs/advanced/guidelines/url-structure?hl=en&visit_id=637441135196055730-2755038&rd=1)
```typescript
// the path for this route is /save-user
@post saveUser(@body user: UserDetails) {}
```
or specify your prefer path
```typescript
@get("getUser/:id") getUser(@params params: { id: number }) {}
```



