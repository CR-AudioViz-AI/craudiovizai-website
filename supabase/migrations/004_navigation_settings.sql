-- Create navigation_links table
CREATE TABLE IF NOT EXISTS public.navigation_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    category TEXT NOT NULL, -- 'header', 'footer-navigation', 'footer-resources', 'footer-company', 'footer-legal'
    is_visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.navigation_links ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Navigation links are viewable by everyone"
    ON public.navigation_links FOR SELECT
    USING (true);

CREATE POLICY "Only admins can update navigation links"
    ON public.navigation_links FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Insert default navigation links
INSERT INTO public.navigation_links (link_key, label, href, category, is_visible, display_order) VALUES
-- Header Navigation
('home', 'Home', '/', 'header', true, 1),
('apps', 'Apps', '/apps', 'header', true, 2),
('games', 'Games', '/games', 'header', true, 3),
('javari', 'Javari AI', '/javari', 'header', true, 4),
('craiverse', 'CRAIVerse', '/craiverse', 'header', true, 5),
('pricing', 'Pricing', '/pricing', 'header', true, 6),

-- Footer Navigation
('footer-home', 'Home', '/', 'footer-navigation', true, 1),
('footer-apps', 'Apps', '/apps', 'footer-navigation', true, 2),
('footer-games', 'Games', '/games', 'footer-navigation', true, 3),
('footer-javari', 'Javari AI', '/javari', 'footer-navigation', true, 4),
('footer-craiverse', 'CRAIVerse', '/craiverse', 'footer-navigation', true, 5),
('footer-pricing', 'Pricing', '/pricing', 'footer-navigation', true, 6),

-- Footer Resources
('blog', 'Blog', '/blog', 'footer-resources', true, 1),
('tutorials', 'Tutorials', '/tutorials', 'footer-resources', true, 2),
('help', 'Help Center', '/help', 'footer-resources', true, 3),
('faq', 'FAQ', '/faq', 'footer-resources', true, 4),
('api-docs', 'API Documentation', '/api-docs', 'footer-resources', true, 5),
('community', 'Community', '/community', 'footer-resources', true, 6),
('status', 'System Status', '/status', 'footer-resources', true, 7),

-- Footer Company
('about', 'About Us', '/about', 'footer-company', true, 1),
('careers', 'Careers', '/careers', 'footer-company', true, 2),
('press', 'Press Kit', '/press', 'footer-company', true, 3),
('partners', 'Partners', '/partners', 'footer-company', true, 4),
('contact', 'Contact Us', '/contact', 'footer-company', true, 5),
('marketplace', 'Marketplace', '/marketplace', 'footer-company', true, 6),

-- Footer Legal
('terms', 'Terms of Service', '/terms', 'footer-legal', true, 1),
('privacy', 'Privacy Policy', '/privacy', 'footer-legal', true, 2),
('cookies', 'Cookie Policy', '/cookies', 'footer-legal', true, 3),
('dmca', 'DMCA Policy', '/dmca', 'footer-legal', true, 4),
('licenses', 'Licenses', '/licenses', 'footer-legal', true, 5),
('acceptable-use', 'Acceptable Use', '/acceptable-use', 'footer-legal', true, 6);
