# SWB Exercise

In this repo is the code for the exercise. The point of this excercise was to build an object validator.

The object validator deals with the following types:

* strings
* numbers
* arrays
* objects
* booleans

It is one dimensional but I added an option to add *rules* for values. You can potentially expand this to check values multi-dimensionally or just for checking if the values match conditions.

## Setup, starting and testing

First install all the packages:
```
yarn
```

Starting the application:
```
yarn start
```

Testing:
```
yarn test
```
or NPM whatever you like ;)

## The schema

The schema that the validator compares the object with looks like this.

```typescript
type SchemaOptionsTypes = 'string' | 'number' | 'boolean' | 'array' | 'object';

interface SchemaOptions {
  type: SchemaOptionsTypes;
  required: boolean;
  rule?: (rule: any) => boolean;
}

interface Schema {
  [key: string]: SchemaOptions;
}
```

The `type` is for checking the types, `required` signals wether or not you want to explicitly have this in the data or if it is optional, and the `rule` takes a function that has to return a boolean and takes the value of the key.

This is an example of a schema:

```typescript
const userSchema: Schema = {
  id: {
    type: 'number',
    required: true,
  },
  username: {
    type: 'string',
    required: false,
  },
  password: {
    type: 'string',
    required: true,
    rule: (char: string) => {
      return char.length >= 6;
    },
  },
  followers: {
    type: 'array',
    required: false,
  },
};

```

## The validators inner workings

The validator takes the schema and the object to compare the schema with. 

```typescript
(schema: Schema, data: any) => { errors?: string[]; passed: boolean }
```


If the object adheres to the schema i return:
```typescript
{
  passed: true,
}
```

If it doesn't it returns:
```typescript
{
  errors: string[],
  passed: false,
}
```

Firstly I made the validator get an array of strings with the properties of the given objects.

```typescript
const dataKeys = Object.keys(data);

const schemaKeys = Object.keys(schema);
```


I check the properties of the object and compare it with to see if it contains all the properties in the schema. Also checking for the `required` property:
```typescript
function hasSamePropsAsSchema(): boolean {
  return schemaKeys.every((prop) => {
    if (dataKeys.indexOf(prop) >= 0) {
      return dataKeys.indexOf(prop) >= 0;
    } else {
      if (!schema[prop]?.required) return true;

      const errStr = `❌  ValidationError: "${prop}", was defined in the schema, but it is not present in the data...`;
      errors.push(errStr);
      console.log(errStr);
      return false;
    }
  });
}

```
```typescript
function hasSamePropsAsData(): boolean {
  return dataKeys.every((prop) => {
    if (schemaKeys.indexOf(prop) >= 0) {
      return schemaKeys.indexOf(prop) >= 0;
    } else {
      const errStr = `❌  ValidationError: "${prop}", was not defined in schema, but it is present in the data...`;
      errors.push(errStr);
      console.log(errStr);
      return false;
    }
  });
}
```

I also wrote a function to check if the conditions of the rule are true:

```typescript
function adheresToRule(prop: string): boolean {
  if (schema[prop]?.rule) {
    const res = schema[prop]?.rule?.(data[prop]);
    if (res) {
      return true;
    } else {
      const errStr = `❌  ValidationError: "${prop}", failed the ruleset...`;
      errors.push(errStr);
      console.log(errStr);
      return false;
    }
  } else {
    return true;
  }
}
```

If the `hasSamePropsAsData` and `hasSamePropsAsSchema` are true I then check the typing and rules of the properties:

```typescript
if (hasSamePropsAsData() === hasSamePropsAsSchema()) {
  dataKeys.forEach((prop) => {
    switch (schema[prop]?.type) {
      case 'string':
        return typeCheck.string(data[prop], prop) && adheresToRule(prop);
      case 'number':
        return typeCheck.number(data[prop], prop) && adheresToRule(prop);
      case 'boolean':
        return typeCheck.boolean(data[prop], prop) && adheresToRule(prop);
      case 'object':
        return typeCheck.object(data[prop], prop) && adheresToRule(prop);
      case 'array':
        return typeCheck.array(data[prop], prop) && adheresToRule(prop);
      default:
        return true;
    }
  });

  return errors.length > 0 ? { errors, passed: false } : { passed: true };
} else return { errors, passed: false }
```

`typeCheck` is an object with functions inside that check if the type we want. Eg:
```typescript
string(value: string, prop: string) {
  if (typeof value === 'string') {
    console.log(`✔️ Validation: ${prop} is a string`);
  } else {
    const errStr = `❌  ValidationError: ${prop} is not a string`;
    errors.push(errStr);
    console.log(errStr);
  }
  return typeof value === 'string';
},
```

I'm curious if you guys like this, found any better solutions, (god forbid) found any bugs, or have any questions. Let me know.

- Jorrit
