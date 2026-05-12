import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useChangePassword } from '@/api-hooks/profile/use-profile'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const schema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'Min. 8 characters'),
    confirm_password: z.string().min(1, 'Confirm your password'),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  })

type Values = z.infer<typeof schema>

type FieldKey = keyof Values

const FIELDS: { key: FieldKey; label: string; placeholder: string }[] = [
  { key: 'current_password', label: 'Current Password', placeholder: 'Enter current password' },
  { key: 'new_password', label: 'New Password', placeholder: 'Min. 8 characters' },
  { key: 'confirm_password', label: 'Confirm New Password', placeholder: 'Repeat new password' },
]

export function PasswordForm() {
  const [shown, setShown] = useState<Record<FieldKey, boolean>>({
    current_password: false,
    new_password: false,
    confirm_password: false,
  })

  const change = useChangePassword()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  const onSubmit = (values: Values) => {
    change.mutate(
      {
        current_password: values.current_password,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      },
      { onSuccess: () => form.reset() }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold'>Change Password</h2>
          <p className='text-sm text-muted-foreground'>
            Use a strong password of at least 8 characters.
          </p>
        </div>

        <div className='space-y-4'>
          {FIELDS.map(({ key, label, placeholder }) => (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={shown[key] ? 'text' : 'password'}
                        placeholder={placeholder}
                        className='pe-10'
                        autoComplete={
                          key === 'current_password'
                            ? 'current-password'
                            : 'new-password'
                        }
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setShown((s) => ({ ...s, [key]: !s[key] }))
                        }
                        className='absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        aria-label={shown[key] ? 'Hide password' : 'Show password'}
                      >
                        {shown[key] ? (
                          <EyeOff className='size-4' />
                        ) : (
                          <Eye className='size-4' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type='submit' disabled={change.isPending}>
          {change.isPending && <Loader2 className='mr-2 size-4 animate-spin' />}
          Change Password
        </Button>
      </form>
    </Form>
  )
}
