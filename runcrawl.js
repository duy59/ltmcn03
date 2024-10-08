import crawlList from './scripts/crawlList.js';
import crawlDetail from './scripts/crawlDetail.js';
import fs from 'fs';

async function main() {
    const listCat = [
        'https://vneconomy.vn/chinh-sach-bat-dong-san.htm',
    ];

    const allData = [];

    for (const cat of listCat) {
        const urls = await crawlList(cat);
        for (const url of urls) {
            const data = await crawlDetail(url);
            allData.push(data);
        }
    }

    fs.writeFileSync('crawledData.json', JSON.stringify(allData, null, 2), 'utf-8');
}

main().then(() => {
    console.log('Done');
    process.exit(0);
}).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});