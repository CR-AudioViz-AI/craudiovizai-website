import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return NextResponse.json({ user })
}
```

---

## 🔧 **VERCEL ENVIRONMENT VARIABLES**

You need to add these to your Vercel project settings:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
