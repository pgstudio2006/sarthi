import { Router } from 'express';

const router = Router();

router.get('/search', async (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (query.length < 3) {
    res.json({ locations: [] });
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&namedetails=1&limit=12&countrycodes=in&q=${encodeURIComponent(query)}`, 
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'SaarathiCare/1.0 location-search',
        },
      },
    );
    if (!response.ok) {
      res.status(502).json({ error: 'Location search is temporarily unavailable' });
      return;
    }

    const results = (await response.json()) as Array<{
      display_name?: string;
      lat?: string;
      lon?: string;
      address?: Record<string, string>;
    }>;
    const locations = results
      .map((item) => {
        const address = item.address || {};
        const city = address.city || address.town || address.village || address.municipality || address.county || address.state_district;
        const state = address.state;
        const district = address.state_district || address.district;
        const label = [city, district && district !== city ? district : '', state].filter(Boolean).join(', ') || item.display_name || '';
        return { label, city: city || '', state: state || '', latitude: item.lat || '', longitude: item.lon || '' };
      })
      .filter((item, index, all) => item.label && all.findIndex((candidate) => candidate.label === item.label) === index);

    res.json({ locations });
  } catch {
    res.status(502).json({ error: 'Location search is temporarily unavailable' });
  }
});

export default router;
