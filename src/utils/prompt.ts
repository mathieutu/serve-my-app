import { prompt } from 'enquirer'

export const confirm = async (message: string, initial: boolean = true): Promise<boolean> => {
  return (await prompt<{ answer: boolean }>({
    message,
    initial,
    type: 'confirm',
    name: 'answer',
  })).answer
}

export const input = async (
  message: string,
  initial?: string,
  required: boolean = true,
): Promise<string> => {
  return (await prompt<{ answer: string }>({
    message,
    initial,
    validate: value => required ? !!value.trim().length || 'This field is required!' : true,
    type: 'input',
    name: 'answer',
  })).answer
}
