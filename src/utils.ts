export const TWITTER_SEO = {
  cardType: 'summary_large_image',
  handle: '@CascadiaSystems',
};

export const OPENGRAPH = {
  url: 'https://cascadia.foundation/',
  title: 'Cascadia Foundation',
  description: 'Cascadia is a platform built to understand and incentivize positive consumer behavior.',
  images: [
    {
      url: 'https://cascadia.foundation/logo.png',
      width: 800,
      height: 800,
      alt: 'Og Image Alt',
      type: 'image/jpeg',
    },
    {
      url: 'https://cascadia.foundation/logo.png',
      width: 960,
      height: 540,
      alt: 'Og Image Alt Second',
      type: 'image/jpeg',
    }
  ],
  siteName: 'Cascadia Foundation',
}

export const ADDITIONAL_LINK_TAGS_SEO = [
  {
    rel: 'apple-touch-icon',
    href: '/apple-touch-icon.png',
    sizes: '180x180',
  },
  {
    rel: 'icon',
    type: 'image/png',
    href: '/favicon-32x32.png',
    sizes: '32x32',
  },
  {
    rel: 'icon',
    type: 'image/png',
    href: '/favicon-16x16.png',
    sizes: '16x16',
  },
  {
    rel: 'manifest',
    href: '/site.webmanifest',
  },
  {
    rel: 'mask-icon',
    href: '/safari-pinned-tab.svg',
    color: '#5bbad5',
  },
  {
    rel: 'shortcut icon',
    href: '/favicon.ico',
  },
];

export const ADDITIONAL_META_TAGS = [
  {
    property: 'viewport',
    content: 'minimum-scale=1, initial-scale=1, width=device-width',
  },
  {
    property: 'msapplication-TileColor',
    content: '#da532c',
  },
  {
    name: 'msapplication-config',
    content: '/browserconfig.xml',
  },
  {
    name: 'theme-color',
    content: '#ffffff',
  },
];
