import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define the expected shape of the request body
const metadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Image URL must be a valid URL').optional().or(z.literal('')), // Optional but must be URL if provided
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = metadataSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const { title, description, imageUrl } = validation.data;

    // Construct the metadata object (conforming to a basic standard)
    const metadata = {
      name: title, // Often 'name' is used in NFT standards
      description: description,
      image: imageUrl || '', // Use 'image' for compatibility
      // Add any other attributes if necessary
      // attributes: [{ trait_type: 'Creator', value: 'WalletAddress' }], // Example attribute
    };

    // --- TODO: Replace with actual IPFS Upload --- 
    // 1. Install Pinata SDK: npm install @pinata/sdk
    // 2. Configure Pinata client with API Key/Secret (use environment variables)
    // 3. Use pinata.pinJSONToIPFS(metadata)
    // 4. Get the IpfsHash (CID) from the response

    // For now, simulate a successful upload and return a mock IPFS URI
    const mockIpfsHash = 'QmXXExampleHash...........'; // Replace with actual hash later
    const metadataUri = `ipfs://${mockIpfsHash}`;
    // --- End of TODO ---

    console.log('Generated Metadata:', metadata);
    console.log('Simulated Metadata URI:', metadataUri);

    return NextResponse.json({ metadataUri }, { status: 200 });

  } catch (error) {
    console.error('Metadata Upload Error:', error);
    if (error instanceof z.ZodError) {
      // Should be caught by safeParse, but as a fallback
      return NextResponse.json({ error: 'Invalid input format.', details: error.flatten() }, { status: 400 });
    }
    // Handle JSON parsing errors specifically
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
       return NextResponse.json({ error: 'Invalid JSON format in request body.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
