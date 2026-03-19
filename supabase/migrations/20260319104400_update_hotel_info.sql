-- Update settings table to include WhatsApp and developer contact
ALTER TABLE settings ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '+256772572645';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS developer_name TEXT DEFAULT 'Nexterp Systems';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS developer_phone TEXT DEFAULT '+256772514889';

-- Update the hotel information
UPDATE settings SET
    address = 'Iganga, after Nakalama trading center along Tororo road at the right side of the road',
    contact_phone = '+256772572645',  -- Hotel WhatsApp
    whatsapp = '+256772572645',
    developer_name = 'Nexterp Systems',
    developer_phone = '+256772514889'
WHERE id = 'hotel_config';