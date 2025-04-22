import { createClient } from 'npm:@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import bcrypt from 'npm:bcryptjs@2.4.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, phone_number, password, user_type, service_type, service_details, location_url } = await req.json();

    // Validate input
    if (!name || !phone_number || !password || !user_type) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Name, phone number, password, and user type are required',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', phone_number)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Phone number already registered',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data object
    const userData: any = {
      name,
      phone_number,
      password: hashedPassword,
      user_type,
      is_approved: true, // Admin created users are automatically approved
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add vendor-specific fields
    if (user_type === 'vendor') {
      if (!service_type) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Service type is required for vendors',
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      userData.service_type = service_type;
      userData.service_details = service_details;
    }

    // Add customer-specific fields
    if (user_type === 'customer') {
      userData.location_url = location_url;
    }

    // Create user in the database
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to create user',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          phone_number: newUser.phone_number,
          user_type: newUser.user_type,
          is_approved: newUser.is_approved,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in admin-create:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}); 