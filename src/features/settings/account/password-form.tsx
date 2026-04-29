import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FieldKey = 'currentPassword' | 'newPassword' | 'confirmPassword'

type PasswordField = {
  key: FieldKey
  label: string
  placeholder: string
}

const FIELDS: PasswordField[] = [
  {
    key: 'currentPassword',
    label: 'Current Password',
    placeholder: 'Enter current password',
  },
  {
    key: 'newPassword',
    label: 'New Password',
    placeholder: 'Min. 8 characters',
  },
  {
    key: 'confirmPassword',
    label: 'Confirm New Password',
    placeholder: 'Repeat new password',
  },
]

export function PasswordForm() {
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [shown, setShown] = useState<Record<FieldKey, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [passSaving, setPassSaving] = useState(false)

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passForm.currentPassword) {
      toast.error('Please enter current password')
      return
    }
    if (passForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setPassSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setPassSaving(false)
    setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    toast.success('Password changed successfully')
  }

  return (
    <form onSubmit={handlePasswordSave} className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold'>Change Password</h2>
        <p className='text-sm text-muted-foreground'>
          Use a strong password of at least 8 characters.
        </p>
      </div>

      <div className='space-y-4'>
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className='space-y-2'>
            <Label htmlFor={key}>{label}</Label>
            <div className='relative'>
              <Input
                id={key}
                type={shown[key] ? 'text' : 'password'}
                value={passForm[key]}
                onChange={(e) =>
                  setPassForm((f) => ({ ...f, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className='pr-10'
              />
              <button
                type='button'
                onClick={() => setShown((s) => ({ ...s, [key]: !s[key] }))}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {shown[key] ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button type='submit' disabled={passSaving}>
        {passSaving && <Loader2 className='mr-2 size-4 animate-spin' />}
        Change Password
      </Button>
    </form>
  )
}
