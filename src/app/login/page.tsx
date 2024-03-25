'use client'

import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { setAccessCode } from '@/actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const codeRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')

  const router = useRouter()

  const onLogin = async () => {
    if (!value?.trim()) {
      codeRef.current?.focus()
      return toast.error('Code is required')
    }

    try {
      setLoading(true)
      const res = await setAccessCode(value?.trim())
      if (!res) {
        toast.error('Auth code is invalid')
      } else {
        router.push('/')
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Auth Code</CardTitle>
          <CardDescription>
            Enter auth code to access the system
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              ref={codeRef}
              type="password"
              required
              placeholder="Enter code"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={loading} onClick={onLogin}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
