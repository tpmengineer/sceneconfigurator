import localFont from 'next/font/local';

const benton = localFont({
  src: [
    { path: './fonts/BentonSans Thin.otf', weight: '100', style: 'normal' },
    { path: './fonts/BentonSans ExtraLight.otf', weight: '200', style: 'normal' },
    { path: './fonts/BentonSans Light.otf', weight: '300', style: 'normal' },
    { path: './fonts/BentonSans Regular.otf', weight: '400', style: 'normal' },
    { path: './fonts/BentonSans Medium.otf', weight: '500', style: 'normal' },
    { path: './fonts/BentonSans Bold.otf', weight: '600', style: 'normal' },
    { path: './fonts/BentonSans Black.otf', weight: '700', style: 'normal' },
    { path: './fonts/BentonSans Book.otf', weight: '800', style: 'normal' },
  ],
});

const party = localFont({
  src: './fonts/Party.otf', // Another custom font
  weight: '600',
  style: 'normal',
});

const streetfunk = localFont({
  src: './fonts/Streetfunk.otf', // Another custom font
  weight: '600',
  style: 'normal',
});

const brother = localFont({
  src: './fonts/brother.otf', // Another custom font
  weight: '600',
  style: 'normal',
});

// const customFont2 = localFont({
//   src: './fonts/CustomFont2.otf', // Another custom font
//   weight: '400',
//   style: 'normal',
// });

export { benton, party, streetfunk, brother };//, customFont1, customFont2 };
