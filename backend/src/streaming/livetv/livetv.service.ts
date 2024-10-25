import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import axios from "axios";
import { appConfig } from "src/app.config";
import * as cheerio from "cheerio";

export class LiveTVService {
    private readonly baseUrl: string = appConfig().LIVETV_URL; 
    private readonly logger = new Logger(LiveTVService.name);

    constructor() {
        // Initialization code here
    }

    async getAvailableMatches(): Promise<any[]> {
        this.logger.log(`Fetching live matches from ${this.baseUrl}`);
        
        try {
            // Make a request to the webpage
            const { data } = await axios.get(this.baseUrl);
        
            // Load the page content into cheerio for parsing
            const $ = cheerio.load(data);
        
            const liveMatches = [];
        
            // Select each match row (the table row starts with <tr>)
            $('tr').each((index, element) => {
                const matchTime = $(element).find('td.et3').text().trim();
                const matchDescription = $(element).find('td.et4').text().trim();
                let matchLink = $(element).find('td.et5 a').attr('href');
        
                // Remove the base URL if the matchLink starts with the base URL
                if (matchLink && matchLink.startsWith(this.baseUrl)) {
                    matchLink = matchLink.replace(this.baseUrl, ''); // Remove the base URL
                }
        
                // Only add valid matches to the array (some rows might not have valid data)
                if (matchTime && matchDescription && matchLink) {
                    liveMatches.push({
                        time: matchTime,
                        description: matchDescription,
                        link: matchLink, // Link now only contains the relative path
                    });
                }
            });
        
            return liveMatches;
            } catch (error) {
                // Handle errors and provide a detailed error message
                throw new HttpException(
                    `Failed to fetch live matches: ${error.message}`,
                    HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getMatchStream(matchLink: string): Promise<{ links: string[] }> {
        this.logger.log(`Fetching stream links for event: ${matchLink}`);

        const fullUrl = `${this.baseUrl}/${matchLink}`; // Append base URL for event page

        try {
            // Fetch the HTML content of the event page
            const { data: html } = await axios.get(fullUrl);
    
            // Load the HTML into cheerio for parsing
            const $ = cheerio.load(html);
            this.logger.debug(`Fetched event page: ${fullUrl}`);
            // this.logger.debug(`HTML content: ${html}`);
    
            // Collect all video URLs in an array
            const links: string[] = [];
    
            // Step 1: Extract video URLs from iframe tags
            $('iframe').each((index, element) => {
                let src = $(element).attr('src');
                const id = $(element).attr('id');
                if (src && id === 'myvideo') {
                    // Ensure the src has a protocol, prepend "https:" if missing
                    if (src.startsWith("//")) {
                        src = `https:${src}`;
                    }
                    links.push(src);
                }
            });
    
            // Step 2: Extract video URLs from 'a' tags that point to video files
            const videoFileExtensions = ['.mp4', '.mkv', '.avi', '.mov']; // Common video extensions
            $('a').each((index, element) => {
                const href = $(element).attr('href');
                if (href && videoFileExtensions.some(ext => href.endsWith(ext))) {
                    links.push(href);
                }
            });
    
            if (links.length > 0) {
                return { links };
            } else {
                throw new Error('No video links found on the event page');
            }
        } catch (error) {
            console.error('Error fetching video links:', error);
            throw new Error('Failed to fetch video links');
        }
    }
}