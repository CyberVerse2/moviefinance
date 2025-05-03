import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';

// Environment Variables Validation - Keep Supabase
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const envResult = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

if (!envResult.success) {
  console.error('🔴 Invalid environment variables for /api/update-project-zora-address:', envResult.error.flatten().fieldErrors);
  // Throw or handle appropriately; server cannot function without these.
  throw new Error('Server configuration error: Missing or invalid Supabase environment variables.');
}

// const env = envResult.data; // Not strictly needed if only used once

// Define the expected shape of the request body for updating Supabase
const updateCoinSchema = z.object({
  projectId: z.string().uuid('Invalid Project ID'),
  zoraContractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Zora contract address'),
});

export async function POST(req: NextRequest) {
  // Environment variables checked at startup

  let requestBody;
  try {
    requestBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = updateCoinSchema.safeParse(requestBody);

  if (!validation.success) {
    console.error('🔴 Update Zora Address Validation Error:', validation.error.flatten());
    return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { projectId, zoraContractAddress } = validation.data;

  try {
    // Update the project record in Supabase with the Zora contract address
    console.log(`Updating project ${projectId} with Zora address ${zoraContractAddress}...`);
    const { error: updateError } = await supabase
      .from('projects')
      .update({ zora_contract_address: zoraContractAddress })
      .eq('id', projectId)
      .select('id'); // Select minimal data to confirm update

    if (updateError) {
      console.error('🔴 Supabase Update Error:', updateError);
      return NextResponse.json({ error: 'Failed to update project with Zora address.', details: updateError.message }, { status: 500 });
    }

    console.log(`✅ Successfully updated project ${projectId} with Zora address ${zoraContractAddress}`);
    return NextResponse.json({ message: 'Project updated successfully' }, { status: 200 });

  } catch (error: unknown) {
    console.error('🔴 Error updating Zora address in Supabase:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to update project Zora address', details: errorMessage }, { status: 500 });
  }
}
