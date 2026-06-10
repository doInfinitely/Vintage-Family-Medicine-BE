import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order');
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
