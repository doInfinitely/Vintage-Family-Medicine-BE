import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('slug, title, meta_title, meta_description, sort_order')
      .eq('is_published', true)
      .order('sort_order');
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*, page_sections(*)')
      .eq('slug', req.params.slug)
      .eq('is_published', true)
      .single();
    if (error) return res.status(404).json({ error: 'Page not found' });
    if (data.page_sections) {
      data.page_sections = data.page_sections
        .filter(s => s.is_visible)
        .sort((a, b) => a.sort_order - b.sort_order);
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
