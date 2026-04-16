{
  "rewrites": [
    { "source": "/api/book", "destination": "/api/book" },
    { "source": "/api/bookings", "destination": "/api/bookings" },
    { "source": "/app", "destination": "/public/app.html" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PATCH, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
