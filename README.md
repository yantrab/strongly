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
@mock(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
async login() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } );
    expect(res.json()).toStrictEqual({ fName: "lo", lName: "asbaba" });
}
```

## Documentation
* [Server](https://github.com/yantrab/strongly#server)
* [Controllers](https://github.com/yantrab/strongly#controllers)
* [Route decorators](https://github.com/yantrab/strongly#Route-decorators)
* [Route parameter decorators](https://github.com/yantrab/strongly#Route-parameter-decorators)
* [Validation](https://github.com/yantrab/strongly#validation-decorators)
* [Guard decorator](https://github.com/yantrab/strongly#Guard-decorator)
* [OpenAPI (Swagger)](https://github.com/yantrab/strongly#openapi-swagger)

## Server
#### create Fastify server instance
```typescript
ServerFactory.create(options)
```

```options: ```[FastifyServerOptions](https://github.com/fastify/fastify/blob/master/docs/Server.md) ```& { controllers, providers}```
* controller - your controllers or path to your controllers or nothing when your controllers is under controllers' folder.
* providers - services that you want to inject.

return [Fastify server instance](https://github.com/fastify/fastify/blob/master/docs/Server.md#instance).

## Controllers
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

## Route parameter decorators
- @body - request.body - parameters - (path: thePath)
- @query - request.query
- @params - request.params
- @headers - request.headers
- @user - request.user
- @request - [request](https://www.fastify.io/docs/latest/Request/)
- @reply - [reply](https://www.fastify.io/docs/latest/Reply/)
- @app - [Fastify server instance](https://github.com/fastify/fastify/blob/master/docs/Server.md#instance)

examples
```typescript
// request.query
@get getUser(@query query: { id: number }) {}

// request.query.id
@get getUser(@query("id") id: number) {}
```
- string - ```{allOf:[{ transform: ["trim"] }, { minLength: 1 }], type: "string"}```
- number - ```{type: "number"}```

## Validation
Fastify uses a schema-based approach, and using [ajv](https://www.npmjs.com/package/ajv) by default. 
we are build the schema from your types - 
- string - ```{allOf:[{ transform: ["trim"] }, { minLength: 1 }], type: "string"}```
- number - ```{type: "number"}```
- boolean - ```{type: "boolean"}```

you can add extra validation -
- send the schema to the route param decorators:
    ```typescript
     saveContact(@body<Contact>({ properties: { address: { maxLength: 10 } } }) contact: Contact)
    ```
- or add validation decorator to your model:
    ```typescript
    class UserDetails {
      @min(10) name: string;
    }
    ```
available extra validation decorators:

    - min/max can be on string, number, or array.
    - all [format](https://ajv.js.org/docs/validation.html#formats) string validation

example - 
```typescript
// email prameter should be email formatm, and password length should be more then 5 letters
login(@body("email") @email email: string, @body("password") @min(6) password: string) {}
```

## Guard decorator
gourd decorator add pre handler hook to validate that the user have permission.
param - (user) => boolean
you can decorate class to method that you want to protect:
```typescript
@guard(user => user.role === "editor")
class a {
  @guard(user => user.isAdmin)
  @get b () {
    return 1;
  }
}
```

be aware that you need to add the user to the request by you own, you can use [fastify-jwt](https://github.com/fastify/fastify-jwt) to do it. 
see [here](https://github.com/yantrab/strongly/blob/master/show-case/src/app.ts) full example. 

## OpenAPI - Swagger
Like ajv schema we are build the open api schema from you types.
just open http://localhost:3000/api-doc to see it,
for example - for the show-case controllers - this is the swagger specification -
```typescript
export class AuthController {
  @post async login(@body("email") @email email: string, @body("password") @min(6) password: string) { }

  @post logout(@reply reply, @request req) {  }

  @get getUserAuthenticated(@user user, @reply reply): User {}
}

```
the swagger specification is - 
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "show-case",
    "version": "1.0.0",
    "description": "some examples of using Strongly framework."
  },
  "paths": {
    "/admin/users": {
      "get": {
        "tags": [
          "admin"
        ],
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          }
        },
        "operationId": "users"
      }
    },
    "/admin/add-user": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/User"
              }
            }
          },
          "required": true
        },
        "tags": [
          "admin"
        ],
        "responses": {
          "default": {
            "description": "Default response"
          }
        },
        "operationId": "addUser"
      }
    },
    "/auth/login": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "properties": {
                  "password": {
                    "type": "string",
                    "allOf": [
                      {
                        "transform": [
                          "trim"
                        ]
                      },
                      {
                        "minLength": 1
                      }
                    ],
                    "minLength": 6
                  },
                  "email": {
                    "format": "email",
                    "type": "string",
                    "allOf": [
                      {
                        "transform": [
                          "trim"
                        ]
                      },
                      {
                        "minLength": 1
                      }
                    ]
                  }
                },
                "type": "object",
                "required": [
                  "password",
                  "email"
                ]
              }
            }
          },
          "required": true
        },
        "tags": [
          "auth"
        ],
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          }
        },
        "operationId": "login"
      }
    },
    "/auth/logout": {
      "post": {
        "tags": [
          "auth"
        ],
        "responses": {
          "default": {
            "description": "Default response"
          }
        },
        "operationId": "logout"
      }
    },
    "/auth/get-user-authenticated": {
      "get": {
        "tags": [
          "auth"
        ],
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          }
        },
        "operationId": "getUserAuthenticated"
      }
    }
  },
  "tags": [
    {
      "name": "admin"
    },
    {
      "name": "auth",
      "description": "User authentication stuff"
    }
  ],
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "phone": {
            "type": "string",
            "allOf": [
              {
                "transform": [
                  "trim"
                ]
              },
              {
                "minLength": 1
              }
            ]
          },
          "email": {
            "type": "string",
            "allOf": [
              {
                "transform": [
                  "trim"
                ]
              },
              {
                "minLength": 1
              }
            ]
          },
          "fName": {
            "type": "string",
            "allOf": [
              {
                "transform": [
                  "trim"
                ]
              },
              {
                "minLength": 1
              }
            ]
          },
          "lName": {
            "type": "string",
            "allOf": [
              {
                "transform": [
                  "trim"
                ]
              },
              {
                "minLength": 1
              }
            ]
          },
          "role": {
            "type": "string",
            "enum": [
              "admin",
              "user"
            ]
          },
          "_id": {
            "type": "string",
            "allOf": [
              {
                "transform": [
                  "trim"
                ]
              },
              {
                "minLength": 1
              }
            ]
          }
        },
        "required": [
          "phone",
          "email",
          "fName",
          "lName",
          "role"
        ]
      }
    }
  }
}
```

### we take some parameters from yoru package.json file
- version - your package version
- title - your package name
- description - your package description

### you can add description to your controller -
```typescript
@Controller("auth", { description: "User authentication stuff" })
```

### you can add description to your route -
```typescript
  /**
 *  just add comment upon your route method
 */
@post someRoute() {}
```

## Dependencies
- [fastify](https://www.npmjs.com/package/fastify) - a web framework to serve your routes
- [ts-morph](https://www.npmjs.com/package/ts-morph) - TypeScript Compiler API wrapper to parse your types to ajv & swagger schemas.
- [fastify-static](https://www.npmjs.com/package/fastify-static) & [swagger-ui-dist](https://www.npmjs.com/package/swagger-ui-dist) - to exposes Swagger-UI page

