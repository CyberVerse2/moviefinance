/**
 * Utility functions for interacting with IPFS via Pinata.
 */

/**
 * Uploads a JSON object to IPFS using the Pinata API.
 *
 * @param jsonData - The JSON object to upload.
 * @param pinataMetadata - Optional metadata for Pinata (e.g., { name: 'My Coin Metadata' }).
 * @returns The full IPFS URI (ipfs://CID).
 * @throws If Pinata API keys are missing or the upload fails.
 */
export async function uploadJsonToPinata(jsonData: object, pinataMetadata?: object): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const secretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

    if (!apiKey || !secretApiKey) {
        throw new Error('Pinata API Key or Secret API Key is missing from environment variables.');
    }

    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    const body = JSON.stringify({
        pinataContent: jsonData,
        ...(pinataMetadata && { pinataMetadata }), // Add metadata if provided
        // pinataOptions: { cidVersion: 1 } // Optional: Use CID v1
    });

    console.log('Attempting to pin JSON to Pinata...');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': apiKey,
                'pinata_secret_api_key': secretApiKey,
            },
            body: body,
        });

        if (!response.ok) {
            const errorData = await response.text(); // Get error text
            console.error(`🔴 Pinata API Error: Status ${response.status} ${response.statusText}`);
            console.error('🔴 Error Body:', errorData);
            throw new Error(`Pinata API Error (${response.status} ${response.statusText}): ${errorData}`);
        }

        const result = await response.json();

        if (!result.IpfsHash) {
            throw new Error('Pinata API response did not include IpfsHash.');
        }

        console.log(`Successfully pinned JSON to Pinata: ipfs://${result.IpfsHash}`);
        return `ipfs://${result.IpfsHash}`;

    } catch (error) {
        console.error("Error pinning JSON to Pinata:", error);
        throw error; // Re-throw the error after logging
    }
}

// --- Upload File (e.g., Image) to Pinata --- //

const pinFileToIPFSUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export async function uploadFileToPinata(file: File): Promise<string> {
  const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!pinataJWT) {
    console.error("🔴 Pinata JWT not found in environment variables!");
    throw new Error("Pinata API key is not configured.");
  }

  console.log(`Attempting to pin file '${file.name}' to Pinata...`);

  const formData = new FormData();
  formData.append('file', file);

  // Optional: Add pinataMetadata and pinataOptions if needed
  // const metadata = JSON.stringify({
  //   name: `Project Image ${file.name}`,
  //   // keyvalues: { exampleKey: 'exampleValue' }
  // });
  // formData.append('pinataMetadata', metadata);
  // const options = JSON.stringify({
  //   cidVersion: 1,
  // });
  // formData.append('pinataOptions', options);

  try {
    const response = await fetch(pinFileToIPFSUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJWT}`
        // 'Content-Type': 'multipart/form-data' // Fetch API sets this automatically for FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`🔴 Pinata File API Error: Status ${response.status} ${response.statusText}`);
      console.error('🔴 Error Body:', errorBody);
      throw new Error(`File upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.IpfsHash) {
        console.error('🔴 Pinata file upload response missing IpfsHash:', result);
        throw new Error('Pinata file upload succeeded but did not return an IPFS hash.');
    }

    console.log(`Successfully pinned file '${file.name}' to Pinata: ipfs://${result.IpfsHash}`);
    return `ipfs://${result.IpfsHash}`;

  } catch (error) {
    console.error(`Error pinning file '${file.name}' to Pinata:`, error);
    throw error; // Re-throw the error after logging
  }
}
