import type { SchemaProps } from './base'

export const userSchema: SchemaProps = {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true },
}
