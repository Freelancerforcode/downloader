const response = await fetch(
  'https://video-downloader-backend-gjf3fwanbjdhenfq.spaincentral-01.azurewebsites.net/api/video-info', 
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  }
);
