-- Add "Meet the Team" to header navigation
INSERT INTO public.navigation_links (category, label, href, is_visible, display_order)
VALUES ('header', 'Meet the Team', '/meet-the-team', true, 50)
ON CONFLICT (category, href) DO UPDATE 
SET label = EXCLUDED.label, 
    is_visible = EXCLUDED.is_visible, 
    display_order = EXCLUDED.display_order;

-- Add "Meet the Team" to footer navigation
INSERT INTO public.navigation_links (category, label, href, is_visible, display_order)
VALUES ('footer', 'Meet the Team', '/meet-the-team', true, 50)
ON CONFLICT (category, href) DO UPDATE 
SET label = EXCLUDED.label, 
    is_visible = EXCLUDED.is_visible, 
    display_order = EXCLUDED.display_order;
