
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um valor numérico para o formato de moeda em reais (R$)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um número de telefone brasileiro
 */
export function formatPhone(phone: string): string {
  // Remove tudo que não for dígito
  const digits = phone.replace(/\D/g, '');
  
  // Se for um número brasileiro completo (com 55 na frente)
  if (digits.startsWith('55') && digits.length >= 12) {
    // Formato: +55 (XX) XXXXX-XXXX
    const ddd = digits.substring(2, 4);
    const part1 = digits.substring(4, 9);
    const part2 = digits.substring(9, 13);
    return `+55 (${ddd}) ${part1}-${part2}`;
  }
  
  // Se for apenas DDD + número
  if (digits.length === 10 || digits.length === 11) {
    const ddd = digits.substring(0, 2);
    const hasNine = digits.length === 11;
    
    if (hasNine) {
      // Formato: (XX) XXXXX-XXXX (com 9 na frente)
      const part1 = digits.substring(2, 7);
      const part2 = digits.substring(7);
      return `(${ddd}) ${part1}-${part2}`;
    } else {
      // Formato: (XX) XXXX-XXXX (sem 9 na frente)
      const part1 = digits.substring(2, 6);
      const part2 = digits.substring(6);
      return `(${ddd}) ${part1}-${part2}`;
    }
  }
  
  // Se não for possível formatar, retorna o número original
  return phone;
}

/**
 * Formata um CPF ou CNPJ
 */
export function formatCpfCnpj(value: string): string {
  // Remove tudo que não for dígito
  const digits = value.replace(/\D/g, '');
  
  // Formata como CPF
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  // Formata como CNPJ
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

/**
 * Valida se uma string é um email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se uma string é um número de telefone brasileiro válido
 */
export function isValidBrazilianPhone(phone: string): boolean {
  // Remove tudo que não for dígito
  const digits = phone.replace(/\D/g, '');
  
  // Verifica se tem entre 10 e 13 dígitos (DDD + número ou 55 + DDD + número)
  if (digits.length < 10 || digits.length > 13) {
    return false;
  }
  
  // Verifica se começa com 55 (Brasil) quando tem mais de 11 dígitos
  if (digits.length > 11 && !digits.startsWith('55')) {
    return false;
  }
  
  return true;
}

/**
 * Valida se uma string é um CPF válido
 */
export function isValidCpf(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

/**
 * Valida se uma string é um CNPJ válido
 */
export function isValidCnpj(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Validação do primeiro dígito verificador
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Validação do segundo dígito verificador
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
}

/**
 * Verifica se uma string é um CPF ou CNPJ válido
 */
export function isValidCpfCnpj(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 11) {
    return isValidCpf(digits);
  } else if (digits.length === 14) {
    return isValidCnpj(digits);
  }
  
  return false;
}
