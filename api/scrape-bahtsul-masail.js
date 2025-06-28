const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://www.nu.or.id/bahtsul-masail');
    const html = await response.text();
    const $ = cheerio.load(html);
    const berita = [];

    // Ambil berita utama (card besar di atas)
    const utamaParent = $('div.aspect-video').first().parent();
    if (utamaParent.length) {
      const link = utamaParent.find('a').attr('href');
      const title = utamaParent.find('h1').text().trim();
      const img = utamaParent.find('img').attr('src');
      const summary = utamaParent.find('p.medium.font-inter.mt-2.text-sm').text().trim();
      const date = utamaParent.find('p.medium.font-inter.mt-2.text-xs').text().trim();
      if (title && link) {
        berita.push({
          title,
          link,
          summary,
          date,
          img
        });
      }
    }

    // Ambil daftar berita lain (card horizontal)
    $('div.border-gray2.flex.w-full').each((i, el) => {
      const $el = $(el);
      const link = $el.find('a[href^="https://islam.nu.or.id/bahtsul-masail/"]').first().attr('href');
      const title = $el.find('h2').first().text().trim();
      const img = $el.find('img').first().attr('src');
      const date = $el.find('p.medium.font-inter.mt-2.text-xs').first().text().trim();
      if (title && link) {
        berita.push({
          title,
          link,
          img,
          date
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