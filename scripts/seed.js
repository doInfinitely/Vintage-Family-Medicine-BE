import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── helpers ───────────────────────────────────────────────────────────────

async function clear(table) {
  const { error } = await supabase.from(table).delete().not('id', 'is', null);
  if (error) throw new Error(`clear ${table}: ${error.message}`);
}

async function insert(table, rows) {
  const { data, error } = await supabase.from(table).insert(rows).select();
  if (error) throw new Error(`insert ${table}: ${error.message}`);
  return data;
}

// ─── clear (reverse FK order) ──────────────────────────────────────────────

async function clearAll() {
  const tables = [
    'content_revisions',
    'media_assets',
    'legal_pages',
    'announcements',
    'faqs',
    'holiday_closures',
    'office_hours',
    'service_conditions',
    'services',
    'locations',
    'providers',
    'integrations',
    'call_to_actions',
    'navigation_items',
    'page_sections',
    'pages',
    'site_settings',
  ];
  for (const t of tables) {
    await clear(t);
    console.log(`  cleared  ${t}`);
  }
}

// ─── seed ──────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\nClearing existing data...');
  await clearAll();

  // ── site_settings ────────────────────────────────────────────────────────
  console.log('\nsite_settings');
  await insert('site_settings', [{
    site_name: 'Vintage Family Medicine and Pediatrics',
    tagline: 'Patient-centric, evidence-based, compassionate care',
    primary_phone: 'TODO: clinic phone number',
    primary_email: 'TODO: clinic email address',
    default_meta_title: 'Vintage Family Medicine and Pediatrics | Lewisville, TX',
    default_meta_description:
      'Patient-centric, evidence-based, compassionate family medicine and pediatrics in Lewisville, TX. Serving the greater Dallas–Fort Worth area.',
    emergency_notice:
      'If this is a medical emergency, call 911 immediately. Do not use this website for urgent or emergency medical concerns.',
    footer_disclaimer: 'If this is a medical emergency, call 911 immediately.',
  }]);

  // ── pages ─────────────────────────────────────────────────────────────────
  console.log('pages');
  await insert('pages', [
    {
      slug: 'home',
      title: 'Home',
      meta_title: 'Vintage Family Medicine and Pediatrics | Lewisville, TX',
      meta_description:
        'Patient-centric, evidence-based, compassionate family medicine and pediatrics in Lewisville, TX.',
      sort_order: 1,
    },
    {
      slug: 'about',
      title: 'About Us',
      meta_title: 'About | Vintage Family Medicine and Pediatrics',
      meta_description:
        'Learn about Dr. Dennis Ochei and the mission of Vintage Family Medicine and Pediatrics.',
      sort_order: 2,
    },
    {
      slug: 'services',
      title: 'Our Services',
      meta_title: 'Services | Vintage Family Medicine and Pediatrics',
      meta_description:
        'Family medicine, pediatrics, chronic disease management, preventive care, and more in Lewisville, TX.',
      sort_order: 3,
    },
    {
      slug: 'direct-primary-care',
      title: 'Patient-Centered Care',
      meta_title: 'Patient-Centered Care | Vintage Family Medicine and Pediatrics',
      meta_description:
        'More time with your physician. Same-day appointments. Personalized, unhurried care.',
      sort_order: 4,
    },
    {
      slug: 'video-visits',
      title: 'Video Visits',
      meta_title: 'Video Visits | Vintage Family Medicine and Pediatrics',
      meta_description:
        'Quality care from the comfort of your home. Schedule a secure video visit today.',
      sort_order: 5,
    },
    {
      slug: 'patient-resources',
      title: 'Patient Resources',
      meta_title: 'Patient Resources | Vintage Family Medicine and Pediatrics',
      meta_description:
        'Access the patient portal, pay your bill, schedule appointments, and more.',
      sort_order: 6,
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      meta_title: 'Contact | Vintage Family Medicine and Pediatrics',
      meta_description:
        'Contact Vintage Family Medicine and Pediatrics at 860 Hebron Parkway, Suite 203, Lewisville, TX 75057.',
      sort_order: 7,
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      meta_title: 'Privacy Policy | Vintage Family Medicine and Pediatrics',
      sort_order: 8,
    },
    {
      slug: 'hipaa-notice',
      title: 'HIPAA Notice of Privacy Practices',
      meta_title: 'HIPAA Notice | Vintage Family Medicine and Pediatrics',
      sort_order: 9,
    },
    {
      slug: 'terms-of-use',
      title: 'Terms of Use',
      meta_title: 'Terms of Use | Vintage Family Medicine and Pediatrics',
      sort_order: 10,
    },
  ]);

  // ── navigation_items ─────────────────────────────────────────────────────
  console.log('navigation_items');
  await insert('navigation_items', [
    { label: 'Home',                 href: '/',                      placement: 'header', sort_order: 1 },
    { label: 'About',                href: '/about',                 placement: 'header', sort_order: 2 },
    { label: 'Services',             href: '/services',              placement: 'header', sort_order: 3 },
    { label: 'Direct Primary Care',  href: '/direct-primary-care',   placement: 'header', sort_order: 4 },
    { label: 'Video Visits',         href: '/video-visits',          placement: 'header', sort_order: 5 },
    { label: 'Patient Resources',    href: '/patient-resources',     placement: 'header', sort_order: 6 },
    { label: 'Contact',              href: '/contact',               placement: 'header', sort_order: 7 },

    { label: 'About',                href: '/about',                 placement: 'footer', sort_order: 1 },
    { label: 'Services',             href: '/services',              placement: 'footer', sort_order: 2 },
    { label: 'Direct Primary Care',  href: '/direct-primary-care',   placement: 'footer', sort_order: 3 },
    { label: 'Video Visits',         href: '/video-visits',          placement: 'footer', sort_order: 4 },
    { label: 'Patient Resources',    href: '/patient-resources',     placement: 'footer', sort_order: 5 },
    { label: 'Contact',              href: '/contact',               placement: 'footer', sort_order: 6 },
    { label: 'Privacy Policy',       href: '/legal/privacy-policy',  placement: 'footer', sort_order: 7 },
    { label: 'HIPAA Notice',         href: '/legal/hipaa-notice',    placement: 'footer', sort_order: 8 },
    { label: 'Terms of Use',         href: '/legal/terms-of-use',    placement: 'footer', sort_order: 9 },
  ]);

  // ── call_to_actions ───────────────────────────────────────────────────────
  console.log('call_to_actions');
  await insert('call_to_actions', [
    {
      action_key:   'schedule_appointment',
      label:        'Schedule Appointment',
      description:  'Request a new appointment through Klara',
      provider:     'klara',
      action_type:  'scheduling',
      href:         'TODO: klara scheduling url',
      opens_new_tab: true,
      is_primary:   true,
      sort_order:   1,
    },
    {
      action_key:   'patient_portal',
      label:        'Patient Portal',
      description:  'Access health records, lab results, and portal messages through Athena',
      provider:     'athena',
      action_type:  'portal',
      href:         'TODO: athena patient portal url',
      opens_new_tab: true,
      is_primary:   true,
      sort_order:   2,
    },
    {
      action_key:   'pay_bill',
      label:        'Pay Bill',
      description:  'Pay your bill online through Athena',
      provider:     'athena',
      action_type:  'payment',
      href:         'TODO: athena pay bill url',
      opens_new_tab: true,
      is_primary:   false,
      sort_order:   3,
    },
    {
      action_key:   'existing_patient_schedule',
      label:        'Existing Patient Scheduling',
      description:  'Schedule as an existing patient through Athena',
      provider:     'athena',
      action_type:  'scheduling',
      href:         'TODO: athena existing patient scheduling url',
      opens_new_tab: true,
      is_primary:   false,
      sort_order:   4,
    },
    {
      action_key:   'message_us',
      label:        'Message Us',
      description:  'Send a secure HIPAA-compliant message through Klara',
      provider:     'klara',
      action_type:  'messaging',
      href:         'TODO: klara messaging url',
      opens_new_tab: true,
      is_primary:   true,
      sort_order:   5,
    },
    {
      action_key:   'text_us',
      label:        'Text Us',
      description:  'Send a text message through Klara',
      provider:     'klara',
      action_type:  'messaging',
      href:         'TODO: klara text url',
      opens_new_tab: true,
      is_primary:   false,
      sort_order:   6,
    },
    {
      action_key:   'new_patient_forms',
      label:        'New Patient Forms',
      description:  'Complete new patient intake forms through Klara',
      provider:     'klara',
      action_type:  'form',
      href:         'TODO: klara new patient forms url',
      opens_new_tab: true,
      is_primary:   false,
      sort_order:   7,
    },
    {
      action_key:   'video_visit',
      label:        'Schedule Video Visit',
      description:  'Schedule a video visit through Klara',
      provider:     'klara',
      action_type:  'video_visit',
      href:         'TODO: klara video visit url',
      opens_new_tab: true,
      is_primary:   false,
      sort_order:   8,
    },
    {
      action_key:    'call_us',
      label:         'Call Us',
      description:   'Call the clinic via RingCentral',
      provider:      'ringcentral',
      action_type:   'phone',
      href:          'tel:TODO',
      phone_number:  'TODO: clinic phone number',
      opens_new_tab: false,
      is_primary:    true,
      sort_order:    9,
    },
    {
      action_key:    'fax_us',
      label:         'Fax',
      description:   'Fax the clinic via RingCentral',
      provider:      'ringcentral',
      action_type:   'fax',
      phone_number:  'TODO: clinic fax number',
      opens_new_tab: false,
      is_primary:    false,
      sort_order:    10,
    },
    {
      action_key:   'get_directions',
      label:        'Get Directions',
      description:  'Get directions to the clinic on Google Maps',
      provider:     'google_maps',
      action_type:  'directions',
      href:         'https://www.google.com/maps/dir/?api=1&destination=860+Hebron+Pkwy+Ste+203,+Lewisville,+TX+75057',
      opens_new_tab: true,
      is_primary:   false,
      sort_order:   11,
    },
  ]);

  // ── integrations ─────────────────────────────────────────────────────────
  console.log('integrations');
  await insert('integrations', [
    { provider: 'athena',      display_name: 'Athena Health Patient Portal', base_url: 'TODO: athena base url',  is_enabled: true },
    { provider: 'klara',       display_name: 'Klara Secure Messaging',       base_url: 'TODO: klara base url',   is_enabled: true },
    { provider: 'ringcentral', display_name: 'RingCentral Phone System',                                        is_enabled: true },
    { provider: 'google_maps', display_name: 'Google Maps',                  base_url: 'https://maps.google.com', is_enabled: true },
  ]);

  // ── providers ─────────────────────────────────────────────────────────────
  console.log('providers');
  await insert('providers', [{
    name: 'Dennis Ochei, MD',
    title: 'Medical Director and CEO',
    credentials: 'MD, FRCS (Edinburgh)',
    bio:
      'Dr. Ochei brings experience spanning 3 decades, 4 continents, multiple specialties, and tens of thousands of patients. ' +
      'A 1986 graduate (dean\'s honors list) of University of Nigeria Medical School, he completed internships at NHS Hospitals ' +
      'in England and St. Elizabeth Hospital Medical Center in Youngstown, Ohio. He received surgical training at NHS Hospitals ' +
      'in the UK, earning the diploma of Fellow of the Royal College of Surgeons of Edinburgh. He completed Family Medicine ' +
      'training at SUNY Buffalo, NY, with ABFM certifications. Dr. Ochei has served as Emeritus Clinical Assistant Professor ' +
      'and faculty for Family and Sports Medicine Residency Programs at UTSW/Methodist Health Systems, and as an Attending ' +
      'Physician and Hospitalist at Methodist Hospitals of Dallas, Select Specialty Hospital Dallas, and Vibra Specialty ' +
      'Hospital Dallas. He previously served as Medical Director of Specialty Clinics of Dallas, Excel Family Medicine & ' +
      'Pediatrics, and Palliative Care and Hospice.',
    photo_url: null,
    photo_alt: 'Dr. Dennis Ochei, MD, FRCS (Edinburgh) — Medical Director and CEO',
    specialties: ['Family Medicine', 'Pediatrics', 'Preventive Care', 'Chronic Disease Management'],
    is_visible: true,
    sort_order: 1,
  }]);

  // ── locations ─────────────────────────────────────────────────────────────
  console.log('locations');
  const [location] = await insert('locations', [{
    name:           'Vintage Family Medicine and Pediatrics',
    address_line_1: '860 Hebron Parkway',
    address_line_2: 'Suite 203',
    city:           'Lewisville',
    state:          'TX',
    postal_code:    '75057-5143',
    country:        'US',
    phone:          'TODO: clinic phone number',
    text_number:    'TODO: klara text number',
    fax:            'TODO: clinic fax number',
    email:          'TODO: clinic email address',
    map_url:        'https://www.google.com/maps/place/860+Hebron+Pkwy+Ste+203,+Lewisville,+TX+75057,+USA/@33.0128691,-96.9649967,17z',
    map_embed_url:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.6550374150224!2d-96.96499672374044!3d33.01286907189453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c2f023fcc3f25%3A0x780cffa3041cd0c6!2s860%20Hebron%20Pkwy%20Ste%20203%2C%20Lewisville%2C%20TX%2075057%2C%20USA!5e0!3m2!1sen!2suk!4v1781554566967!5m2!1sen!2suk',
    latitude:       33.0463000,
    longitude:      -96.9942000,
    timezone:       'America/Chicago',
    is_primary:     true,
  }]);

  // ── office_hours ──────────────────────────────────────────────────────────
  console.log('office_hours');
  const weekday = {
    location_id: location.id,
    open_time:   '09:00',
    close_time:  '17:30',
    lunch_start: '12:30',
    lunch_end:   '13:30',
    is_closed:   false,
  };
  await insert('office_hours', [
    { ...weekday, day_of_week: 1, sort_order: 1 }, // Monday
    { ...weekday, day_of_week: 2, sort_order: 2 }, // Tuesday
    { ...weekday, day_of_week: 3, sort_order: 3 }, // Wednesday
    { ...weekday, day_of_week: 4, sort_order: 4 }, // Thursday
    { ...weekday, day_of_week: 5, sort_order: 5 }, // Friday
    { location_id: location.id, day_of_week: 6, is_closed: true, sort_order: 6 }, // Saturday
    { location_id: location.id, day_of_week: 0, is_closed: true, sort_order: 7 }, // Sunday
  ]);

  // ── holiday_closures ──────────────────────────────────────────────────────
  console.log('holiday_closures');
  await insert('holiday_closures', [
    { name: "New Year's Day",           closure_type: 'fixed',       fixed_month: 1,  fixed_day: 1,  sort_order: 1 },
    { name: 'Martin Luther King Jr. Day', closure_type: 'recurrence', recurrence_rule: '3rd Monday of January',           sort_order: 2 },
    { name: 'Memorial Day',             closure_type: 'recurrence', recurrence_rule: 'Last Monday of May',               sort_order: 3 },
    { name: 'Independence Day',         closure_type: 'fixed',       fixed_month: 7,  fixed_day: 4,  sort_order: 4 },
    { name: 'Labor Day',                closure_type: 'recurrence', recurrence_rule: '1st Monday of September',          sort_order: 5 },
    { name: 'Thanksgiving Day',         closure_type: 'recurrence', recurrence_rule: '4th Thursday of November',         sort_order: 6 },
    { name: 'Day after Thanksgiving',   closure_type: 'recurrence', recurrence_rule: 'Day after 4th Thursday of November', sort_order: 7 },
    { name: 'Christmas Day',            closure_type: 'fixed',       fixed_month: 12, fixed_day: 25, sort_order: 8 },
  ]);

  // ── services ──────────────────────────────────────────────────────────────
  console.log('services');
  const services = await insert('services', [
    {
      slug: 'family-medicine',
      name: 'Family Medicine',
      category: 'primary_care',
      short_description: 'Comprehensive care for patients of all ages, from routine checkups to managing complex health conditions.',
      full_description:
        'Our family medicine practice provides comprehensive, continuous care for individuals and families across all ages and stages of life. ' +
        'From annual wellness exams and immunizations to managing acute illnesses and chronic conditions, we are your primary healthcare partner.',
      is_featured: true,
      sort_order: 1,
      meta_title: 'Family Medicine | Vintage Family Medicine and Pediatrics',
      meta_description: 'Comprehensive family medicine care in Lewisville, TX. Same-day and next-day appointments available.',
    },
    {
      slug: 'pediatrics',
      name: 'Pediatrics',
      category: 'primary_care',
      short_description: 'Dedicated care for infants, children, and adolescents — well-child visits, immunizations, and sick care.',
      full_description:
        'We provide compassionate pediatric care from infancy through adolescence. Our services include well-child visits, immunization schedules, ' +
        'growth and development monitoring, sick visits, and guidance for parents on nutrition, sleep, and behavioral health.',
      is_featured: true,
      sort_order: 2,
      meta_title: 'Pediatrics | Vintage Family Medicine and Pediatrics',
      meta_description: 'Caring pediatric services for infants, children, and adolescents in Lewisville, TX.',
    },
    {
      slug: 'acute-care',
      name: 'Acute Care',
      category: 'primary_care',
      short_description: 'Same-day or next-day appointments for sudden illnesses and injuries — skip the urgent care line.',
      full_description:
        'When you or your child gets sick unexpectedly, we offer same-day and next-day appointments for acute conditions. ' +
        'We treat infections, respiratory illness, minor injuries, skin problems, eye and ear conditions, stomach issues, and more.',
      is_featured: true,
      sort_order: 3,
      meta_title: 'Acute Care | Vintage Family Medicine and Pediatrics',
      meta_description: 'Same-day and next-day acute care appointments in Lewisville, TX.',
    },
    {
      slug: 'chronic-disease-management',
      name: 'Chronic Disease Management',
      category: 'ongoing_care',
      short_description: 'Personalized management plans for diabetes, hypertension, asthma, COPD, heart disease, and more.',
      full_description:
        'Managing a chronic condition requires a physician who knows you, has time to think through your care, and coordinates with specialists when needed. ' +
        'We provide thorough, personalized management for a wide range of chronic conditions.',
      is_featured: true,
      sort_order: 4,
      meta_title: 'Chronic Disease Management | Vintage Family Medicine and Pediatrics',
      meta_description: 'Expert management of diabetes, hypertension, asthma, COPD, and more in Lewisville, TX.',
    },
    {
      slug: 'preventive-care',
      name: 'Preventive Care',
      category: 'wellness',
      short_description: 'Annual wellness exams, cancer screenings, immunizations, and proactive health assessments.',
      full_description:
        'Prevention is the cornerstone of good health. We offer annual wellness exams, age-appropriate cancer screenings, immunizations, ' +
        'cardiovascular risk assessments, bone density evaluations, and personalized preventive health plans.',
      is_featured: true,
      sort_order: 5,
      meta_title: 'Preventive Care | Vintage Family Medicine and Pediatrics',
      meta_description: 'Annual wellness exams, cancer screenings, and preventive health services in Lewisville, TX.',
    },
    {
      slug: 'behavior-lifestyle-coaching',
      name: 'Behavior and Lifestyle Coaching',
      category: 'wellness',
      short_description: 'Holistic coaching for weight management, smoking cessation, stress, anxiety, depression, nutrition, and exercise.',
      full_description:
        'We take a whole-person approach to health. Our behavior and lifestyle coaching services help you build sustainable habits around nutrition, exercise, ' +
        'sleep, and mental wellness. We partner with you to address weight management, smoking cessation, stress, anxiety, depression, and more.',
      is_featured: false,
      sort_order: 6,
      meta_title: 'Behavior and Lifestyle Coaching | Vintage Family Medicine and Pediatrics',
      meta_description: 'Weight management, smoking cessation, stress, and lifestyle coaching in Lewisville, TX.',
    },
    {
      slug: 'video-visits',
      name: 'Video Visits',
      category: 'telehealth',
      short_description: 'Secure, HIPAA-compliant video visits with your physician — from anywhere, on your schedule.',
      full_description:
        'Get the care you need without leaving home. Our video visit service connects you with your physician via a secure, HIPAA-compliant video platform. ' +
        'Video visits are available for many types of appointments including follow-ups, medication management, and behavioral health check-ins.',
      is_featured: false,
      sort_order: 7,
      meta_title: 'Video Visits | Vintage Family Medicine and Pediatrics',
      meta_description: 'HIPAA-compliant video visits with your physician in Lewisville, TX.',
    },
  ]);

  // ── service_conditions ────────────────────────────────────────────────────
  console.log('service_conditions');
  const svc = Object.fromEntries(services.map(s => [s.slug, s.id]));
  await insert('service_conditions', [
    // Chronic Disease Management
    { service_id: svc['chronic-disease-management'], name: 'Diabetes',               sort_order: 1 },
    { service_id: svc['chronic-disease-management'], name: 'Hypertension',            sort_order: 2 },
    { service_id: svc['chronic-disease-management'], name: 'Asthma',                  sort_order: 3 },
    { service_id: svc['chronic-disease-management'], name: 'COPD',                    sort_order: 4 },
    { service_id: svc['chronic-disease-management'], name: 'Hypothyroidism',          sort_order: 5 },
    { service_id: svc['chronic-disease-management'], name: 'Obesity',                 sort_order: 6 },
    { service_id: svc['chronic-disease-management'], name: 'Congestive Heart Failure',sort_order: 7 },
    { service_id: svc['chronic-disease-management'], name: 'Seasonal Allergies',      sort_order: 8 },
    // Preventive Care
    { service_id: svc['preventive-care'], name: 'Cholesterol Management',       sort_order: 1 },
    { service_id: svc['preventive-care'], name: 'Bone Mineral Density',         sort_order: 2 },
    { service_id: svc['preventive-care'], name: 'Colon Cancer Risk Reduction',  sort_order: 3 },
    { service_id: svc['preventive-care'], name: 'Breast Cancer Risk Reduction', sort_order: 4 },
    { service_id: svc['preventive-care'], name: 'Prostate Cancer Risk Reduction',sort_order: 5 },
    // Behavior and Lifestyle Coaching
    { service_id: svc['behavior-lifestyle-coaching'], name: 'Weight Management',   sort_order: 1 },
    { service_id: svc['behavior-lifestyle-coaching'], name: 'Smoking Cessation',   sort_order: 2 },
    { service_id: svc['behavior-lifestyle-coaching'], name: 'Nutrition Counseling',sort_order: 3 },
    { service_id: svc['behavior-lifestyle-coaching'], name: 'Exercise Planning',   sort_order: 4 },
    { service_id: svc['behavior-lifestyle-coaching'], name: 'Sleep Health',        sort_order: 5 },
    { service_id: svc['behavior-lifestyle-coaching'], name: 'Stress Management',   sort_order: 6 },
    { service_id: svc['behavior-lifestyle-coaching'], name: 'Anxiety',             sort_order: 7 },
    { service_id: svc['behavior-lifestyle-coaching'], name: 'Depression',          sort_order: 8 },
  ]);

  // ── faqs ──────────────────────────────────────────────────────────────────
  console.log('faqs');
  await insert('faqs', [
    // Appointments
    {
      question: 'Can I get a same-day appointment?',
      answer: 'Yes. We offer same-day and next-day appointments whenever possible. Click Schedule Appointment to request one through Klara, or call our office directly.',
      category: 'Appointments', sort_order: 1,
    },
    {
      question: 'How do I schedule as a new patient?',
      answer: 'New patients can request an appointment through Klara by clicking the Schedule Appointment button. Our staff will confirm your appointment and send any necessary intake forms through Klara.',
      category: 'Appointments', sort_order: 2,
    },
    {
      question: 'How do existing patients schedule appointments?',
      answer: 'Existing patients can schedule through the Athena patient portal or through Klara. Use the Patient Portal button to access Athena, or the Schedule Appointment button for Klara.',
      category: 'Appointments', sort_order: 3,
    },
    // Patient Portal
    {
      question: 'What can I do in the patient portal?',
      answer: 'Through the Athena patient portal you can view your medical records and lab results, pay your bill, send portal messages, and manage your appointments.',
      category: 'Patient Portal', sort_order: 1,
    },
    {
      question: 'How do I sign up for the patient portal?',
      answer: 'Contact our office and we will send you an enrollment invitation for the Athena patient portal. You can also ask at your next visit.',
      category: 'Patient Portal', sort_order: 2,
    },
    // Video Visits
    {
      question: 'What do I need for a video visit?',
      answer: 'A smartphone, tablet, or computer with a camera and microphone. No special software is required. We will send you a secure link through Klara before your appointment.',
      category: 'Video Visits', sort_order: 1,
    },
    {
      question: 'What types of visits can be done by video?',
      answer: 'Many follow-up visits, medication management appointments, behavioral health check-ins, and select acute concerns can be handled by video. If your condition requires an in-person exam, we will let you know when you schedule.',
      category: 'Video Visits', sort_order: 2,
    },
    // Billing
    {
      question: 'How do I pay my bill?',
      answer: 'Click the Pay Bill button to pay online through the Athena patient portal. Payments are processed securely through Athena.',
      category: 'Billing', sort_order: 1,
    },
    {
      question: 'Who do I contact with billing questions?',
      answer: 'Call our office or send a message through Klara with your billing question. Do not include sensitive payment information in a standard email.',
      category: 'Billing', sort_order: 2,
    },
    // Messaging
    {
      question: 'How do I send a message to the clinic?',
      answer: 'Click Message Us to send a secure message through Klara. Klara is HIPAA-compliant — it is the safest way to communicate with us about your health.',
      category: 'Messaging', sort_order: 1,
    },
    {
      question: 'Can I text the clinic?',
      answer: 'Yes. Click Text Us to send a message through Klara. Standard SMS is not HIPAA-compliant, so we use Klara to keep your information secure.',
      category: 'Messaging', sort_order: 2,
    },
    // Office Hours
    {
      question: 'What are your office hours?',
      answer: 'We are open Monday through Friday, 9:00 AM to 5:30 PM, with a lunch break from 12:30 PM to 1:30 PM. We are closed on weekends and major holidays.',
      category: 'Office Hours', sort_order: 1,
    },
    {
      question: 'What holidays is the clinic closed?',
      answer: "We are closed on Thanksgiving Day, the day after Thanksgiving, Christmas Day, New Year's Day, Martin Luther King Jr. Day, Memorial Day, Independence Day, and Labor Day.",
      category: 'Office Hours', sort_order: 2,
    },
    // Direct Primary Care
    {
      question: 'What is Direct Primary Care?',
      answer: 'Direct Primary Care (DPC) is a care model where your physician maintains a smaller patient panel, meaning more time and personal attention for each patient. You get same-day or next-day appointments, unhurried visits, and a physician who knows your full medical history.',
      category: 'Direct Primary Care', sort_order: 1,
    },
    {
      question: 'How is this different from a regular primary care practice?',
      answer: 'In a traditional practice, physicians often see 20–30 patients per day, leaving little time for each. In our patient-centered model, we keep our panel smaller so every visit is unhurried and every patient gets the attention they deserve.',
      category: 'Direct Primary Care', sort_order: 2,
    },
  ]);

  // ── legal_pages ───────────────────────────────────────────────────────────
  console.log('legal_pages');
  await insert('legal_pages', [
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      body: 'TODO: Insert full Privacy Policy text here. This page should describe how the website collects, uses, and protects visitor information.',
      version: '1.0',
      is_published: true,
    },
    {
      slug: 'hipaa-notice',
      title: 'HIPAA Notice of Privacy Practices',
      body: 'TODO: Insert full HIPAA Notice of Privacy Practices here. This notice describes how medical information about you may be used and disclosed and how you can get access to this information.',
      version: '1.0',
      is_published: true,
    },
    {
      slug: 'terms-of-use',
      title: 'Terms of Use',
      body: 'TODO: Insert full Terms of Use text here. This page describes the terms and conditions for using this website.',
      version: '1.0',
      is_published: true,
    },
  ]);

  console.log('\nSeed complete.');
}

seed().catch(err => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
