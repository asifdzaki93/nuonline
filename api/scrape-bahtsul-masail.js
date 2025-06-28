const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://www.nu.or.id/bahtsul-masail');
    const html = await response.text();
    const $ = cheerio.load(html);
    const berita = [];

    // Selector baru berdasarkan struktur HTML yang dikirim user
    // Setiap berita ada di div.border-gray2.flex.w-full.border-b-2
    $('div.border-gray2.flex.w-full.border-b-2').each((i, el) => {
      const link = $(el).find('a[href^="https://islam.nu.or.id/bahtsul-masail/"]').first().attr('href');
      const title = $(el).find('h2, h1').first().text().trim();
      const summary = $(el).find('p.medium.font-inter.mt-2.text-sm').first().text().trim();
      const date = $(el).find('p.medium.font-inter.mt-2.text-xs').first().text().trim();
      const img = $(el).find('img').first().attr('src');
      if (link && title) {
        berita.push({
          title,
          link,
          summary,
          date,
          img
        });
      }
    });

    res.status(200).json({
      status: 'success',
      count: berita.length,
      data: berita
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; 