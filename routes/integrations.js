import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

// Only expose public config — never widget_id or private keys
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('provider, display_name, base_url, widget_script_url, public_config_json')
      .eq('is_enabled', true);
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
