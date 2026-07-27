import 'server-only'

import { hash, verify } from '@node-rs/argon2'

/**
 * OWASP-recommended argon2id parameters (19 MiB, 2 passes).
 *
 * `Algorithm.Argon2id` is an ambient const enum, which `isolatedModules` won't let
 * us reference, so the value is inlined — argon2id is 2 in @node-rs/argon2.
 */
const OPTIONS = {
  algorithm: 2 as const,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
}

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, OPTIONS)
}

export async function verifyPassword(digest: string, plain: string): Promise<boolean> {
  try {
    return await verify(digest, plain, OPTIONS)
  } catch {
    // Malformed or truncated hash — treat as a failed login, never as a pass.
    return false
  }
}

/**
 * Burn roughly the same time as a real verify when no account exists, so response
 * timing doesn't reveal which emails are registered.
 */
export async function fakeVerify(): Promise<void> {
  await hashPassword('timing-equalizer-not-a-real-password')
}

export interface PasswordProblem {
  message: string
}

/**
 * Length is the requirement that actually matters. Composition rules push people
 * toward "Password1!" and buy very little, so we check length and screen the
 * handful of passwords that show up in every breach list.
 */
const OBVIOUS = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwertyui', 'qwerty123', 'letmein1', 'iloveyou', 'welcome1', 'admin123',
  'royalbacks', 'royalbacks1',
])

export function validatePassword(plain: string): PasswordProblem | null {
  if (plain.length < 10) {
    return { message: 'Password must be at least 10 characters.' }
  }
  if (plain.length > 200) {
    return { message: 'Password must be under 200 characters.' }
  }
  if (OBVIOUS.has(plain.toLowerCase())) {
    return { message: 'That password is too common. Pick something harder to guess.' }
  }
  return null
}
