import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('call_to_actions')
      .select('*')
      .eq('is_enabled', true)
      .order('sort_order');
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/:action_key', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('call_to_actions')
      .select('*')
      .eq('action_key', req.params.action_key)
      .eq('is_enabled', true)
      .single();
    if (error) return res.status(404).json({ error: 'CTA not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
