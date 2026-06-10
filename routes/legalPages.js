import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('slug, title, version, effective_date')
      .eq('is_published', true)
      .order('slug');
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('is_published', true)
      .single();
    if (error) return res.status(404).json({ error: 'Page not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
