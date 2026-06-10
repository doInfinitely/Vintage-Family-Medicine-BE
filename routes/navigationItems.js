import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

// GET /api/navigation
// GET /api/navigation?placement=header
// GET /api/navigation?placement=footer
router.get('/', async (req, res, next) => {
  try {
    const { placement } = req.query;
    let query = supabase
      .from('navigation_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order');
    if (placement) query = query.eq('placement', placement);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
