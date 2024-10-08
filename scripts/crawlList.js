import { crawlPost } from "../utils/crawl.js";
import * as cheerio from 'cheerio';
import processListHtml from "./processListHtml.js";

const maxPage = 5;
let urls = [];
const links = [];

async function crawlList(url) {
    const urlSource = new URL(url);
    const hostname = urlSource.hostname;
    const rawlHtml = await crawlPost(url);
    
    if (hostname == 'cafeland.vn') {
        const $ = cheerio.load(rawlHtml);
        const list = $('.list-type-14');
        list.find('h3 a').each((index, element) => {
            urls.push($(element).attr('href'));
        });
        const pagi = $('.nav-paging');
        pagi.find('a[title="Trang cuối"]').each((index, element) => {
            for (let i = 2; i <= maxPage; i++) {
                links.push(`${url}page-${i}`);
            }
        });
        for (const link of links) {
            const rawlHtmlPagi = await crawlPost(link);
            const $ = cheerio.load(rawlHtmlPagi);
            const listPagi = $('.list-type-14');
            listPagi.find('h3 a').each((index, element) => {
                urls.push($(element).attr('href'));
            });
        }
    } else {
        const data = await processListHtml(hostname, rawlHtml, 1);
        urls = urls.concat(data.urls);
        if (data.nextPages.length > 0) {
            for (const link of data.nextPages) {
                const rawlHtmlPagi = await crawlPost(link);
                const pageNext = 1;
                const dataPagi = await processListHtml(hostname, rawlHtmlPagi, pageNext);
                if (dataPagi.urls.length > 0) {
                    urls = urls.concat(dataPagi.urls);
                }
            }
        }
    }
    return urls;
}

export default crawlList;