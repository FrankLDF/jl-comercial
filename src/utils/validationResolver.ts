// import type { Rule, RuleObject } from 'antd/es/form'

// type RuleType = RuleObject['type']

// interface RuleOptions {
//   required?: boolean
//   min?: number
//   max?: number
//   maxLength?: number
//   label?: string
//   type?: RuleType
// }

// export const generateValidationRules = ({
//   required,
//   min,
//   max,
//   maxLength,
//   label = 'Este campo',
//   type = 'string',
// }: RuleOptions): Rule[] => {
//   const rules: Rule[] = []

//   if (required) {
//     rules.push({ required: true, message: `${label} es requerido` })
//   }

//   if (min !== undefined) {
//     rules.push({
//       type,
//       min,
//       message: `${label} debe tener al menos: ${min} caracteres`,
//     })
//   }

//   if (max !== undefined) {
//     rules.push({
//       type,
//       max,
//       message: `${label} debe tener como máximo: ${max} caracteres`,
//     })
//   }

//   if (maxLength !== undefined) {
//     rules.push({
//       max: maxLength,
//       message: `${label} debe tener como máximo: ${maxLength} caracteres`,
//     })
//   }

//   return rules
// }

import type { Rule, RuleObject } from 'antd/es/form'

export type RuleType = RuleObject['type']

interface RuleOptions {
  required?: boolean
  min?: number
  max?: number
  maxLength?: number
  minLength?: number
  label?: string
  type?: RuleType
  pattern?: RegExp
  patternMessage?: string
}

export const generateValidationRules = ({
  required,
  min,
  max,
  maxLength,
  minLength,
  label = 'Este campo',
  type = 'string',
  pattern,
  patternMessage,
}: RuleOptions): Rule[] => {
  const rules: Rule[] = []

  if (required) {
    rules.push({ required: true, message: `${label} es requerido` })
  }

  if (type) {
    switch (type) {
      case 'email':
        rules.push({
          type: 'email',
          message: `${label} debe ser un correo electrónico válido`,
        })
        break

      case 'url':
        rules.push({
          type: 'url',
          message: `${label} debe ser una URL válida`,
        })
        break

      case 'number':
        if (min !== undefined) {
          rules.push({
            type: 'number',
            min,
            message: `${label} debe ser mayor o igual a ${min}`,
          })
        }
        if (max !== undefined) {
          rules.push({
            type: 'number',
            max,
            message: `${label} debe ser menor o igual a ${max}`,
          })
        }
        break

      case 'string':
      default:
        if (minLength !== undefined) {
          rules.push({
            type: 'string',
            min: minLength,
            message: `${label} debe tener al menos ${minLength} caracteres`,
          })
        }
        if (maxLength !== undefined) {
          rules.push({
            type: 'string',
            max: maxLength,
            message: `${label} debe tener como máximo ${maxLength} caracteres`,
          })
        }
        break
    }
  }

  if (pattern) {
    rules.push({
      pattern,
      message: patternMessage || `${label} no tiene el formato válido`,
    })
  }

  return rules
}
