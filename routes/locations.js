import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/primary', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_primary', true)
      .single();
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
