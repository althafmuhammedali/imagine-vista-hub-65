import { generateImage } from '@/lib/api/imageGeneration';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, negativePrompt, numImages } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await generateImage({ prompt, negativePrompt, numImages });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}