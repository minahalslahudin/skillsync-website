'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Refresh server components so middleware sees the new session cookie,
    // then navigate into the protected area.
    router.refresh()
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-display font-black text-brand-light">
            skill<span className="text-brand-accent">SYNC</span>
          </span>
          <p className="mt-1 text-sm text-brand-muted">Volunteer Portal</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-brand-muted/30 bg-brand-mid p-8">
          <h1 className="text-2xl font-display font-bold text-brand-light mb-6">
            Sign in to your account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="flex flex-col gap-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-sm text-brand-muted transition-colors hover:text-brand-accent"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-1"
            >
              Sign in
            </Button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-sm text-brand-muted">
          Don&apos;t have an account?{' '}
          <Link
            href="/join"
            className="text-brand-accent transition-colors hover:underline"
          >
            Apply to join as a volunteer.
          </Link>
        </p>
      </div>
    </main>
  )
}
