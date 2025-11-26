const GRAPHQL_ENDPOINT = 'https://delia-unsigneted-marcela.ngrok-free.dev/graphql';

type TokenProvider = () => Promise<string | null>;
type UnauthorizedHandler = (query: string, variables?: any) => Promise<any>;

class GraphQLClient {
    private getToken: TokenProvider | null = null;
    private handleUnauthorized: UnauthorizedHandler | null = null;

    configure(getToken: TokenProvider, handleUnauthorized: UnauthorizedHandler) {
        this.getToken = getToken;
        this.handleUnauthorized = handleUnauthorized;
    }

    async request(query: string, variables?: any, skipAuth = false, customHeaders?: Record<string, string>): Promise<any> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...customHeaders,
            };

            // Add authorization header if not skipped and no custom Authorization header provided
            if (!skipAuth && this.getToken && !headers['Authorization']) {
                const token = await this.getToken();
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            let response: Response;

            try {
                response = await fetch(GRAPHQL_ENDPOINT, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ query, variables }),
                });
            } catch (networkError) {
                // Handle network failures (server down, no internet, etc.)
                throw new Error('Network error: Unable to reach the server. Please check your connection and try again.');
            }

            // Check HTTP status code
            if (!response.ok) {
                const statusText = response.statusText || 'Unknown error';
                throw new Error(`Server error (${response.status}): ${statusText}`);
            }

            // Check content type to ensure we're getting JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Server returned non-JSON (likely HTML error page)
                const textPreview = await response.text();
                const preview = textPreview.substring(0, 200);
                throw new Error(`Server returned non-JSON response. Content-Type: ${contentType || 'unknown'}. Preview: ${preview}...`);
            }

            // Parse JSON with error handling
            let json: any;
            try {
                const responseText = await response.text();
                json = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error('Failed to parse server response as JSON. The server may be experiencing issues.');
            }

            // Handle GraphQL errors
            if (json.errors) {
                const error = json.errors[0];

                // Handle unauthorized error
                if (error.extensions?.code === 'UNAUTHORIZED' && !skipAuth && this.handleUnauthorized) {
                    return await this.handleUnauthorized(query, variables);
                }

                throw new Error(error.message || 'GraphQL Error');
            }

            return json.data;
        } catch (error) {
            // Re-throw errors with context
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred while making the request');
        }
    }
}

export const graphQLClient = new GraphQLClient();
