import domReady from '@wordpress/dom-ready';
import { registerBlockType } from '@wordpress/blocks';
import { createElement, useState } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck, useBlockProps, RichText } from '@wordpress/block-editor';
import { TextControl, TextareaControl, Button } from '@wordpress/components';

const el = createElement;

const ImageSelect = ({ value, onChange, label }) => {
  return el('div', { style: { marginBottom: 20 } },
    el('p', { style: { margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#555' } }, label),
    el(MediaUploadCheck, null,
      el(MediaUpload, {
        onSelect: (media) => onChange({ id: media.id, url: media.url }),
        allowedTypes: ['image'],
        value: value?.id,
        render: ({ open }) => el(Button, { isSecondary: true, onClick: open }, value?.id ? 'Replace Image' : 'Select Image')
      })
    ),
    value?.url ? el('img', { src: value.url, style: { marginTop: 10, maxWidth: '150px', display: 'block', borderRadius: '4px', border: '1px solid #ddd' } }) : null
  );
};

const FormField = ({ label, children }) => {
  return el('div', { style: { marginBottom: '16px', background: '#fff', padding: '16px', border: '1px solid #e2e4e7', borderRadius: '4px' } },
    children
  );
};

const WysiwygField = ({ label, value, onChange, placeholder }) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  return el(FormField, null,
    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
      el('p', { style: { margin: '0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#555' } }, label),
      el(Button, { 
        isSmall: true, 
        variant: 'link', 
        onClick: () => setIsHtmlMode(!isHtmlMode) 
      }, isHtmlMode ? 'Toon WYSIWYG' : 'Bewerk HTML')
    ),
    isHtmlMode 
      ? el(TextareaControl, {
          value: value,
          onChange: onChange,
          placeholder: placeholder || 'Typ hier (HTML toegestaan)...',
          style: { fontFamily: 'monospace', fontSize: '13px' }
        })
      : el(RichText, {
          tagName: 'div',
          value: value,
          onChange: onChange,
          placeholder: placeholder || 'Typ hier...',
          style: { border: '1px solid #757575', padding: '12px', borderRadius: '4px', background: '#fff', minHeight: '80px', fontFamily: 'sans-serif', fontSize: '14px' }
        })
  );
};

const BlockEditorForm = ({ title, children }) => {
  const blockProps = useBlockProps({
    style: { 
      border: '1px solid #1e1e1e', 
      padding: '24px', 
      background: '#f8f9f9', 
      fontFamily: 'sans-serif',
      marginBottom: '24px',
      borderRadius: '8px'
    }
  });

  return el('div', blockProps,
    el('div', { style: { marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '8px' } },
      el('span', { style: { background: '#1e1e1e', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' } }, 'BLOCK'),
      el('h3', { style: { margin: 0, fontSize: '16px', color: '#1e1e1e' } }, title)
    ),
    children
  );
};

domReady(() => {
  // 0. Navigation
  registerBlockType('sg/navigation', {
    title: 'Site Navigation', icon: 'menu', category: 'theme',
    description: 'The main navigation bar with logo, page links, and a call-to-action button.',
    attributes: {
      logoId:       { type: 'number' },
      logoUrl:      { type: 'string' },
      navItems:     { type: 'array',   default: [
        { label: 'Over ons',    url: '#over', newTab: false },
        { label: 'Portfolio',   url: '#portfolio', newTab: false },
        { label: 'Blog',        url: '#blog', newTab: false },
        { label: 'Contact',     url: '#contact', newTab: false }
      ]},
      ctaText:      { type: 'string',  default: 'Plan afspraak' },
      ctaIsBooking: { type: 'boolean', default: true },
      ctaUrl:       { type: 'string',  default: '' }
    },
    edit: ({ attributes, setAttributes }) => {
      const { ToggleControl } = wp.components;

      const updateItem = (index, key, val) => {
        const items = [...attributes.navItems];
        items[index] = { ...items[index], [key]: val };
        setAttributes({ navItems: items });
      };

      const removeItem = (index) => {
        const items = [...attributes.navItems];
        items.splice(index, 1);
        setAttributes({ navItems: items });
      };

      const moveItem = (index, direction) => {
        const items = [...attributes.navItems];
        const target = index + direction;
        if (target < 0 || target >= items.length) return;
        [items[index], items[target]] = [items[target], items[index]];
        setAttributes({ navItems: items });
      };

      const btnStyle = (disabled) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '26px',
        height: '26px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        background: disabled ? '#f8f9f9' : '#fff',
        color: disabled ? '#ccc' : '#555',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: '12px',
        lineHeight: 1,
        flexShrink: 0,
      });

      const navItemEls = attributes.navItems.map((item, i) =>
        el('div', {
            key: i,
            style: {
              display: 'grid',
              gridTemplateColumns: 'auto 1fr 1fr auto auto auto',
              gap: '8px',
              alignItems: 'center',
              padding: '10px 12px',
              background: '#f8f9f9',
              borderRadius: '4px',
              marginBottom: '6px',
              border: '1px solid #e0e0e0',
            }
          },
          // Up / Down buttons
          el('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '20px' } },
            el('button', {
              type: 'button',
              style: btnStyle(i === 0),
              disabled: i === 0,
              title: 'Move up',
              onClick: () => moveItem(i, -1)
            }, '↑'),
            el('button', {
              type: 'button',
              style: btnStyle(i === attributes.navItems.length - 1),
              disabled: i === attributes.navItems.length - 1,
              title: 'Move down',
              onClick: () => moveItem(i, 1)
            }, '↓')
          ),
          el(TextControl, {
            label: 'Label',
            value: item.label,
            onChange: v => updateItem(i, 'label', v)
          }),
          el(TextControl, {
            label: 'URL',
            value: item.url,
            onChange: v => updateItem(i, 'url', v)
          }),
          el('div', { style: { paddingTop: '24px' } },
            el(ToggleControl, {
              label: 'New tab',
              checked: !!item.newTab,
              onChange: v => updateItem(i, 'newTab', v)
            })
          ),
          el('div', { style: { paddingTop: '20px' } },
            el(Button, { isDestructive: true, variant: 'link', onClick: () => removeItem(i) }, '✕')
          )
        )
      );

      return el(BlockEditorForm, { title: 'Site Navigation' },
        el('p', { style: { color: '#666', marginBottom: '16px', fontStyle: 'italic' } }, 'Configure the navigation bar: add a logo, define your pages, and set up the call-to-action button.'),

        // Logo
        el(FormField, null,
          el(ImageSelect, {
            label: 'Logo Image',
            value: { id: attributes.logoId, url: attributes.logoUrl },
            onChange: m => setAttributes({ logoId: m.id, logoUrl: m.url })
          }),
          !attributes.logoId && el('p', { style: { fontSize: '12px', color: '#888', marginTop: '8px' } }, 'No logo selected — the site name will be shown as text.')
        ),

        // Nav Items
        el(FormField, null,
          el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '4px' } }, 'Navigation Links'),
          el('p', { style: { fontSize: '11px', color: '#999', marginBottom: '12px' } }, 'Use ↑ ↓ to reorder links.'),
          ...navItemEls,
          el(Button, {
            isSecondary: true,
            style: { marginTop: '8px' },
            onClick: () => setAttributes({ navItems: [...attributes.navItems, { label: 'Nieuwe pagina', url: '#', newTab: false }] })
          }, '+ Add page link')
        ),

        // CTA Button
        el(FormField, null,
          el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Call-to-Action Button'),
          el(TextControl, { label: 'Button Label', value: attributes.ctaText, onChange: v => setAttributes({ ctaText: v }) }),
          el(ToggleControl, {
            label: 'Opens booking modal (instead of a URL)',
            checked: attributes.ctaIsBooking,
            onChange: v => setAttributes({ ctaIsBooking: v })
          }),
          !attributes.ctaIsBooking && el(TextControl, {
            label: 'Button URL',
            value: attributes.ctaUrl,
            onChange: v => setAttributes({ ctaUrl: v })
          })
        )
      );
    },
    save: () => null
  });


  // 1. Opening Splash

  registerBlockType('sg/opening', {
    title: 'Opening Splash', icon: 'cover-image', category: 'theme',
    description: 'Fullscreen opening visual — the eye-catcher of the page with a big headline and background image.',
    attributes: {
      heading: { type: 'string', default: 'Kleine handjes, <br />gekke snoetjes <span class="script italic">&amp; echte</span> <br />lach.' },
      subtext: { type: 'string', default: 'Geen stijve houdingen, geen "moeten". Wel ruimte voor rommel, gekkigheid en die ene echte glimlach.' },
      buttonText: { type: 'string', default: 'Plan je shoot →' },
      imageId: { type: 'number' },
      imageUrl: { type: 'string' }
    },
    edit: ({ attributes, setAttributes }) => {
      return el(BlockEditorForm, { title: 'Opening Splash — Fullscreen Hero' },
        el('p', { style: { color: '#666', marginBottom: '16px', fontStyle: 'italic' } }, 'This is the fullscreen opening visual at the top of the page. Choose a striking image and a powerful headline.'),
        el(WysiwygField, { label: 'Headline', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(WysiwygField, { label: 'Subtext', value: attributes.subtext, onChange: v => setAttributes({ subtext: v }) }),
        el(FormField, null, el(TextControl, { label: 'Button Text', value: attributes.buttonText, onChange: v => setAttributes({ buttonText: v }) })),
        el(FormField, null, el(ImageSelect, { label: 'Background Image', value: { id: attributes.imageId, url: attributes.imageUrl }, onChange: m => setAttributes({ imageId: m.id, imageUrl: m.url }) }))
      );
    },
    save: () => null
  });

  // 2. About
  registerBlockType('sg/about', {
    title: 'About', icon: 'admin-users', category: 'theme',
    attributes: {
      heading: { type: 'string', default: 'Merel <span class="script" style="color: var(--terracotta); font-size: 0.8em;">&amp;</span> Jaimy' },
      eyebrow: { type: 'string', default: 'Het verhaal' },
      content: { type: 'string', default: '<p class="body-lg" style="margin-top: 0">Wij zijn niet alleen vriendinnen, maar inmiddels ook schoonzussen — en we delen een grote liefde voor fotografie.</p><p class="body">Samen worden we het meest blij van jonge kinderen en hun gezin.</p>' },
      signature: { type: 'string', default: 'Merel & Jaimy' },
      imageId: { type: 'number' },
      imageUrl: { type: 'string' }
    },
    edit: ({ attributes, setAttributes }) => {
      return el(BlockEditorForm, { title: 'About Section' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(WysiwygField, { label: 'Content', value: attributes.content, onChange: v => setAttributes({ content: v }) }),
        el(FormField, null, el(TextControl, { label: 'Signature Name', value: attributes.signature, onChange: v => setAttributes({ signature: v }) })),
        el(FormField, null, el(ImageSelect, { label: 'Portrait Image', value: { id: attributes.imageId, url: attributes.imageUrl }, onChange: m => setAttributes({ imageId: m.id, imageUrl: m.url }) }))
      );
    },
    save: () => null
  });

  // 3. Portfolio
  registerBlockType('sg/portfolio', {
    title: 'Portfolio Grid', icon: 'format-gallery', category: 'theme',
    attributes: {
      heading:        { type: 'string', default: 'Recent <span class="italic" style="font-weight: 300;">werk</span>' },
      eyebrow:        { type: 'string', default: 'Portfolio · 2025–2026' },
      buttonText:     { type: 'string', default: 'Bekijk het hele portfolio' },
      buttonUrl:      { type: 'string', default: '#' },
      numberOfImages: { type: 'number', default: 8 },
      images:         { type: 'array',  default: [] }
    },
    edit: ({ attributes, setAttributes }) => {
      const count = Math.min(Math.max(parseInt(attributes.numberOfImages) || 1, 1), 12);

      const updateImage = (index, media) => {
        const newImages = [...attributes.images];
        newImages[index] = { id: media.id, url: media.url };
        setAttributes({ images: newImages });
      };

      const imageSelectors = [];
      for (let i = 0; i < count; i++) {
        imageSelectors.push(el(ImageSelect, { key: i, label: `Image ${i + 1}`, value: attributes.images[i], onChange: m => updateImage(i, m) }));
      }

      return el(BlockEditorForm, { title: 'Portfolio Grid' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(FormField, null, el(TextControl, { label: 'Button Text', value: attributes.buttonText, onChange: v => setAttributes({ buttonText: v }) })),
        el(FormField, null, el(TextControl, { label: 'Button URL', value: attributes.buttonUrl, onChange: v => setAttributes({ buttonUrl: v }) })),
        el(FormField, null,
          el(TextControl, {
            label: 'Number of images',
            type: 'number',
            value: String(attributes.numberOfImages),
            min: '1',
            max: '12',
            help: 'Between 1 and 12. The image slots below update immediately.',
            onChange: v => {
              const n = Math.min(Math.max(parseInt(v) || 1, 1), 12);
              setAttributes({ numberOfImages: n });
            }
          })
        ),
        el(FormField, null,
          el('p', { style: { fontWeight: 'bold', margin: '0 0 16px 0' } }, `Grid Images (${count})`),
          el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' } }, ...imageSelectors)
        )
      );
    },
    save: () => null
  });


  // 4. Testimonials
  registerBlockType('sg/testimonials', {
    title: 'Testimonials', icon: 'testimonial', category: 'theme',
    attributes: {
      heading: { type: 'string', default: 'In hun woorden' },
      eyebrow: { type: 'string', default: 'Klanten' }
    },
    edit: ({ attributes, setAttributes }) => {
      return el(BlockEditorForm, { title: 'Testimonials' },
        el('p', { style: { color: '#666', marginBottom: '20px' } }, 'Testimonials are automatically loaded from the Testimonials post type.'),
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) })
      );
    },
    save: () => null
  });

  // 5. Blog Preview
  registerBlockType('sg/blog-preview', {
    title: 'Blog Preview', icon: 'welcome-widgets-menus', category: 'theme',
    attributes: {
      heading: { type: 'string', default: 'Uit ons <span class="script" style="color: var(--terracotta); font-size: 0.9em;">dagboek</span>' },
      numberOfPosts: { type: 'number', default: 3 }
    },
    edit: ({ attributes, setAttributes }) => {
      return el(BlockEditorForm, { title: 'Blog Preview' },
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(FormField, null, el(TextControl, { type: 'number', label: 'Number of posts to show', value: attributes.numberOfPosts, onChange: v => setAttributes({ numberOfPosts: parseInt(v) }) }))
      );
    },
    save: () => null
  });

  // 6. FAQ
  registerBlockType('sg/faq', {
    title: 'FAQ', icon: 'editor-help', category: 'theme',
    attributes: {
      heading: { type: 'string', default: 'Veelgestelde <span class="italic">vragen</span>' },
      eyebrow: { type: 'string', default: 'Alles op een rij' },
      faqs: { type: 'array', default: [
        { q: 'Hoe lang duurt een fotoshoot?', a: 'Een shoot duurt gemiddeld 60 tot 90 minuten.' }
      ]}
    },
    edit: ({ attributes, setAttributes }) => {
      const updateFaq = (index, key, val) => {
        const newFaqs = [...attributes.faqs];
        newFaqs[index][key] = val;
        setAttributes({ faqs: newFaqs });
      };
      
      const faqElements = attributes.faqs.map((faq, i) => {
        return el('div', { key: i, style: { marginBottom: 15, background: '#f8f9f9', padding: '16px', borderRadius: '4px', border: '1px solid #ddd' } },
          el(TextControl, { label: `Question ${i+1}`, value: faq.q, onChange: v => updateFaq(i, 'q', v) }),
          el(WysiwygField, { label: 'Answer', value: faq.a, onChange: v => updateFaq(i, 'a', v) }),
          el(Button, { isDestructive: true, variant: 'link', onClick: () => {
            const newFaqs = [...attributes.faqs];
            newFaqs.splice(i, 1);
            setAttributes({ faqs: newFaqs });
          } }, 'Remove FAQ')
        );
      });

      return el(BlockEditorForm, { title: 'FAQ Section' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(FormField, null, 
          el('h4', { style: { margin: '0 0 16px 0' } }, 'Questions & Answers'),
          ...faqElements,
          el(Button, { isSecondary: true, onClick: () => setAttributes({ faqs: [...attributes.faqs, { q: '', a: '' }] }) }, '+ Add FAQ')
        )
      );
    },
    save: () => null
  });

  // 7. Instagram
  registerBlockType('sg/instagram', {
    title: 'Instagram Grid', icon: 'camera', category: 'theme',
    attributes: {
      eyebrow: { type: 'string', default: 'Volg ons dagelijks' },
      handleText: { type: 'string', default: '@studio.glimlach' },
      handleUrl: { type: 'string', default: '#' },
      images: { type: 'array', default: [] }
    },
    edit: ({ attributes, setAttributes }) => {
      const updateImage = (index, media) => {
        const newImages = [...attributes.images];
        newImages[index] = { id: media.id, url: media.url };
        setAttributes({ images: newImages });
      };
      
      const imageSelectors = [];
      for(let i = 0; i < 6; i++) {
        imageSelectors.push(el(ImageSelect, { key: i, label: `Image ${i + 1}`, value: attributes.images[i], onChange: m => updateImage(i, m) }));
      }
      
      return el(BlockEditorForm, { title: 'Instagram Grid' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(FormField, null, el(TextControl, { label: 'Handle Text', value: attributes.handleText, onChange: v => setAttributes({ handleText: v }) })),
        el(FormField, null, el(TextControl, { label: 'Handle URL', value: attributes.handleUrl, onChange: v => setAttributes({ handleUrl: v }) })),
        el(FormField, null, 
          el('p', { style: { fontWeight: 'bold', margin: '0 0 16px 0' } }, 'Grid Images (Up to 6)'),
          el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' } }, ...imageSelectors)
        )
      );
    },
    save: () => null
  });

  // 8. CTA
  registerBlockType('sg/cta', {
    title: 'CTA (Call to Action)', icon: 'megaphone', category: 'theme',
    attributes: {
      eyebrow: { type: 'string', default: 'Afspraak maken' },
      heading: { type: 'string', default: 'Laat ons <br /><span class="cta-script">jullie verhaal</span><br /> vastleggen' },
      subtext: { type: 'string', default: 'Plan een vrijblijvend kennismakingsgesprek, of boek direct een shoot. We kijken er naar uit.' },
      primaryButtonText: { type: 'string', default: 'Plan je shoot' },
      secondaryButtonText: { type: 'string', default: 'Stuur een mailtje' },
      secondaryButtonUrl: { type: 'string', default: 'mailto:hallo@studioglimlach.nl' }
    },
    edit: ({ attributes, setAttributes }) => {
      return el(BlockEditorForm, { title: 'Call to Action' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(WysiwygField, { label: 'Subtext', value: attributes.subtext, onChange: v => setAttributes({ subtext: v }) }),
        el(FormField, null, el(TextControl, { label: 'Primary Button Text (Opens Booking Modal)', value: attributes.primaryButtonText, onChange: v => setAttributes({ primaryButtonText: v }) })),
        el(FormField, null, el(TextControl, { label: 'Secondary Button Text', value: attributes.secondaryButtonText, onChange: v => setAttributes({ secondaryButtonText: v }) })),
        el(FormField, null, el(TextControl, { label: 'Secondary Button URL', value: attributes.secondaryButtonUrl, onChange: v => setAttributes({ secondaryButtonUrl: v }) }))
      );
    },
    save: () => null
  });

  // 9. Appointment
  registerBlockType('sg/appointment', {
    title: 'Appointment Booking Modal', icon: 'calendar', category: 'theme',
    attributes: {
      successMessage: { type: 'string', default: 'Je hoort binnen 24 uur van ons met een bevestiging.' },
      shootTypes: { type: 'array', default: [
        { id: 'newborn', label: 'Newborn', sub: '0 – 2 weken' },
        { id: 'baby', label: 'Baby & sitter', sub: '3 – 12 maanden' },
        { id: 'gezin', 'label': 'Gezinsshoot', sub: 'Alle leeftijden' }
      ]}
    },
    edit: ({ attributes, setAttributes }) => {
      const updateType = (index, key, val) => {
        const newTypes = [...attributes.shootTypes];
        newTypes[index][key] = val;
        setAttributes({ shootTypes: newTypes });
      };
      
      const typeElements = attributes.shootTypes.map((t, i) => {
        return el('div', { key: i, style: { marginBottom: 15, background: '#f8f9f9', padding: '16px', borderRadius: '4px', border: '1px solid #ddd' } },
          el(TextControl, { label: 'ID (internal handle)', value: t.id, onChange: v => updateType(i, 'id', v) }),
          el(TextControl, { label: 'Label (displayed)', value: t.label, onChange: v => updateType(i, 'label', v) }),
          el(TextControl, { label: 'Subtitle', value: t.sub, onChange: v => updateType(i, 'sub', v) }),
          el(Button, { isDestructive: true, variant: 'link', onClick: () => {
            const newTypes = [...attributes.shootTypes];
            newTypes.splice(i, 1);
            setAttributes({ shootTypes: newTypes });
          } }, 'Remove')
        );
      });

      return el(BlockEditorForm, { title: 'Appointment System' },
        el('p', { style: { color: '#666', marginBottom: '20px' } }, 'This block configures the hidden booking popup. It should only be added once per page.'),
        el(FormField, null, el(TextareaControl, { label: 'Success Message', value: attributes.successMessage, onChange: v => setAttributes({ successMessage: v }) })),
        el(FormField, null, 
          el('h4', { style: { margin: '0 0 16px 0' } }, 'Shoot Types'),
          ...typeElements,
          el(Button, { isSecondary: true, onClick: () => setAttributes({ shootTypes: [...attributes.shootTypes, { id: 'new', label: 'Nieuw', sub: '' }] }) }, '+ Add Shoot Type')
        )
      );
    },
    save: () => null
  });
});
