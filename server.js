import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import siteSettingsRouter from './routes/siteSettings.js';
import pagesRouter from './routes/pages.js';
import callToActionsRouter from './routes/callToActions.js';
import integrationsRouter from './routes/integrations.js';
import servicesRouter from './routes/services.js';
import providersRouter from './routes/providers.js';
import locationsRouter from './routes/locations.js';
import officeHoursRouter from './routes/officeHours.js';
import holidayClosuresRouter from './routes/holidayClosures.js';
import faqsRouter from './routes/faqs.js';
import announcementsRouter from './routes/announcements.js';
import legalPagesRouter from './routes/legalPages.js';
import navigationItemsRouter from './routes/navigationItems.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security & logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigin = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/site-settings',  siteSettingsRouter);
app.use('/api/pages',          pagesRouter);
app.use('/api/ctas',           callToActionsRouter);
app.use('/api/integrations',   integrationsRouter);
app.use('/api/services',       servicesRouter);
app.use('/api/providers',      providersRouter);
app.use('/api/locations',      locationsRouter);
app.use('/api/office-hours',   officeHoursRouter);
app.use('/api/holidays',       holidayClosuresRouter);
app.use('/api/faqs',           faqsRouter);
app.use('/api/announcements',  announcementsRouter);
app.use('/api/legal',          legalPagesRouter);
app.use('/api/navigation',     navigationItemsRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
