import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { appConfig } from 'src/app.config';
import { Logger } from '@nestjs/common';

@Injectable()
export class NflService {
    private readonly baseUrl: string = appConfig().NFL_URL; // Use the configured base URL
    private readonly logger = new Logger(NflService.name);

    async getAvailableEvents(): Promise<{ events: Array<{ title: string, url: string, category: string, description: string }> }> {
        this.logger.log('Fetching available events');
        const pageNumbers = [1, 2, 3];  // Pages to fetch
        const events = [];

        // Fetch events from each page
        for (const page of pageNumbers) {
            const pageEvents = await this.scrapeEventsFromPage(page);
            events.push(...pageEvents);
        }

        return { events };
    }

    private async scrapeEventsFromPage(page: number): Promise<Array<{ title: string, url: string, category: string, description: string }>> {
        const url = page === 1 ? this.baseUrl : `${this.baseUrl}/?page${page}`;

        try {
            const { data: html } = await axios.get(url);
            this.logger.debug(`Fetched events page: ${url}`);
            const $ = cheerio.load(html);

            const events = [];

            $('.short_content').each((_, element) => {
                const titleElement = $(element).find('h3 a');
                const title = titleElement.text().trim();
                const eventUrl = titleElement.attr('href');

                const category = $(element).find('.short_cat a').text().trim();
                const description = $(element).find('.short_descr p').text().trim();

                if (title && eventUrl) {
                    events.push({ title, url: eventUrl, category, description });
                }
            });

            return events;
        } catch (error) {
            console.error(`Error fetching events from page ${page}:`, error);
            return [];
        }
    }

    async getVideoLinks(eventUrl: string): Promise<{ videoUrls: string[] }> {
        this.logger.log(`Fetching video links for event: ${eventUrl}`);
        const fullUrl = `${this.baseUrl}/${eventUrl}`; // Append base URL for event page
    
        try {
            // Fetch the HTML content of the event page
            const { data: html } = await axios.get(fullUrl);
    
            // Load the HTML into cheerio for parsing
            const $ = cheerio.load(html);
            this.logger.debug(`Fetched event page: ${fullUrl}`);
            // this.logger.debug(`HTML content: ${html}`);
    
            // Collect all video URLs in an array
            const videoUrls: string[] = [];
    
            // Example 1: Look for video in all iframes
            $('iframe').each((index, element) => {
                const src = $(element).attr('src');
                if (src) {
                    videoUrls.push(src);
                }
            });
    
            // Example 2: Look for video links in all <a> tags with class 'video-link'
            $('a.video-link').each((index, element) => {
                const href = $(element).attr('href');
                if (href) {
                    videoUrls.push(href);
                }
            });
    
            if (videoUrls.length > 0) {
                return { videoUrls };
            } else {
                throw new Error('No video links found on the event page');
            }
        } catch (error) {
            console.error('Error fetching video links:', error);
            throw new Error('Failed to fetch video links');
        }
    }    
}
