const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://www.nu.or.id/bahtsul-masail');
    const html = await response.text();
    const $ = cheerio.load(html);
    const berita = [];

    $('.BahtsulMasailListItem, .bahtsul-masail-list-item, .bahtsul-masail-list .item, .bahtsul-masail-list li').each((i, el) => {
      const title = $(el).find('a').first().text().trim();
      const link = $(el).find('a').first().attr('href');
      const summary = $(el).find('p').text().trim();
      if (title && link) {
        berita.push({
          title,
          link: link.startsWith('http') ? link : `https://www.nu.or.id${link}`,
          summary
        });
      }
    });

    if (berita.length === 0) {
      $('.headline-list li').each((i, el) => {
        const title = $(el).find('a').first().text().trim();
        const link = $(el).find('a').first().attr('href');
        if (title && link) {
          berita.push({
            title,
            link: link.startsWith('http') ? link : `https://www.nu.or.id${link}`
          });
        }
      });
    }

    res.status(200).json({
      status: 'success',
      count: berita.length,
      data: berita
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; 