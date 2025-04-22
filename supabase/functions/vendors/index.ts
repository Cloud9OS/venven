import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get all vendors
    const { data: vendors, error: vendorsError } = await supabaseClient
      .from('users')
      .select('id, phone_number, name, user_type, service_type, service_details, location_url, is_approved, created_at, updated_at')
      .eq('user_type', 'vendor')

    if (vendorsError) {
      throw vendorsError
    }

    // Get approved vendors
    const { data: approvedVendors, error: approvedError } = await supabaseClient
      .from('users')
      .select('id, phone_number, name, user_type, service_type, service_details, location_url, is_approved, created_at, updated_at')
      .eq('user_type', 'vendor')
      .eq('is_approved', true)

    if (approvedError) {
      throw approvedError
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          vendors,
          approvedVendors
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 