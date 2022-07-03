type SchemaOptionsTypes = 'string' | 'number' | 'boolean' | 'array' | 'object';

interface SchemaOptions {
  type: SchemaOptionsTypes;
  required: boolean;
  rule?: (rule: any) => boolean;
}

interface Schema {
  [key: string]: SchemaOptions;
}

const validate = (schema: Schema, data: any): { errors?: string[]; passed: boolean } => {
  const dataKeys = Object.keys(data);

  const schemaKeys = Object.keys(schema);

  const errors: string[] = [];

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

  const typeCheck: { [key: string]: (value: any, prop: string) => boolean } = {
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

    number(value: number, prop: string) {
      if (typeof value === 'number') {
        console.log(`✔️ Validation: ${prop} is a number`);
      } else {
        const errStr = `❌  ValidationError: ${prop} is not a number`;
        errors.push(errStr);
        console.log(errStr);
      }
      return typeof value === 'number';
    },

    boolean(value: boolean, prop: string) {
      if (typeof value === 'boolean') {
        console.log(`✔️ Validation: ${prop} is a boolean`);
      } else {
        const errStr = `❌  ValidationError: ${prop} is not a boolean`;
        errors.push(errStr);
        console.log(errStr);
      }
      return typeof value === 'boolean';
    },

    array(value: any[], prop: string) {
      if (value.constructor.toString().indexOf('Array') > -1) {
        console.log(`✔️ Validation: ${prop} is an array`);
      } else {
        const errStr = `❌  ValidationError: ${prop} is not a array`;
        errors.push(errStr);
        console.log(errStr);
      }
      return value.constructor.toString().indexOf('Array') > -1;
    },

    object(value: any[], prop: string) {
      if (value.constructor.toString().indexOf('Object') > -1) {
        console.log(`✔️ Validation: ${prop} is an object`);
      } else {
        const errStr = `❌  ValidationError: ${prop} is not an object`;
        errors.push(errStr);
        console.log(errStr);
      }
      return value.constructor.toString().indexOf('Object') > -1;
    },
  };

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
  } else return { errors, passed: false };
};

export { Schema, validate };
