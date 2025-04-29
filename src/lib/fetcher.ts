export async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'api-key': process.env.NEXT_PUBLIC_API_TOKEN || '',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  console.log(response, new Date());
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
