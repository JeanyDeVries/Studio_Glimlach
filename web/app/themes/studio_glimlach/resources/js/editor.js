import domReady from '@wordpress/dom-ready';
import { registerBlockType } from '@wordpress/blocks';
import { createElement, useState } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck, useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl, Button } from '@wordpress/components';

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


// ── Studio Glimlach site palette ────────────────────────────────────────────
const SG_PALETTE = [
  { label: 'Zand',       value: '#F2E9DE' },
  { label: 'Klei',       value: '#E1C5B0' },
  { label: 'Salie',      value: '#CDD4B2' },
  { label: 'Terracotta', value: '#D6927B' },
  { label: 'Inkt',       value: '#000000' },
  { label: 'Inkt zacht', value: '#2a2622' },
  { label: 'Wit',        value: '#ffffff' },
];

const LS_KEY = 'sg_custom_palette';

const loadCustomColors = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
};

const isValidColor = (v) =>
  /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v.trim()) ||
  /^rgba?\(\s*\d/.test(v.trim());

// ── Single swatch (shared between fixed + custom rows) ───────────────────────
const Swatch = ({ colorVal, label, selected, onSelect, onDelete }) =>
  el('div', {
    key: colorVal,
    style: { position: 'relative', width: '28px', height: '28px', flexShrink: 0 }
  },
    el('button', {
      title: label || colorVal,
      onClick: onSelect,
      style: {
        width: '28px', height: '28px', borderRadius: '50%',
        background: colorVal,
        border: selected ? '3px solid #1e1e1e' : '2px solid rgba(0,0,0,0.15)',
        cursor: 'pointer', padding: 0, display: 'block',
        boxShadow: selected ? '0 0 0 2px #fff inset' : 'none',
      }
    }),
    // Delete button — only rendered for custom colours
    onDelete && el('button', {
      title: 'Verwijder',
      onClick: (e) => { e.stopPropagation(); onDelete(); },
      style: {
        position: 'absolute', top: '-5px', right: '-5px',
        width: '14px', height: '14px', borderRadius: '50%',
        background: '#c0392b', color: '#fff', border: 'none',
        fontSize: '9px', lineHeight: '14px', textAlign: 'center',
        cursor: 'pointer', padding: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
      }
    }, '×')
  );

// ── Single colour picker row ─────────────────────────────────────────────────
const SgColorPicker = ({ label, value, onChange, customColors, onAddColor, onRemoveColor }) => {
  const [inputVal, setInputVal] = useState('');

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (!isValidColor(trimmed)) return;
    // Avoid exact duplicates in fixed or custom list
    const allValues = [...SG_PALETTE.map(s => s.value), ...customColors.map(s => s.value)];
    if (!allValues.includes(trimmed)) {
      onAddColor({ label: trimmed, value: trimmed });
    }
    onChange(trimmed);
    setInputVal('');
  };

  const handleInputChange = (v) => {
    setInputVal(v);
    // Live-apply when it looks like a valid color while typing
    if (isValidColor(v)) onChange(v.trim());
  };

  return el('div', { style: { marginBottom: '24px' } },
    el('p', { style: {
      margin: '0 0 8px', fontSize: '11px', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555'
    } }, label),

    // ── Fixed site palette ──
    el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' } },
      SG_PALETTE.map(({ label: l, value: v }) =>
        el(Swatch, {
          key: v, colorVal: v, label: l,
          selected: value === v,
          onSelect: () => { onChange(v); setInputVal(''); },
          onDelete: null,
        })
      )
    ),

    // ── Custom colours (deletable) ──
    customColors.length > 0 && el('div', null,
      el('p', { style: {
        margin: '10px 0 6px', fontSize: '10px', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#999'
      }}, 'Eigen kleuren'),
      el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' } },
        customColors.map(({ label: l, value: v }) =>
          el(Swatch, {
            key: v, colorVal: v, label: l,
            selected: value === v,
            onSelect: () => { onChange(v); setInputVal(''); },
            onDelete: () => onRemoveColor(v),
          })
        )
      )
    ),

    // ── Free input + Add button ──
    el('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' } },
      el('div', { style: {
        width: '28px', height: '28px', borderRadius: '4px', flexShrink: 0,
        background: isValidColor(inputVal) ? inputVal.trim() : (value || '#fff'),
        border: '1px solid rgba(0,0,0,0.2)',
      }}),
      el('input', {
        type: 'text',
        value: inputVal,
        placeholder: '#F2E9DE  of  rgba(0,0,0,0.5)',
        onChange: (e) => handleInputChange(e.target.value),
        onKeyDown: (e) => { if (e.key === 'Enter') handleAdd(); },
        style: {
          flex: 1, padding: '6px 10px', border: '1px solid #ddd',
          borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px',
          color: '#1e1e1e', background: '#fafafa',
        }
      }),
      el('button', {
        onClick: handleAdd,
        title: 'Voeg toe aan palet',
        disabled: !isValidColor(inputVal),
        style: {
          padding: '6px 10px', background: isValidColor(inputVal) ? '#1e1e1e' : '#ddd',
          color: '#fff', border: 'none', borderRadius: '4px',
          fontSize: '16px', lineHeight: 1, cursor: isValidColor(inputVal) ? 'pointer' : 'default',
          transition: 'background 0.2s', flexShrink: 0,
        }
      }, '+')
    )
  );
};

// ── Sidebar panel — manages shared custom palette ────────────────────────────
const ColorPanel = ({ backgroundColor, textColor, onChangeBackground, onChangeText }) => {
  const [customColors, setCustomColors] = useState(() => loadCustomColors());

  const addCustomColor = (swatch) => {
    setCustomColors(prev => {
      const next = [...prev, swatch];
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const removeCustomColor = (colorVal) => {
    setCustomColors(prev => {
      const next = prev.filter(s => s.value !== colorVal);
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return el(InspectorControls, null,
    el(PanelBody, { title: 'Kleuren', initialOpen: true },
      el(SgColorPicker, {
        label: 'Achtergrondkleur',
        value: backgroundColor,
        onChange: onChangeBackground,
        customColors,
        onAddColor: addCustomColor,
        onRemoveColor: removeCustomColor,
      }),
      el(SgColorPicker, {
        label: 'Tekstkleur',
        value: textColor,
        onChange: onChangeText,
        customColors,
        onAddColor: addCustomColor,
        onRemoveColor: removeCustomColor,
      })
    )
  );
};

domReady(() => {
  // 0. Navigation
  registerBlockType('sg/navigation', {
    title: 'Site Navigation', icon: 'menu', category: 'theme',
    description: 'The main navigation bar with logo, page links, and a call-to-action button.',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor: { type: 'string', default: '#000000' },
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

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Site Navigation' },
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
      backgroundColor: { type: 'string', default: 'transparent' },
      textColor: { type: 'string', default: '#ffffff' },
      heading: { type: 'string', default: 'Kleine handjes, <br />gekke snoetjes <span class="script italic">&amp; echte</span> <br />lach.' },
      subtext: { type: 'string', default: 'Geen stijve houdingen, geen "moeten". Wel ruimte voor rommel, gekkigheid en die ene echte glimlach.' },
      buttonText: { type: 'string', default: 'Plan je shoot →' },
      imageId: { type: 'number' },
      imageUrl: { type: 'string' }
    },
    edit: ({ attributes, setAttributes }) => {
      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Opening Splash — Fullscreen Hero' },
        el('p', { style: { color: '#666', marginBottom: '16px', fontStyle: 'italic' } }, 'This is the fullscreen opening visual at the top of the page. Choose a striking image and a powerful headline.'),
        el(WysiwygField, { label: 'Headline', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(WysiwygField, { label: 'Subtext', value: attributes.subtext, onChange: v => setAttributes({ subtext: v }) }),
        el(FormField, null, el(TextControl, { label: 'Button Text', value: attributes.buttonText, onChange: v => setAttributes({ buttonText: v }) })),
        el(FormField, null, el(ImageSelect, { label: 'Background Image', value: { id: attributes.imageId, url: attributes.imageUrl }, onChange: m => setAttributes({ imageId: m.id, imageUrl: m.url }) }))
      )
    );
    },
    save: () => null
  });

  // 2. About
  registerBlockType('sg/about', {
    title: 'About', icon: 'admin-users', category: 'theme',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor: { type: 'string', default: '#000000' },
      heading: { type: 'string', default: 'Merel <span class="script" style="color: var(--terracotta); font-size: 0.8em;">&amp;</span> Jaimy' },
      eyebrow: { type: 'string', default: 'Het verhaal' },
      content: { type: 'string', default: '<p class="body-lg" style="margin-top: 0">Wij zijn niet alleen vriendinnen, maar inmiddels ook schoonzussen — en we delen een grote liefde voor fotografie.</p><p class="body">Samen worden we het meest blij van jonge kinderen en hun gezin.</p>' },
      signature: { type: 'string', default: 'Merel & Jaimy' },
      imageId: { type: 'number' },
      imageUrl: { type: 'string' }
    },
    edit: ({ attributes, setAttributes }) => {
      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'About Section' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(WysiwygField, { label: 'Content', value: attributes.content, onChange: v => setAttributes({ content: v }) }),
        el(FormField, null, el(TextControl, { label: 'Signature Name', value: attributes.signature, onChange: v => setAttributes({ signature: v }) })),
        el(FormField, null, el(ImageSelect, { label: 'Portrait Image', value: { id: attributes.imageId, url: attributes.imageUrl }, onChange: m => setAttributes({ imageId: m.id, imageUrl: m.url }) }))
      )
    );
    },
    save: () => null
  });

  // 3. Portfolio
  registerBlockType('sg/portfolio', {
    title: 'Portfolio Grid', icon: 'format-gallery', category: 'theme',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor: { type: 'string', default: '#000000' },
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

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Portfolio Grid' },
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
      )
    );
    },
    save: () => null
  });

  // 3b. Portfolio Full (dedicated portfolio page block)
  registerBlockType('sg/portfolio-full', {
    title: 'Portfolio — Volledig overzicht', icon: 'images-alt2', category: 'theme',
    description: 'Full portfolio page with masonry grid, category filters, and a booking CTA.',
    attributes: {
      backgroundColor:  { type: 'string', default: '#F2E9DE' },
      textColor:        { type: 'string', default: '#000000' },
      heading:          { type: 'string', default: 'Ons <span class="italic" style="font-weight:300;">portfolio</span>' },
      eyebrow:          { type: 'string', default: 'Alle shoots · 2024–2026' },
      sectionNum:       { type: 'string', default: 'N°03' },
      ctaText:          { type: 'string', default: 'Wil je ook zulke herinneringen vastleggen?' },
      // Each shoot = { name: string, images: [{id, url}] }
      shoots:           { type: 'array',  default: [] },
    },
    edit: ({ attributes, setAttributes }) => {
      const shoots = attributes.shoots || [];

      // ── Shoot helpers ───────────────────────────────────────────────────────────────
      const addShoot = () =>
        setAttributes({ shoots: [...shoots, { name: 'Nieuwe categorie', images: [] }] });

      const removeShoot = (si) => {
        const next = [...shoots];
        next.splice(si, 1);
        setAttributes({ shoots: next });
      };

      const updateShootName = (si, val) => {
        const next = shoots.map((s, i) => i === si ? { ...s, name: val } : s);
        setAttributes({ shoots: next });
      };

      const addImageToShoot = (si) => {
        const next = shoots.map((s, i) =>
          i === si ? { ...s, images: [...(s.images || []), { id: null, url: '' }] } : s
        );
        setAttributes({ shoots: next });
      };

      const updateShootImage = (si, ii, media) => {
        const next = shoots.map((s, i) => {
          if (i !== si) return s;
          const imgs = [...(s.images || [])];
          imgs[ii] = { id: media.id, url: media.url };
          return { ...s, images: imgs };
        });
        setAttributes({ shoots: next });
      };

      const removeShootImage = (si, ii) => {
        const next = shoots.map((s, i) => {
          if (i !== si) return s;
          const imgs = [...(s.images || [])];
          imgs.splice(ii, 1);
          return { ...s, images: imgs };
        });
        setAttributes({ shoots: next });
      };

      // ── Shoot UI ────────────────────────────────────────────────────────────────
      const shootSectionStyle = {
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginBottom: '16px',
        overflow: 'hidden',
      };
      const shootHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 14px',
        background: '#f0f0f0',
        borderBottom: '1px solid #ddd',
      };

      const shootEls = shoots.map((shoot, si) => {
        const imgEls = (shoot.images || []).map((img, ii) =>
          el('div', { key: ii, style: { position: 'relative' } },
            el(ImageSelect, {
              label: `Foto ${ii + 1}`,
              value: img,
              onChange: m => updateShootImage(si, ii, m),
            }),
            el(Button, {
              isDestructive: true,
              variant: 'link',
              style: { fontSize: '11px', marginTop: '-4px', paddingLeft: 0 },
              onClick: () => removeShootImage(si, ii),
            }, '✕ Verwijder foto')
          )
        );

        return el('div', { key: si, style: shootSectionStyle },
          el('div', { style: shootHeaderStyle },
            el('div', { style: { flex: 1 } },
              el(TextControl, {
                label: 'Categorienaam',
                value: shoot.name,
                onChange: v => updateShootName(si, v),
              })
            ),
            el(Button, {
              isDestructive: true,
              variant: 'secondary',
              style: { flexShrink: 0, marginTop: '24px' },
              onClick: () => removeShoot(si),
            }, '✕ Verwijder categorie')
          ),
          el('div', { style: { padding: '14px' } },
            imgEls.length === 0
              ? el('p', { style: { color: '#999', fontSize: '12px', margin: '0 0 12px' } }, 'Nog geen foto\'s. Voeg er een toe.')
              : el('div', {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '12px',
                  }
                }, ...imgEls),
            el(Button, {
              isSecondary: true,
              onClick: () => addImageToShoot(si),
            }, '+ Foto toevoegen')
          )
        );
      });

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Portfolio — Volledig overzicht' },
          el('p', { style: { color: '#666', marginBottom: '16px', fontStyle: 'italic' } },
            "Voeg categorieën toe en selecteer per categorie de foto's. Alle foto's zijn zichtbaar op de pagina; bezoekers kunnen filteren per categorie."
          ),

          el(FormField, null,
            el(TextControl, { label: 'Sectienummer', value: attributes.sectionNum, onChange: v => setAttributes({ sectionNum: v }) }),
            el(TextControl, { label: 'Eyebrow tekst', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) }),
          ),
          el(WysiwygField, { label: 'Koptekst', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
          el(FormField, null,
            el(TextControl, { label: 'CTA-tekst (boven de Plan afspraak knop)', value: attributes.ctaText, onChange: v => setAttributes({ ctaText: v }) })
          ),

          el('div', { style: { marginTop: '8px' } },
            el('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #eee',
              }
            },
              el('div', null,
                el('p', {
                  style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#333', margin: 0 }
                }, "Categorieën & foto's"),
                el('p', { style: { fontSize: '11px', color: '#999', margin: '4px 0 0' } },
                  shoots.length === 0
                    ? "Nog geen categorieën. Voeg er een toe om te beginnen."
                    : `${shoots.length} ${shoots.length === 1 ? 'categorie' : 'categorieën'} · ${shoots.reduce((n, s) => n + (s.images || []).length, 0)} foto's`
                )
              ),
              el(Button, {
                isPrimary: true,
                onClick: addShoot,
              }, '+ Categorie toevoegen')
            ),
            ...shootEls
          )
        )
      );
    },
    save: () => null
  });


  // 4. Testimonials
  registerBlockType('sg/testimonials', {
    title: 'Testimonials', icon: 'testimonial', category: 'theme',
    attributes: {
      backgroundColor: { type: 'string', default: '#CDD4B2' },
      textColor: { type: 'string', default: '#000000' },
      heading: { type: 'string', default: 'In hun woorden' },
      eyebrow: { type: 'string', default: 'Klanten' }
    },
    edit: ({ attributes, setAttributes }) => {
      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Testimonials' },
        el('p', { style: { color: '#666', marginBottom: '20px' } }, 'Testimonials are automatically loaded from the Testimonials post type.'),
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) })
      )
    );
    },
    save: () => null
  });

  // 5. Blog Preview
  registerBlockType('sg/blog-preview', {
    title: 'Blog Sneak Peek', icon: 'welcome-widgets-menus', category: 'theme',
    description: 'Toon een selectie van blogartikelen op elke pagina — ideaal voor de homepage.',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor:       { type: 'string', default: '#000000' },
      sectionNum:      { type: 'string', default: '' },
      eyebrow:         { type: 'string', default: 'Verse verhalen' },
      heading:         { type: 'string', default: 'Uit ons <span class="script" style="color: var(--terracotta); font-size: 0.9em;">dagboek</span>' },
      blogUrl:         { type: 'string', default: '/blog' },
      blogLinkLabel:   { type: 'string', default: 'Naar het blog' },
      // Source: 'cpt' = sg_blog posts, 'folder' = sg_blog_folder tagged pages
      source:          { type: 'string', default: 'folder' },
      folderSlug:      { type: 'string', default: '' },
      numberOfPosts:   { type: 'number', default: 3 },
    },
    edit: ({ attributes, setAttributes }) => {
      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor:       attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText:       v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Blog Sneak Peek' },

          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Sectie-header'),
            el('div', { style: { display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', alignItems: 'end' } },
              el(TextControl, { label: 'N° label', value: attributes.sectionNum, onChange: v => setAttributes({ sectionNum: v }), placeholder: 'N°04' }),
              el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) }),
            ),
            el(WysiwygField, { label: 'Titel', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
              el(TextControl, { label: 'Blog link URL', value: attributes.blogUrl, onChange: v => setAttributes({ blogUrl: v }), placeholder: '/blog' }),
              el(TextControl, { label: 'Blog link label', value: attributes.blogLinkLabel, onChange: v => setAttributes({ blogLinkLabel: v }) }),
            )
          ),

          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '4px' } }, 'Bron van artikelen'),
            el(TextControl, {
              label: 'Blog Map slug (sg_blog_folder)',
              value: attributes.folderSlug,
              onChange: v => setAttributes({ folderSlug: v }),
              help: 'Vul de slug in van een Blog Map (bijv. "blogposts"). Leeglaten = meest recente sg_blog posts.',
              placeholder: 'blogposts',
            }),
            el(TextControl, {
              type: 'number',
              label: 'Aantal kaarten',
              value: attributes.numberOfPosts,
              onChange: v => setAttributes({ numberOfPosts: Math.max(1, parseInt(v) || 3) }),
            })
          )
        )
      );
    },
    save: () => null
  });

  // 6. FAQ
  registerBlockType('sg/faq', {
    title: 'FAQ', icon: 'editor-help', category: 'theme',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor: { type: 'string', default: '#000000' },
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

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'FAQ Section' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(FormField, null, 
          el('h4', { style: { margin: '0 0 16px 0' } }, 'Questions & Answers'),
          ...faqElements,
          el(Button, { isSecondary: true, onClick: () => setAttributes({ faqs: [...attributes.faqs, { q: '', a: '' }] }) }, '+ Add FAQ')
        )
      )
    );
    },
    save: () => null
  });

  // 7. Instagram
  registerBlockType('sg/instagram', {
    title: 'Instagram Grid', icon: 'camera', category: 'theme',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor: { type: 'string', default: '#000000' },
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
      
      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Instagram Grid' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(FormField, null, el(TextControl, { label: 'Handle Text', value: attributes.handleText, onChange: v => setAttributes({ handleText: v }) })),
        el(FormField, null, el(TextControl, { label: 'Handle URL', value: attributes.handleUrl, onChange: v => setAttributes({ handleUrl: v }) })),
        el(FormField, null, 
          el('p', { style: { fontWeight: 'bold', margin: '0 0 16px 0' } }, 'Grid Images (Up to 6)'),
          el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' } }, ...imageSelectors)
        )
      )
    );
    },
    save: () => null
  });

  // 7b. Catching Finisher
  registerBlockType('sg/catching-finisher', {
    title: 'Catching Finisher', icon: 'flag', category: 'theme',
    description: 'Een warme afsluiter met scripttitel "Laat ons jullie verhaal vastleggen" en een Plan-afspraak knop.',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor:       { type: 'string', default: '#000000' },
      eyebrow:         { type: 'string', default: 'Jouw shoot' },
      subtext:         { type: 'string', default: 'Plan een shoot en wij zorgen voor de rest. Van voorbereiding tot eindresultaat — helemaal op maat.' },
      buttonText:      { type: 'string', default: 'Plan je shoot' },
    },
    edit: ({ attributes, setAttributes }) => {
      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor:       attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText:       v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Catching Finisher' },
          el('p', { style: { color: '#666', marginBottom: '16px', fontStyle: 'italic' } },
            'Een afsluiter met de vaste titel "Laat ons jullie verhaal vastleggen" in scriptstijl, plus een Plan afspraak knop.'
          ),
          el(FormField, null,
            el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })
          ),
          el(FormField, null,
            el(TextareaControl, {
              label: 'Subtekst',
              value: attributes.subtext,
              onChange: v => setAttributes({ subtext: v }),
              rows: 3,
            })
          ),
          el(FormField, null,
            el(TextControl, { label: 'Knoptekst (opent boekingsmodal)', value: attributes.buttonText, onChange: v => setAttributes({ buttonText: v }) })
          )
        )
      );
    },
    save: () => null
  });

  // 8. CTA
  registerBlockType('sg/cta', {
    title: 'CTA (Call to Action)', icon: 'megaphone', category: 'theme',
    attributes: {
      backgroundColor: { type: 'string', default: '#E1C5B0' },
      textColor: { type: 'string', default: '#000000' },
      eyebrow: { type: 'string', default: 'Afspraak maken' },
      heading: { type: 'string', default: 'Laat ons <br /><span class="cta-script">jullie verhaal</span><br /> vastleggen' },
      subtext: { type: 'string', default: 'Plan een vrijblijvend kennismakingsgesprek, of boek direct een shoot. We kijken er naar uit.' },
      primaryButtonText: { type: 'string', default: 'Plan je shoot' },
      secondaryButtonText: { type: 'string', default: 'Stuur een mailtje' },
      secondaryButtonUrl: { type: 'string', default: 'mailto:hallo@studioglimlach.nl' }
    },
    edit: ({ attributes, setAttributes }) => {
      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Call to Action' },
        el(FormField, null, el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(WysiwygField, { label: 'Subtext', value: attributes.subtext, onChange: v => setAttributes({ subtext: v }) }),
        el(FormField, null, el(TextControl, { label: 'Primary Button Text (Opens Booking Modal)', value: attributes.primaryButtonText, onChange: v => setAttributes({ primaryButtonText: v }) })),
        el(FormField, null, el(TextControl, { label: 'Secondary Button Text', value: attributes.secondaryButtonText, onChange: v => setAttributes({ secondaryButtonText: v }) })),
        el(FormField, null, el(TextControl, { label: 'Secondary Button URL', value: attributes.secondaryButtonUrl, onChange: v => setAttributes({ secondaryButtonUrl: v }) }))
      )
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

  // 10. Price Overview
  registerBlockType('sg/prices', {
    title: 'Price Overview', icon: 'tag', category: 'theme',
    description: 'Display your photoshoot packages with name, subtitle, price, and included services.',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor: { type: 'string', default: '#000000' },
      heading:    { type: 'string', default: 'Onze <span class="italic">tarieven</span>' },
      eyebrow:    { type: 'string', default: 'Transparante prijzen' },
      sectionNum: { type: 'string', default: 'N°04' },
      note:       { type: 'string', default: 'Alle prijzen zijn inclusief online galerij en twee weken recht op downloaden. Reiskosten buiten een straal van 15 km worden apart besproken.' },
      packages: {
        type: 'array',
        default: [
          { name: 'Newborn shoot',  sub: '0 – 2 weken',      price: '€ 295', includes: 'Thuis of in studio · 1,5 uur · 15+ bewerkte foto\'s', url: '/newborn-shoot' },
          { name: 'Baby & sitter',  sub: '3 – 12 maanden',    price: '€ 245', includes: 'Studio · 1 uur · 12+ bewerkte foto\'s', url: '/baby-sitter' },
          { name: 'Gezinsshoot',    sub: 'Alle leeftijden',   price: '€ 275', includes: 'Buiten of thuis · 1,5 uur · 15+ bewerkte foto\'s', url: '/gezinsshoot' },
          { name: 'Mini shoot',     sub: 'Snel & intiem',     price: '€ 149', includes: 'Studio · 30 min · 6 bewerkte foto\'s', url: '/mini-shoot' },
        ]
      }
    },
    edit: ({ attributes, setAttributes }) => {
      const updatePkg = (index, key, val) => {
        const pkgs = [...attributes.packages];
        pkgs[index] = { ...pkgs[index], [key]: val };
        setAttributes({ packages: pkgs });
      };

      const pkgElements = attributes.packages.map((pkg, i) =>
        el('div', {
          key: i,
          style: { marginBottom: '12px', background: '#f8f9f9', padding: '16px', borderRadius: '4px', border: '1px solid #ddd' }
        },
          el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } },
            el('strong', { style: { fontSize: '13px' } }, `Package ${i + 1}`),
            el(Button, {
              isDestructive: true, variant: 'link',
              onClick: () => {
                const pkgs = [...attributes.packages];
                pkgs.splice(i, 1);
                setAttributes({ packages: pkgs });
              }
            }, '✕ Remove')
          ),
          el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' } },
            el(TextControl, { label: 'Name',     value: pkg.name,     onChange: v => updatePkg(i, 'name', v) }),
            el(TextControl, { label: 'Subtitle', value: pkg.sub,      onChange: v => updatePkg(i, 'sub',  v) }),
            el(TextControl, { label: 'Price (e.g. € 295)', value: pkg.price, onChange: v => updatePkg(i, 'price', v) }),
            el(TextControl, { label: 'Includes', value: pkg.includes, onChange: v => updatePkg(i, 'includes', v) }),
            el(TextControl, { label: 'Page URL (e.g. /newborn-shoot)', value: pkg.url || '', onChange: v => updatePkg(i, 'url', v) })
          )
        )
      );

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Price Overview' },
        el('p', { style: { color: '#666', marginBottom: '16px', fontStyle: 'italic' } }, 'List your photoshoot packages with a price and short description. Each card links to the booking modal.'),
        el(FormField, null,
          el(TextControl, { label: 'Section Number', value: attributes.sectionNum, onChange: v => setAttributes({ sectionNum: v }) }),
          el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) })
        ),
        el(WysiwygField, { label: 'Heading', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
        el(FormField, null,
          el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Packages'),
          ...pkgElements,
          el(Button, {
            isSecondary: true,
            style: { marginTop: '8px' },
            onClick: () => setAttributes({ packages: [...attributes.packages, { name: 'Nieuwe shoot', sub: '', price: '€ 0', includes: '' }] })
          }, '+ Add package')
        ),
        el(FormField, null,
          el(TextareaControl, { label: 'Footnote', value: attributes.note, onChange: v => setAttributes({ note: v }), help: 'Shown below the grid in italic. E.g. pricing notes, travel costs.' })
        )
      )
    );
    },
    save: () => null
  });

  // 11. Package Detail
  registerBlockType('sg/package-detail', {
    title: 'Package Detail', icon: 'media-document', category: 'theme',
    description: 'Full description page for a single shoot package.',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor:       { type: 'string', default: '#000000' },
      packageName:  { type: 'string', default: 'Newborn shoot' },
      subtitle:     { type: 'string', default: '0 \u2013 2 weken' },
      price:        { type: 'string', default: '\u20ac 295' },
      description:  { type: 'string', default: '' },
      includes:     { type: 'string', default: '' },
      imageId:      { type: 'number' },
      imageUrl:     { type: 'string' },
      ctaText:      { type: 'string', default: 'Plan deze shoot' },
      asideNote:    { type: 'string', default: 'Inclusief online galerij en twee weken recht op downloaden.' },
      asideFeatures: { type: 'array', default: [
        'Professionele bewerking',
        'Online galerij',
        'Antwoord binnen 24u'
      ]},
    },
    edit: ({ attributes, setAttributes }) => {
      const updateFeature = (index, val) => {
        const items = [...attributes.asideFeatures];
        items[index] = val;
        setAttributes({ asideFeatures: items });
      };
      const removeFeature = (index) => {
        const items = [...attributes.asideFeatures];
        items.splice(index, 1);
        setAttributes({ asideFeatures: items });
      };

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Package Detail Page' },
          el('p', { style: { color: '#666', marginBottom: '16px', fontStyle: 'italic' } }, 'This block renders the full description for one shoot package.'),

          // ── Main fields
          el(FormField, null,
            el(TextControl, { label: 'Package Name', value: attributes.packageName, onChange: v => setAttributes({ packageName: v }) }),
            el(TextControl, { label: 'Subtitle (e.g. 0\u20132 weken)', value: attributes.subtitle, onChange: v => setAttributes({ subtitle: v }) }),
            el(TextControl, { label: 'Price', value: attributes.price, onChange: v => setAttributes({ price: v }) }),
          ),
          el(WysiwygField, { label: 'Description', value: attributes.description, onChange: v => setAttributes({ description: v }), placeholder: 'Beschrijf dit pakket...' }),
          el(WysiwygField, { label: 'Wat is inbegrepen', value: attributes.includes, onChange: v => setAttributes({ includes: v }), placeholder: 'Bijv: \u2022 1,5 uur shoot' }),
          el(FormField, null,
            el(ImageSelect, { label: 'Header Image', value: { id: attributes.imageId, url: attributes.imageUrl }, onChange: m => setAttributes({ imageId: m.id, imageUrl: m.url }) })
          ),

          // ── Aside / booking card fields
          el('div', { style: { borderTop: '2px solid #1e1e1e', marginTop: '24px', paddingTop: '20px' } },
            el('p', { style: { fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' } }, '\u2014 Booking Card'),
            el(FormField, null,
              el(TextControl, { label: 'Button Text', value: attributes.ctaText, onChange: v => setAttributes({ ctaText: v }) }),
              el(TextareaControl, { label: 'Card Subtext', value: attributes.asideNote, onChange: v => setAttributes({ asideNote: v }), help: 'Short note shown below the price (e.g. what is included in the price).' })
            ),
            el(FormField, null,
              el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '8px' } }, 'Pointers (checkmarks below button)'),
              ...attributes.asideFeatures.map((feat, i) =>
                el('div', { key: i, style: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' } },
                  el(TextControl, {
                    value: feat,
                    onChange: v => updateFeature(i, v),
                    style: { flex: 1, marginBottom: 0 }
                  }),
                  el(Button, { isDestructive: true, variant: 'link', onClick: () => removeFeature(i) }, '\u2715')
                )
              ),
              el(Button, {
                isSecondary: true,
                style: { marginTop: '8px' },
                onClick: () => setAttributes({ asideFeatures: [...attributes.asideFeatures, 'Nieuw punt'] })
              }, '+ Add pointer')
            )
          )
        )
      );
    },
    save: () => null
  });

  // 12. Blog Archive (full blog overview page block)
  registerBlockType('sg/blog-archive', {
    title: 'Blog — Volledig overzicht', icon: 'admin-post', category: 'theme',
    description: 'Blog archive page: hero header, category filter pills, and a manually curated grid of posts with links.',
    attributes: {
      backgroundColor: { type: 'string', default: '#F2E9DE' },
      textColor:        { type: 'string', default: '#000000' },
      eyebrow:  { type: 'string', default: 'Ons dagboek' },
      heading:  { type: 'string', default: 'Verhalen uit <br /><span class="script" style="color: var(--terracotta);">de studio</span>' },
      subtext:  { type: 'string', default: 'Shoot-verhalen, persoonlijke stukken en kleine dingen die we onderweg meemaken.' },
      // Categories = filter pills: [{key, label}]
      // Each category group has posts: [{title, excerpt, date, tag, imageId, imageUrl, url, tone}]
      categories: {
        type: 'array',
        default: []
      },
    },
    edit: ({ attributes, setAttributes }) => {
      const cats = attributes.categories || [];

      // ── Tone options for placeholder color ─────────────────────────
      const toneOptions = [
        { label: 'Clay',    value: 'clay'   },
        { label: 'Sage',    value: 'sage'   },
        { label: 'Warm',    value: 'warm'   },
        { label: 'Cream',   value: 'cream'  },
        { label: 'Muted',   value: 'muted'  },
        { label: 'Sand',    value: 'sand'   },
        { label: 'Deep',    value: 'deep'   },
      ];

      // ── Category helpers ───────────────────────────────────────────
      const addCat = () =>
        setAttributes({ categories: [...cats, { key: 'nieuw', label: 'Nieuwe categorie', posts: [] }] });

      const removeCat = (ci) => {
        const next = [...cats]; next.splice(ci, 1);
        setAttributes({ categories: next });
      };

      const updateCat = (ci, field, val) => {
        const next = cats.map((c, i) => i === ci ? { ...c, [field]: val } : c);
        setAttributes({ categories: next });
      };

      // ── Post helpers ───────────────────────────────────────────────
      const addPost = (ci) => {
        const next = cats.map((c, i) => i !== ci ? c : {
          ...c, posts: [...(c.posts || []), {
            title: '', excerpt: '', date: '', tag: '', imageId: null, imageUrl: '', url: '', tone: 'clay'
          }]
        });
        setAttributes({ categories: next });
      };

      const removePost = (ci, pi) => {
        const next = cats.map((c, i) => {
          if (i !== ci) return c;
          const posts = [...(c.posts || [])]; posts.splice(pi, 1);
          return { ...c, posts };
        });
        setAttributes({ categories: next });
      };

      const updatePost = (ci, pi, field, val) => {
        const next = cats.map((c, i) => {
          if (i !== ci) return c;
          const posts = (c.posts || []).map((p, j) => j === pi ? { ...p, [field]: val } : p);
          return { ...c, posts };
        });
        setAttributes({ categories: next });
      };

      const updatePostImage = (ci, pi, media) => {
        updatePost(ci, pi, 'imageId', media.id);
        const next = cats.map((c, i) => {
          if (i !== ci) return c;
          const posts = (c.posts || []).map((p, j) =>
            j === pi ? { ...p, imageId: media.id, imageUrl: media.url } : p
          );
          return { ...c, posts };
        });
        setAttributes({ categories: next });
      };

      // ── UI ─────────────────────────────────────────────────────────
      const catStyle = { border: '1px solid #ddd', borderRadius: '6px', marginBottom: '16px', overflow: 'hidden' };
      const catHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f0f0f0', borderBottom: '1px solid #ddd' };
      const postCardStyle  = { border: '1px solid #e8e8e8', borderRadius: '4px', padding: '12px', marginBottom: '10px', background: '#fafafa' };

      const catEls = cats.map((cat, ci) => {
        const postEls = (cat.posts || []).map((post, pi) =>
          el('div', { key: pi, style: postCardStyle },
            el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
              el('strong', { style: { fontSize: '12px', color: '#555' } }, `Bericht ${pi + 1}`),
              el(Button, { isDestructive: true, variant: 'link', style: { fontSize: '11px' }, onClick: () => removePost(ci, pi) }, '✕ Verwijder')
            ),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
              el(TextControl, { label: 'Titel',   value: post.title,   onChange: v => updatePost(ci, pi, 'title',   v) }),
              el(TextControl, { label: 'Tag (weergegeven in meta)', value: post.tag, onChange: v => updatePost(ci, pi, 'tag', v) }),
              el(TextControl, { label: 'Datum',   value: post.date,    onChange: v => updatePost(ci, pi, 'date',    v) }),
              el(TextControl, { label: 'URL (link naar het bericht)', value: post.url, onChange: v => updatePost(ci, pi, 'url', v) }),
            ),
            el(TextareaControl, { label: 'Samenvatting', value: post.excerpt, rows: 2, onChange: v => updatePost(ci, pi, 'excerpt', v) }),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' } },
              el(ImageSelect, {
                label: 'Afbeelding',
                value: { id: post.imageId, url: post.imageUrl },
                onChange: m => updatePostImage(ci, pi, m),
              }),
              el(SelectControl, {
                label: 'Plaatshouder kleur (als geen foto)',
                value: post.tone || 'clay',
                options: toneOptions,
                onChange: v => updatePost(ci, pi, 'tone', v),
              })
            )
          )
        );

        return el('div', { key: ci, style: catStyle },
          el('div', { style: catHeaderStyle },
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 } },
              el(TextControl, { label: 'Categorienaam (weergegeven op knop)', value: cat.label, onChange: v => updateCat(ci, 'label', v) }),
              el(TextControl, { label: 'Categorieslug (intern, bijv. "shoots")', value: cat.key, onChange: v => updateCat(ci, 'key', v) }),
            ),
            el(Button, { isDestructive: true, variant: 'secondary', style: { flexShrink: 0, marginTop: '24px' }, onClick: () => removeCat(ci) }, '✕ Verwijder')
          ),
          el('div', { style: { padding: '12px 14px' } },
            postEls.length === 0
              ? el('p', { style: { color: '#999', fontSize: '12px', margin: '0 0 10px' } }, 'Geen berichten. Klik op "+ Bericht toevoegen".')
              : postEls,
            el(Button, { isSecondary: true, onClick: () => addPost(ci) }, '+ Bericht toevoegen')
          )
        );
      });

      const totalPosts = cats.reduce((n, c) => n + (c.posts || []).length, 0);

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText:       v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Blog — Volledig overzicht' },
          el('p', { style: { color: '#666', marginBottom: '16px', fontStyle: 'italic' } },
            "Voeg categorieën toe en vul per categorie de berichten in. Bezoekers zien alle berichten en kunnen filteren per categorie."
          ),

          // ── Hero meta ──────────────────────────────────────────
          el(FormField, null,
            el(TextControl, { label: 'Eyebrow', value: attributes.eyebrow, onChange: v => setAttributes({ eyebrow: v }) }),
          ),
          el(WysiwygField, { label: 'Koptekst (HTML toegestaan — gebruik <span class="script"> voor handschrift)', value: attributes.heading, onChange: v => setAttributes({ heading: v }) }),
          el(WysiwygField, { label: 'Subtekst', value: attributes.subtext, onChange: v => setAttributes({ subtext: v }) }),

          // ── Categories & posts ─────────────────────────────────
          el('div', { style: { marginTop: '8px' } },
            el('div', {
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }
            },
              el('div', null,
                el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#333', margin: 0 } }, "Categorieën & berichten"),
                el('p', { style: { fontSize: '11px', color: '#999', margin: '4px 0 0' } },
                  cats.length === 0
                    ? "Nog geen categorieën. Voeg er een toe."
                    : `${cats.length} ${cats.length === 1 ? 'categorie' : 'categorieën'} · ${totalPosts} berichten`
                )
              ),
              el(Button, { isPrimary: true, onClick: addCat }, '+ Categorie toevoegen')
            ),
            ...catEls
          )
        )
      );
    },
    save: () => null
  });

  // 13. Footer
  registerBlockType('sg/footer', {
    title: 'Site Footer', icon: 'flag', category: 'theme',
    description: 'The site-wide footer with studio info, navigation, contact details, location, and social media links.',
    attributes: {
      backgroundColor: { type: 'string', default: '#1a1612' },
      textColor:       { type: 'string', default: '#e8e0d5' },
      studioName:  { type: 'string', default: 'Studio' },
      scriptName:  { type: 'string', default: 'Glimlach' },
      tagline:     { type: 'string', default: "Fotografie voor jonge gezinnen, pasgeboren baby's en koppels. Almere en omgeving." },
      email:       { type: 'string', default: 'hallo@studioglimlach.nl' },
      phone:       { type: 'string', default: '+31 6 12 34 56 78' },
      street:      { type: 'string', default: '' },
      zip:         { type: 'string', default: '' },
      city:        { type: 'string', default: 'Almere' },
      country:     { type: 'string', default: 'NL' },
      kvk:         { type: 'string', default: 'KvK 89234123' },
      copyTagline: { type: 'string', default: 'Gemaakt met liefde in Almere' },
      navItems: {
        type: 'array',
        default: [
          { label: 'Home',      url: '/',                                  newTab: false },
          { label: 'Over ons',  url: '#over',                              newTab: false },
          { label: 'Portfolio', url: '#portfolio',                         newTab: false },
          { label: 'Blog',      url: '/blog',                              newTab: false },
          { label: 'Contact',   url: 'mailto:hallo@studioglimlach.nl',    newTab: false },
        ]
      },
      socials: {
        type: 'array',
        default: [
          { platform: 'instagram', label: 'Instagram', handle: '@studio.glimlach', url: 'https://www.instagram.com/studio.glimlach' },
          { platform: 'tiktok',    label: 'TikTok',    handle: '@studioglimlach',   url: 'https://www.tiktok.com/@studioglimlach' },
        ]
      }
    },
    edit: ({ attributes, setAttributes }) => {
      const { ToggleControl, SelectControl } = wp.components;

      /* ── Helpers ── */
      const updateNav = (i, key, val) => {
        const items = [...attributes.navItems];
        items[i] = { ...items[i], [key]: val };
        setAttributes({ navItems: items });
      };
      const removeNav = (i) => {
        const items = [...attributes.navItems];
        items.splice(i, 1);
        setAttributes({ navItems: items });
      };
      const moveNav = (i, dir) => {
        const items = [...attributes.navItems];
        const t = i + dir;
        if (t < 0 || t >= items.length) return;
        [items[i], items[t]] = [items[t], items[i]];
        setAttributes({ navItems: items });
      };

      const updateSocial = (i, key, val) => {
        const items = [...attributes.socials];
        items[i] = { ...items[i], [key]: val };
        setAttributes({ socials: items });
      };
      const removeSocial = (i) => {
        const items = [...attributes.socials];
        items.splice(i, 1);
        setAttributes({ socials: items });
      };

      const btnStyle = (disabled) => ({
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '26px', height: '26px', border: '1px solid #ddd', borderRadius: '3px',
        background: disabled ? '#f8f9f9' : '#fff', color: disabled ? '#ccc' : '#555',
        cursor: disabled ? 'default' : 'pointer', fontSize: '12px', lineHeight: 1, flexShrink: 0,
      });

      const platformOptions = [
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok',    value: 'tiktok' },
        { label: 'Facebook',  value: 'facebook' },
        { label: 'Pinterest', value: 'pinterest' },
      ];

      /* ── Nav items ── */
      const navEls = attributes.navItems.map((item, i) =>
        el('div', {
          key: i,
          style: {
            display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto auto auto',
            gap: '8px', alignItems: 'center', padding: '10px 12px',
            background: '#f8f9f9', borderRadius: '4px', marginBottom: '6px', border: '1px solid #e0e0e0',
          }
        },
          el('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '20px' } },
            el('button', { type: 'button', style: btnStyle(i === 0), disabled: i === 0, onClick: () => moveNav(i, -1) }, '↑'),
            el('button', { type: 'button', style: btnStyle(i === attributes.navItems.length - 1), disabled: i === attributes.navItems.length - 1, onClick: () => moveNav(i, 1) }, '↓')
          ),
          el(TextControl, { label: 'Label', value: item.label, onChange: v => updateNav(i, 'label', v) }),
          el(TextControl, { label: 'URL',   value: item.url,   onChange: v => updateNav(i, 'url',   v) }),
          el('div', { style: { paddingTop: '24px' } },
            el(ToggleControl, { label: 'New tab', checked: !!item.newTab, onChange: v => updateNav(i, 'newTab', v) })
          ),
          el('div', { style: { paddingTop: '20px' } },
            el(Button, { isDestructive: true, variant: 'link', onClick: () => removeNav(i) }, '✕')
          )
        )
      );

      /* ── Social items ── */
      const socialEls = attributes.socials.map((s, i) =>
        el('div', {
          key: i,
          style: { marginBottom: '10px', background: '#f8f9f9', padding: '14px', borderRadius: '4px', border: '1px solid #ddd' }
        },
          el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
            el('strong', { style: { fontSize: '13px' } }, `Social ${i + 1}`),
            el(Button, { isDestructive: true, variant: 'link', onClick: () => removeSocial(i) }, '✕ Remove')
          ),
          el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
            el(SelectControl, {
              label: 'Platform',
              value: s.platform || 'instagram',
              options: platformOptions,
              onChange: v => updateSocial(i, 'platform', v)
            }),
            el(TextControl, { label: 'Display Label', value: s.label,  onChange: v => updateSocial(i, 'label',  v) }),
            el(TextControl, { label: 'Handle (e.g. @studio.glimlach)', value: s.handle, onChange: v => updateSocial(i, 'handle', v) }),
            el(TextControl, { label: 'URL',   value: s.url,    onChange: v => updateSocial(i, 'url',    v) })
          )
        )
      );

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor: attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText: v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Site Footer' },

          el('p', { style: { color: '#666', marginBottom: '20px', fontStyle: 'italic' } },
            'This block controls the site footer. All sections are fully editable here.'
          ),

          // ── Studio identity
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Studio Identity'),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
              el(TextControl, { label: 'Studio Name',   value: attributes.studioName,  onChange: v => setAttributes({ studioName:  v }) }),
              el(TextControl, { label: 'Script Name',   value: attributes.scriptName,  onChange: v => setAttributes({ scriptName:  v }) }),
            ),
            el(TextareaControl, { label: 'Tagline', value: attributes.tagline, onChange: v => setAttributes({ tagline: v }) })
          ),

          // ── Contact
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Contact'),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
              el(TextControl, { label: 'Email', value: attributes.email, onChange: v => setAttributes({ email: v }) }),
              el(TextControl, { label: 'Phone', value: attributes.phone, onChange: v => setAttributes({ phone: v }) }),
            )
          ),

          // ── Location
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Location'),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' } },
              el(TextControl, { label: 'Street',  value: attributes.street,  onChange: v => setAttributes({ street:  v }) }),
              el(TextControl, { label: 'Zip',     value: attributes.zip,     onChange: v => setAttributes({ zip:     v }) }),
              el(TextControl, { label: 'City',    value: attributes.city,    onChange: v => setAttributes({ city:    v }) }),
              el(TextControl, { label: 'Country', value: attributes.country, onChange: v => setAttributes({ country: v }) }),
            )
          ),

          // ── Navigation
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '4px' } }, 'Navigation Links'),
            el('p', { style: { fontSize: '11px', color: '#999', marginBottom: '12px' } }, 'Use ↑ ↓ to reorder links.'),
            ...navEls,
            el(Button, {
              isSecondary: true, style: { marginTop: '8px' },
              onClick: () => setAttributes({ navItems: [...attributes.navItems, { label: 'Nieuwe pagina', url: '#', newTab: false }] })
            }, '+ Add link')
          ),

          // ── Socials
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Social Media'),
            ...socialEls,
            el(Button, {
              isSecondary: true, style: { marginTop: '8px' },
              onClick: () => setAttributes({ socials: [...attributes.socials, { platform: 'instagram', label: 'Instagram', handle: '@handle', url: 'https://instagram.com/' }] })
            }, '+ Add social')
          ),

          // ── Copy bar
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Copyright Bar'),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
              el(TextControl, { label: 'KvK / Legal', value: attributes.kvk,         onChange: v => setAttributes({ kvk:         v }) }),
              el(TextControl, { label: 'Tagline',      value: attributes.copyTagline, onChange: v => setAttributes({ copyTagline: v }) }),
            )
          )
        )
      );
    },
    save: () => null
  });


  // ── Blog Post (Single article page) ──────────────────────────────────────
  registerBlockType('sg/blog-post', {
    title: 'Blog Post — Artikel', icon: 'media-document', category: 'theme',
    description: 'Volledig configureerbaar blog artikel: hero, feature image, gemixte broodtekst/quotes, gallerij en "Verder lezen".',
    attributes: {
      backgroundColor:   { type: 'string', default: '#F2E9DE' },
      textColor:         { type: 'string', default: '#000000' },
      backUrl:           { type: 'string', default: '/blog' },
      backLabel:         { type: 'string', default: '← Terug naar blog' },
      category:          { type: 'string', default: 'Verhalen' },
      date:              { type: 'string', default: '' },
      title:             { type: 'string', default: 'De titel van dit verhaal' },
      excerpt:           { type: 'string', default: 'Een korte inleiding die de lezer uitnodigt verder te lezen.' },
      featureImageId:    { type: 'number' },
      featureImageUrl:   { type: 'string' },
      // Mixed content: each item = { type: 'paragraph'|'quote'|'image', text?, imageId?, imageUrl?, caption? }
      contentBlocks: {
        type: 'array',
        default: [
          { type: 'paragraph', text: "Schrijf hier de eerste alinea van je verhaal." },
          { type: 'quote',     text: "Een mooie zin die blijft hangen." },
          { type: 'paragraph', text: "Vervolg van het verhaal na de quote." },
        ]
      },
      // Gallery (up to 4 photos)
      galleryImages: { type: 'array', default: [] },
      // "Verder lezen": slug of the sg_blog_folder taxonomy term
      relatedFolderSlug: { type: 'string', default: '' },
    },
    edit: ({ attributes, setAttributes }) => {

      // ── Content block helpers ────────────────────────────────────────────
      const blocks = attributes.contentBlocks || [];

      const addBlock = (type) => {
        const defaults = type === 'image'
          ? { type, imageId: null, imageUrl: '', caption: '' }
          : { type, text: '' };
        setAttributes({ contentBlocks: [...blocks, defaults] });
      };

      const updateBlockImage = (i, media) => {
        const b = [...blocks];
        b[i] = { ...b[i], imageId: media.id, imageUrl: media.url };
        setAttributes({ contentBlocks: b });
      };
      const updateBlockCaption = (i, val) => {
        const b = [...blocks];
        b[i] = { ...b[i], caption: val };
        setAttributes({ contentBlocks: b });
      };

      const updateBlock = (i, val) => {
        const b = [...blocks];
        b[i] = { ...b[i], text: val };
        setAttributes({ contentBlocks: b });
      };

      const removeBlock = (i) => {
        const b = [...blocks];
        b.splice(i, 1);
        setAttributes({ contentBlocks: b });
      };

      const moveBlock = (i, dir) => {
        const b = [...blocks];
        const t = i + dir;
        if (t < 0 || t >= b.length) return;
        [b[i], b[t]] = [b[t], b[i]];
        setAttributes({ contentBlocks: b });
      };

      // ── Gallery helpers ──────────────────────────────────────────────────
      const updateGalleryImg = (i, media) => {
        const g = [...attributes.galleryImages];
        g[i] = { id: media.id, url: media.url };
        setAttributes({ galleryImages: g });
      };
      const addGallerySlot = () => {
        if (attributes.galleryImages.length >= 4) return;
        setAttributes({ galleryImages: [...attributes.galleryImages, { id: null, url: '' }] });
      };
      const removeGalleryImg = (i) => {
        const g = [...attributes.galleryImages];
        g.splice(i, 1);
        setAttributes({ galleryImages: g });
      };

      // ── Render content block rows ────────────────────────────────────────
      const blockTypeMeta = {
        paragraph: { color: '#e8f4ff', label: '¶ Alinea',     badge: '#0073aa', badgeBg: '#d0eafb' },
        quote:     { color: '#fff8e8', label: '❝ Quote',      badge: '#b87d00', badgeBg: '#fff3cd' },
        image:     { color: '#f0f8ee', label: '🖼 Afbeelding', badge: '#2d7a44', badgeBg: '#d4edda' },
      };

      const blockEls = blocks.map((block, i) => {
        const meta = blockTypeMeta[block.type] || blockTypeMeta.paragraph;
        const headerRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } },
          el('span', {
            style: {
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: meta.badge,
              background: meta.badgeBg, padding: '2px 8px', borderRadius: '999px',
            }
          }, meta.label),
          el('button', {
            type: 'button', title: 'Omhoog', disabled: i === 0, onClick: () => moveBlock(i, -1),
            style: { border: '1px solid #ddd', borderRadius: '3px', background: '#fff', padding: '2px 6px', fontSize: '11px', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? '#ccc' : '#555' }
          }, '↑'),
          el('button', {
            type: 'button', title: 'Omlaag', disabled: i === blocks.length - 1, onClick: () => moveBlock(i, 1),
            style: { border: '1px solid #ddd', borderRadius: '3px', background: '#fff', padding: '2px 6px', fontSize: '11px', cursor: i === blocks.length - 1 ? 'default' : 'pointer', color: i === blocks.length - 1 ? '#ccc' : '#555' }
          }, '↓'),
          el('button', {
            type: 'button', title: 'Verwijder', onClick: () => removeBlock(i),
            style: { marginLeft: 'auto', border: 'none', background: 'none', color: '#c00', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }
          }, '✕')
        );

        let inputEl;
        if (block.type === 'image') {
          inputEl = el('div', null,
            el(ImageSelect, {
              label: 'Kies afbeelding',
              value: { id: block.imageId, url: block.imageUrl },
              onChange: m => updateBlockImage(i, m),
            }),
            el(TextControl, {
              label: 'Bijschrift (optioneel)',
              value: block.caption || '',
              onChange: v => updateBlockCaption(i, v),
              placeholder: 'Een korte beschrijving of context...'
            })
          );
        } else {
          inputEl = el(TextareaControl, {
            value: block.text || '',
            onChange: v => updateBlock(i, v),
            rows: block.type === 'quote' ? 2 : 3,
            placeholder: block.type === 'quote' ? 'Typ een mooie zin die opvalt...' : 'Typ hier de alineatekst...',
            style: { margin: 0 }
          });
        }

        return el('div', {
          key: i,
          style: { background: meta.color, border: '1px solid #dde', borderRadius: '4px', padding: '10px 12px', marginBottom: '8px' }
        }, headerRow, inputEl);
      });

      const gallerySlots = attributes.galleryImages.map((img, i) =>
        el('div', { key: i, style: { position: 'relative' } },
          el(ImageSelect, { label: `Foto ${i + 1}`, value: img, onChange: m => updateGalleryImg(i, m) }),
          el(Button, {
            isDestructive: true, variant: 'link',
            style: { fontSize: '11px', marginTop: '-4px', paddingLeft: 0 },
            onClick: () => removeGalleryImg(i)
          }, '✕ Verwijder')
        )
      );

      return el('div', null,
        el(ColorPanel, {
          backgroundColor: attributes.backgroundColor,
          textColor:       attributes.textColor,
          onChangeBackground: v => setAttributes({ backgroundColor: v }),
          onChangeText:       v => setAttributes({ textColor: v }),
        }),
        el(BlockEditorForm, { title: 'Blog Post — Artikel' },

          // ── Meta
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '12px' } }, 'Navigatie & meta'),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
              el(TextControl, { label: 'Terug-URL', value: attributes.backUrl, onChange: v => setAttributes({ backUrl: v }) }),
              el(TextControl, { label: 'Terug-label', value: attributes.backLabel, onChange: v => setAttributes({ backLabel: v }) }),
              el(TextControl, { label: 'Categorie', value: attributes.category, onChange: v => setAttributes({ category: v }) }),
              el(TextControl, { label: 'Datum', value: attributes.date, onChange: v => setAttributes({ date: v }) }),
            )
          ),

          // ── Hero text
          el(WysiwygField, { label: 'Titel', value: attributes.title, onChange: v => setAttributes({ title: v }) }),
          el(WysiwygField, { label: 'Inleiding / Excerpt', value: attributes.excerpt, onChange: v => setAttributes({ excerpt: v }) }),

          // ── Feature image
          el(FormField, null,
            el(ImageSelect, {
              label: 'Feature afbeelding (hero)',
              value: { id: attributes.featureImageId, url: attributes.featureImageUrl },
              onChange: m => setAttributes({ featureImageId: m.id, featureImageUrl: m.url }),
            })
          ),

          // ── Mixed content blocks
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '4px' } }, 'Artikel inhoud'),
            el('p', { style: { fontSize: '11px', color: '#999', marginBottom: '12px' } }, 'Mix alinea\'s, quotes en afbeeldingen in elke gewenste volgorde.'),
            ...blockEls,
            el('div', { style: { display: 'flex', gap: '6px', marginTop: '12px' } },
              el(Button, { isSecondary: true, onClick: () => addBlock('paragraph'), style: { flex: 1 } }, '+ Alinea'),
              el(Button, { isSecondary: true, onClick: () => addBlock('quote'),     style: { flex: 1, borderColor: '#b87d00', color: '#b87d00' } }, '❝ Quote'),
              el(Button, { isSecondary: true, onClick: () => addBlock('image'),     style: { flex: 1, borderColor: '#2d7a44', color: '#2d7a44' } }, '🖼 Foto')
            )
          ),

          // ── Gallery
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '4px' } }, "Foto gallerij (max. 4)"),
            el('p', { style: { fontSize: '11px', color: '#999', marginBottom: '12px' } }, 'Verschijnt na de inhoud. Eerste foto breed (16:9), rest portret (4:5).'),
            attributes.galleryImages.length > 0
              ? el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' } }, ...gallerySlots)
              : el('p', { style: { color: '#999', fontSize: '12px', margin: '0 0 12px' } }, "Nog geen foto's."),
            attributes.galleryImages.length < 4 &&
              el(Button, { isSecondary: true, onClick: addGallerySlot }, '+ Foto toevoegen')
          ),

          // ── Verder lezen
          el(FormField, null,
            el('p', { style: { fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '4px' } }, 'Verder lezen'),
            el('p', { style: { fontSize: '11px', color: '#999', marginBottom: '12px', lineHeight: '1.5' } },
              '📁 Maak in WordPress Pages > Tags een "Blog Map" aan (bijv. slug: blogposts). Tag elke blogpagina ermee. Vul hieronder die slug in.'
            ),
            el(TextControl, {
              label: 'Blog Map slug',
              value: attributes.relatedFolderSlug,
              onChange: v => setAttributes({ relatedFolderSlug: v }),
              help: 'Bijv. "blogposts". Pagina\'s met deze tag verschijnen als "Verder lezen" suggesties.',
              placeholder: 'blogposts'
            })
          )
        )
      );
    },
    save: () => null
  });

});

