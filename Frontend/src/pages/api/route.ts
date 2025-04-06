export async function POST(req: Request): Promise<Response> {
    try {
      const formData = await req.formData();
      const file = formData.get('resume') as File | null;
  
      if (!file) {
        return new Response(JSON.stringify({ error: 'Resume file not found' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      // Construct a new FormData to send to Flask backend
      const uploadForm = new FormData();
      const blob = new Blob([buffer], { type: file.type });
      uploadForm.append('resume', blob, file.name);
  
      const response = await fetch('http://127.0.0.1:5000/match', {
        method: 'POST',
        body: uploadForm,
      });
  
      const data = await response.json();
  
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (err) {
      console.error('API error:', err);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  