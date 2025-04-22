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
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (path === 'login') {
      const { phone_number, password } = await req.json();

      // Validate input
      if (!phone_number || !password) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Phone number and password are required',
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

      // Get user from database
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phone_number)
        .single();

      if (userError || !user) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Invalid credentials',
          }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Invalid credentials',
          }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Generate a simple token using user's ID and timestamp
      const token = btoa(`${user.id}:${Date.now()}`);

      // Return user data and token
      return new Response(
        JSON.stringify({
          success: true,
          token: token,
          user: {
            id: user.id,
            name: user.name,
            phone_number: user.phone_number,
            user_type: user.user_type,
            is_approved: user.is_approved,
            avatar_url: user.avatar_url,
          },
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (path === 'register') {
      const { name, phone_number, password, location_url } = await req.json();

      // Validate input
      if (!name || !phone_number || !password) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Name, phone number, and password are required',
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

      // Create user in the database with a generated UUID
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            name,
            phone_number,
            password: hashedPassword,
            user_type: 'customer',
            location_url,
            is_approved: true,
          },
        ])
        .select()
        .single();

      if (createError) {
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

      // Generate a simple token using user's ID and timestamp
      const token = btoa(`${newUser.id}:${Date.now()}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Registration successful',
          token: token,
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
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid endpoint',
      }),
      {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
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