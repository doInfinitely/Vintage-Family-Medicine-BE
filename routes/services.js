import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*, service_conditions(*)')
      .eq('is_visible', true)
      .order('sort_order');
    if (error) throw new Error(error.message);
    data?.forEach(service => {
      if (service.service_conditions) {
        service.service_conditions = service.service_conditions
          .filter(c => c.is_visible)
          .sort((a, b) => a.sort_order - b.sort_order);
      }
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*, service_conditions(*)')
      .eq('slug', req.params.slug)
      .eq('is_visible', true)
      .single();
    if (error) return res.status(404).json({ error: 'Service not found' });
    if (data.service_conditions) {
      data.service_conditions = data.service_conditions
        .filter(c => c.is_visible)
        .sort((a, b) => a.sort_order - b.sort_order);
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
