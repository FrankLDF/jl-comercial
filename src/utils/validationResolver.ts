export interface ValidationRules {
  required?: boolean | string
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  type?: 'email' | 'number' | 'string'
  custom?: (value) => string | null
}

export const defaultValidationMessages = {
  required: (label: string) => `'${label}' es requerido.`,
  email: (label: string) => `'${label}' no es un email válido.`,
  number: (label: string) => `'${label}' debe ser un número.`,
  min: (label: string, min: number) =>
    `'${label}' debe ser mayor o igual a ${min}.`,
  max: (label: string, max: number) =>
    `'${label}' debe ser menor o igual a ${max}.`,
  minLength: (label: string, min: number) =>
    `'${label}' debe tener al menos ${min} caracteres.`,
  maxLength: (label: string, max: number) =>
    `'${label}' no puede exceder ${max} caracteres.`,
  pattern: (label: string) => `'${label}' no cumple el formato requerido.`,
}

export const getMantineValidations = (
  rules: ValidationRules,
  label: string = 'Este campo'
) => {
  return (value) => {
    if (rules.required && !value?.toString().trim()) {
      return typeof rules.required === 'string'
        ? rules.required
        : defaultValidationMessages.required(label)
    }

    if (rules.type === 'email' && value && !/^\S+@\S+$/.test(value)) {
      return defaultValidationMessages.email(label)
    }

    if (rules.type === 'number' && value && isNaN(Number(value))) {
      return defaultValidationMessages.number(label)
    }

    if (rules.min !== undefined && value && Number(value) < rules.min) {
      return defaultValidationMessages.min(label, rules.min)
    }

    if (rules.max !== undefined && value && Number(value) > rules.max) {
      return defaultValidationMessages.max(label, rules.max)
    }

    if (
      rules.minLength !== undefined &&
      value &&
      value.length < rules.minLength
    ) {
      return defaultValidationMessages.minLength(label, rules.minLength)
    }

    if (
      rules.maxLength !== undefined &&
      value &&
      value.length > rules.maxLength
    ) {
      return defaultValidationMessages.maxLength(label, rules.maxLength)
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return defaultValidationMessages.pattern(label)
    }

    if (rules.custom) {
      return rules.custom(value)
    }

    return null
  }
}
