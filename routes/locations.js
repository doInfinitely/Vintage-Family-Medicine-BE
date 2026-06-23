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
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'No primary location found' });
      throw new Error(error.message);
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
