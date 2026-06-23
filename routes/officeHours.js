import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { data: location, error: locErr } = await supabase
      .from('locations')
      .select('id')
      .eq('is_primary', true)
      .single();
    if (locErr) {
      if (locErr.code === 'PGRST116') return res.status(404).json({ error: 'No primary location found' });
      throw new Error(locErr.message);
    }

    const { data, error } = await supabase
      .from('office_hours')
      .select('*')
      .eq('location_id', location.id)
      .order('sort_order');
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
