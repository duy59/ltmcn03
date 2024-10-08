import * as cheerio from 'cheerio';

const processListHtml = async (domain, html, pageNext = 0) => { 
    const $ = cheerio.load(html);
    let urls = [];
    let nextPages = [];

    if (domain == 'vneconomy.vn') {
        $('article.story--featured.story--timeline').each((index, element) => {
            const url = $(element).find('h3.story__title a').attr('href');
            urls.push(`https://vneconomy.vn${url}`);
        });
        if (pageNext == 1) {
            $('li.page-item').each((index, element) => {
                const link = $(element).find('a');
                if (link.text() != '1') {
                    const url = $(element).find('a').attr('href');
                    nextPages.push(`https://vneconomy.vn${url}`);
                }
            });
        }
    } else if (domain == 'cafef.vn') {
        if (pageNext == 1) {
            $('.box-category-item').each((index, element) => {
                const url = $(element).find('h3 a').attr('href');
                urls.push(`https://cafef.vn${url}`);
            });
        } else {
            $('div.listchungkhoannew .box-category-item').each((index, element) => {
                const url = $(element).find('h3 a').attr('href');
                urls.push(`https://cafef.vn${url}`);
            });
            const id = $('#hdZoneId').val();
            for (let i = 2; i <= 5; i++) {
                nextPages.push(`https://cafef.vn/timelinelist/${id}/${i}.chn`);
            }
        }
    } else if (domain == 'vnexpress.net') {
        $('.list-news-subfolder article.item-news.item-news-common.thumb-left').each((index, element) => {
            const url = $(element).find('h3 a').attr('href');
            urls.push(url);
        });
        if (pageNext == 1) {
            const url = $('meta[property="og:url"]').attr('content');
            for (let i = 2; i <= 5; i++) {
                nextPages.push(`${url}-p${i}`);
            }
        }
    } else if (domain == 'vov.vn') {
        $('.row.test .article-card').each((index, element) => {
            const url = $(element).find('a.vovvn-title').attr('href');
            urls.push(`https://vov.vn${url}`);
        });
        if (pageNext == 1) {
            const url = $('link[rel=canonical]').attr('href');
            for (let i = 2; i <= 5; i++) {
                nextPages.push(`${url}?page=${i}`);
            }
        }
    }

    return { urls, nextPages };
}

export default processListHtml;