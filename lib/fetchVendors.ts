export async function fetchVendors() {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/vendors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      data: {
        vendors: result.data.vendors || [],
        approvedVendors: result.data.approvedVendors || []
      }
    };
  } catch (error: any) {
    console.error('Error fetching vendors:', error);
    return { success: false, error: error.message };
  }
} 