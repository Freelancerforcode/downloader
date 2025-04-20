const ytdl = require('ytdl-core');

module.exports = async function (context, req) {
    // ===== 1. CORS Configuration =====
    // Set headers for ALL responses (including errors)
    const corsHeaders = {
        "Access-Control-Allow-Origin": "https://zealous-wave-01f46a310.6.azurestaticapps.net",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle OPTIONS (preflight) requests immediately
    if (req.method === "OPTIONS") {
        context.res = {
            status: 204,
            headers: corsHeaders
        };
        return;
    }

    // ===== 2. Main Request Handling =====
    try {
        // Validate request method
        if (req.method !== "POST") {
            context.res = {
                status: 405,
                body: { error: "Method not allowed" },
                headers: corsHeaders
            };
            return;
        }

        // Validate request body
        if (!req.body || !req.body.url) {
            context.res = {
                status: 400,
                body: { error: "Missing URL in request body" },
                headers: corsHeaders
            };
            return;
        }

        const url = req.body.url;

        // Validate YouTube URL
        if (!ytdl.validateURL(url)) {
            context.res = {
                status: 400,
                body: { error: "Invalid YouTube URL" },
                headers: corsHeaders
            };
            return;
        }

        // Fetch video info
        const info = await ytdl.getInfo(url);
        
        // Format response
        const formats = info.formats
            .filter(format => format.hasVideo || format.hasAudio)
            .map(format => ({
                quality: format.qualityLabel || 'Audio',
                type: format.container,
                size: format.contentLength ? `${Math.round(format.contentLength / (1024 * 1024))}MB` : 'N/A',
                url: format.url
            }));

        // Successful response
        context.res = {
            status: 200,
            body: {
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[0].url,
                duration: info.videoDetails.lengthSeconds,
                formats
            },
            headers: corsHeaders
        };

    } catch (error) {
        console.error("Error:", error);
        context.res = {
            status: 500,
            body: { error: "Internal server error" },
            headers: corsHeaders
        };
    }
};
