import * as cheerio from 'cheerio';
import { slugify } from '../utils/helper.js';

const processDetailHtml = async (domain, html) => {
    const $ = cheerio.load(html);
    const description = $('meta[name="description"]').attr('content');
    let title = '';
    let rawContent = '';
    let category = {};
    let author = '';

    if (domain == 'vneconomy.vn') {
        title = $('h1.detail__title').text();
        rawContent = $('.detail__content').html();
        const cat = $('h1.category-main').text();
        category = {
            name: cat,
            slug: slugify(cat)
        };
        author = $('.detail__author').text();
    } else if (domain == 'cafef.vn') {
        title = $('h1.title').text();
        rawContent = $('.w640', 0).html();
        const cat = $('a.category-page__name.cat').text();
        category = {
            name: cat,
            slug: slugify(cat)
        };
        author = $('p.author').text();
        if (author == '') {
            author = $('.sevenPostAuthor').text();
        }
        author = author.replace('Theo ', '');
    } else if (domain == 'vnexpress.net') {
        title = $('h1.title-detail').text();
        const tmpContent = $('p.description').text();
        rawContent = $('.fck_detail', 0).html();
        rawContent = tmpContent + "<br>" + rawContent;
        const cat = $('ul.breadcrumb a').first().attr('title');
        category = {
            name: cat,
            slug: slugify(cat)
        };
        author = $('.box-tinlienquanv2').next().find('strong').text();
    } else if (domain == 'vov.vn') {
        title = $('h1.article-title').text();
        rawContent = $('.article-content .text-long').html();
        const cat = $('.breadcrumb-item a').last().text();
        category = {
            name: cat,
            slug: slugify(cat)
        };
        author = $('.article-author').find('a').text();
    }

    return {
        title,
        rawContent,
        description,
        category,
        author
    };
}

export default processDetailHtml;