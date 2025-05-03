import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Basic schema for expected metadata - adjust if needed
const metadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  // Add other expected metadata fields here if necessary
});

export async function POST(req: NextRequest) {
  // 1. Get API Keys from environment
  const apiKey = process.env.PINATA_API_KEY;
  const secretApiKey = process.env.PINATA_SECRET_API_KEY;

  if (!apiKey || !secretApiKey) {
    console.error('Pinata API Key or Secret API Key is missing from environment variables.');
    return NextResponse.json({ error: 'Server configuration error: Missing Pinata credentials.' }, { status: 500 });
  }

  // 2. Parse and Validate Request Body
  let jsonData;
  try {
    jsonData = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = metadataSchema.safeParse(jsonData);
  if (!validation.success) {
    console.error('Pinata JSON Validation Error:', validation.error.flatten());
    return NextResponse.json({ error: 'Invalid metadata format.', details: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const pinataApiUrl = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  // 3. Make API Call to Pinata
  try {
    const response = await fetch(pinataApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': secretApiKey,
      },
      body: JSON.stringify(jsonData), // Send validated data
    });

    if (!response.ok) {
      const errorData = await response.text(); 
      console.error(`Pinata API Error (${response.status}): ${errorData}`);
      return NextResponse.json({ error: 'Failed to pin JSON to IPFS.', details: `Pinata API Error (${response.status}): ${errorData}` }, { status: response.status }); // Use Pinata's status code if possible
    }

    const result = await response.json();

    if (!result.IpfsHash) {
        console.error('Pinata API response did not include IpfsHash.');
      return NextResponse.json({ error: 'Pinata API response missing IpfsHash.' }, { status: 500 });
    }

    // 4. Return Success Response with IPFS Hash
    console.log(`Successfully pinned JSON to IPFS: ${result.IpfsHash}`);
    return NextResponse.json({ ipfsHash: result.IpfsHash }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error pinning JSON to Pinata:', error);
    let errorMessage = 'Internal Server Error while pinning JSON.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
