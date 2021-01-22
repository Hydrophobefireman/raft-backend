# Backend

For scaling the backend, the first thing we would do is cache, cache as much data as possible for quick retrieval, in case of exploding traffic, caching is ideal. We could use techniques like filesystem caching and then upgrade to a more robust solution such as redis

Since the connection finding algorithm recurses through each connection's list, O(n^2), caching, rate limiting this route should be a good option.

This backend could have been a serverless function too due to its stateless property, but keeping in mind future use cases, this has been hosted on Heroku.

