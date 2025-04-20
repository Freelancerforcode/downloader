const ytdl = require('ytdl-core');

module.exports = async function (context, req) {
    try {
        // 1. Get URL from request
        const url = req.body.url;
        
        // 2. Validate URL
        if (!ytdl.validateURL(url)) {
            context.res = {
                status: 400,
                body: { error: "Invalid YouTube URL" }
            };
            return;
        }

        // 3. Fetch video info
        const info = await ytdl.getInfo(url);
        
        // 4. Format response
        const formats = info.formats
            .filter(format => format.hasVideo || format.hasAudio)
            .map(format => ({
                quality: format.qualityLabel || 'Audio',
                type: format.container,
                size: format.contentLength ? `${Math.round(format.contentLength / (1024 * 1024))}MB` : 'N/A',
                url: format.url
            }));

        // 5. Send response
        context.res = {
            status: 200,
            body: {
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[0].url,
                duration: info.videoDetails.lengthSeconds,
                formats
            }
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: { error: "Failed to process video" }
        };
    }
};
