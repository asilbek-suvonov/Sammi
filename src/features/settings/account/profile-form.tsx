import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { usePatchProfile } from '@/api-hooks/profile/use-profile'
import type { Profile } from '@/service/profile/profile.types'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  first_name: z.string().trim().max(80, 'Too long').optional().or(z.literal('')),
  last_name: z.string().trim().max(80, 'Too long').optional().or(z.literal('')),
  username: z.string().trim().min(2, 'At least 2 characters').max(40),
  nickname: z.string().trim().min(1, 'Required').max(40),
  bio: z.string().trim().max(500, 'Max 500 characters').optional().or(z.literal('')),
})

type Values = z.infer<typeof schema>

function toValues(p: Profile): Values {
  return {
    first_name: p.first_name ?? '',
    last_name: p.last_name ?? '',
    username: p.username ?? '',
    nickname: p.nickname ?? '',
    bio: p.bio ?? '',
  }
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const patch = usePatchProfile()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: toValues(profile),
  })

  useEffect(() => {
    form.reset(toValues(profile))
  }, [profile, form])

  const onSubmit = (values: Values) => {
    patch.mutate({
      first_name: values.first_name || '',
      last_name: values.last_name || '',
      username: values.username,
      nickname: values.nickname,
      bio: values.bio || '',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold'>Personal Info</h2>
          <p className='text-sm text-muted-foreground'>
            Update your display name and username.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='last_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='nickname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder='Your display name' {...field} />
              </FormControl>
              <FormDescription>
                The name shown across the platform.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className='relative'>
                  <span className='pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                    @
                  </span>
                  <Input placeholder='johndoe' className='ps-7' {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder='Tell us a bit about yourself.'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-2'>
          <FormLabel>Email</FormLabel>
          <Input
            value={profile.email}
            readOnly
            disabled
            className='cursor-not-allowed opacity-60'
          />
          <p className='text-xs text-muted-foreground'>
            Email cannot be changed here.
          </p>
        </div>

        <Button type='submit' disabled={patch.isPending}>
          {patch.isPending && <Loader2 className='mr-2 size-4 animate-spin' />}
          Save Profile
        </Button>
      </form>
    </Form>
  )
}
