import { crawlPost } from "../utils/crawl.js";
import * as cheerio from 'cheerio';
import { slugify } from '../utils/helper.js';
import processDetailHtml from './processDetailHtml.js';

let blogPosts = [];

const createBlogPost = async (data) => {
    const { slug } = data;
    const existingBlogPost = blogPosts.find(post => post.slug === slug);
    if (existingBlogPost) {
        return { error: 'Slug already exists' };
    }
    blogPosts.push(data);
    return data;
};

const getSingleBlogPostByCondition = async (condition = {}) => {
    const blogPost = blogPosts.find(post => {
        return Object.keys(condition).every(key => post[key] === condition[key]);
    });
    if (!blogPost) {
        return { status: false, error: 'Blog post not found' };
    }
    return { status: true, blogPost: blogPost };
};

const crawlDetail = async (url, update = 0) => {
    const condition = { urlOrigin: url };
    try {
        const urlSource = new URL(url);
        const hostname = urlSource.hostname;
        if (update == 0) {
            const info = await getSingleBlogPostByCondition(condition);
            if (info.status == true) {
                return info.status;
            }
        }
        const rawlHtml = await crawlPost(url);
        let blog = {};
        if (hostname == 'cafeland.vn') {
            const $ = cheerio.load(rawlHtml);
            const title = $('h1').text();
            const bodyHtml = $('#sevenBoxNewContentInfo');
            bodyHtml.find('script').remove();
            bodyHtml.find('input').remove();
            bodyHtml.find('form').remove();
            bodyHtml.find('style').remove();
            bodyHtml.find('.box-thaoluan').remove();
            const rawContent = bodyHtml.html();
            const description = $('meta[name="description"]').attr('content');
            const category = {
                name: 'Tài chính - Chứng khoán',
                slug: 'tai-chinh'
            };
            const slug = slugify(title);
            let author = $('p.author').text();
            if (author == '') {
                author = $('.sevenPostAuthor').text();
            }
            if (update == 1) {
                return {
                    title: title.trim(),
                    slug: slug,
                    description,
                    content: rawContent,
                    urlOrigin: url,
                    category: category,
                    author: author,
                    type: 'crawl'
                };
            }
            blog = await createBlogPost({
                title: title.trim(),
                slug: slug,
                description,
                content: rawContent,
                urlOrigin: url,
                category: category,
                author: author,
                type: 'crawl'
            });
        } else {
            const data = await processDetailHtml(hostname, rawlHtml);
            const slugifiedTitle = slugify(data.title);
            if (update == 1) {
                return {
                    title: data.title.trim(),
                    slug: slugifiedTitle,
                    description: data.description,
                    content: data.rawContent,
                    urlOrigin: url,
                    category: data.category,
                    author: data.author,
                    type: 'crawl'
                };
            }
            blog = await createBlogPost({
                title: data.title.trim(),
                slug: slugifiedTitle,
                description: data.description,
                content: data.rawContent,
                urlOrigin: url,
                category: data.category,
                author: data.author,
                type: 'crawl'
            });
        }
        return blog;
    } catch (error) {
        return true;
    }
};

export default crawlDetail;