import { createClient } from '@supabase/supabase-js';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  {
    email: 'royhenderson@craudiovizai.com',
    password: 'oce@N251812345',
    role: 'admin',
    full_name: 'Roy Henderson'
  },
  {
    email: 'cindyhenderson@craudiovizai.com',
    password: 'oce@N251812345',
    role: 'admin',
    full_name: 'Cindy Henderson'
  },
  {
    email: 'royhenders@gmail.com',
    password: 'oce@N2518',
    role: 'customer',
    full_name: 'Roy Henderson (Customer)'
  }
];

async function createUsers() {
  console.log('Creating users...\n');

  for (const user of users) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name
        }
      });

      if (authError) {
        console.error(`❌ Error creating ${user.email}:`, authError.message);
        continue;
      }

      // Update profile role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: user.role })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error(`❌ Error setting role for ${user.email}:`, profileError.message);
        continue;
      }

      console.log(`✅ Created ${user.role}: ${user.email}`);
    } catch (error: unknown) {
      console.error(`❌ Error with ${user.email}:`, error);
    }
  }

  console.log('\n✅ User creation complete!');
}

createUsers();
