import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/active', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_visible', true)
      .lte('start_date', today)
      .or(`end_date.is.null,end_date.gte.${today}`);
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
