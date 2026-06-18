import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'houses');

async function fetchImageFromUrl(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.idealista.com/',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Try to find the first image in various ways
    let imageUrl = null;

    // Check meta og:image (most reliable)
    imageUrl = $('meta[property="og:image"]').attr('content');
    if (!imageUrl) {
      imageUrl = $('meta[name="twitter:image"]').attr('content');
    }

    // Check for main image in common real estate site structures
    if (!imageUrl) {
      imageUrl = $('.main-photo img').attr('src');
    }
    if (!imageUrl) {
      imageUrl = $('.property-image img').attr('src');
    }
    if (!imageUrl) {
      imageUrl = $('img[alt*="property"], img[alt*="house"], img[alt*="apartment"]').first().attr('src');
    }

    // Fallback to first img tag
    if (!imageUrl) {
      imageUrl = $('img').first().attr('src');
    }

    if (!imageUrl) {
      throw new Error('No images found on the page');
    }

    // Handle relative URLs
    if (imageUrl.startsWith('/')) {
      const urlObj = new URL(url);
      imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
    } else if (imageUrl.startsWith('..')) {
      const urlObj = new URL(url);
      imageUrl = new URL(imageUrl, url).href;
    } else if (!imageUrl.startsWith('http')) {
      imageUrl = new URL(imageUrl, url).href;
    }

    // Download the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': url,
      },
      timeout: 10000,
    });

    // Determine file extension
    const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
    const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';

    // Save the image
    fs.mkdirSync(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-fetched.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, imageResponse.data);

    return `/uploads/houses/${fileName}`;
  } catch (error) {
    console.error('Image fetch error:', error.message);
    throw new Error(`Failed to fetch image: ${error.message}`);
  }
}

export { fetchImageFromUrl };
