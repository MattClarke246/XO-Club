// Product Drops Configuration
// Edit this file to add new products (drops)
// Run `npm run sync-shopify` to sync products to Shopify

import type { ProductDrop } from '../types';

export const PRODUCT_DROPS: ProductDrop[] = [
  {
    id: '1',
    name: 'RETRO JORDAN 1 HIGH',
    price: 25,
    description: 'High-top silhouette with leather upper and classic color blocking. Lace-up closure, padded collar, rubber cupsole. Built for daily wear; details match the retro basketball shape.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800',
    ],
    variants: [
      { size: '8' },
      { size: '9' },
      { size: '10' },
      { size: '11' },
      { size: '12' },
    ],
    category: 'FOOTWEAR',
    isNew: true,
    isLimited: false,
    tags: ['Sneakers', 'Basketball', 'Retro'],
  },
  {
    id: '2',
    name: 'SUPREME BOX LOGO HOODIE',
    price: 25,
    description: 'Heavyweight fleece hoodie with a centered logo hit. Cotton-blend body, brushed interior, ribbed cuffs and hem, kangaroo pocket, and drawstring hood. Layer-friendly for cold weather.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    ],
    variants: [
      { size: 'M' },
      { size: 'L' },
      { size: 'XL' },
      { size: 'XXL' },
    ],
    category: 'FLEECE',
    isNew: false,
    isLimited: true,
    tags: ['Hoodie', 'Streetwear', 'Limited Edition'],
  },
  {
    id: '3',
    name: 'TRAVIS SCOTT CACTUS JACK BEANIE',
    price: 25,
    description: 'Knit beanie with front embroidery. Acrylic blend with stretch; folded cuff. One size cut to fit most adults. Cold-weather layer for street fits.',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800',
    ],
    variants: [
      { size: 'ONE SIZE' },
    ],
    category: 'ACCESSORIES',
    isNew: true,
    isLimited: false,
    tags: ['Beanie', 'Accessories', 'Collaboration'],
  },
  {
    id: '4',
    name: 'NORTH FACE RECON BACKPACK',
    price: 25,
    description: 'Roughly 30L pack volume. Recycled polyester shell with a water-resistant finish. Padded laptop sleeve, organizer pockets, adjustable straps, front bungee, top handle. For commute, campus, and travel.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
    ],
    variants: [
      { size: 'ONE SIZE' },
    ],
    category: 'ACCESSORIES',
    isNew: false,
    isLimited: true,
    tags: ['Backpack', 'Urban', 'Utility'],
  },
];

// Example: How to add a new product drop
// 
// {
//   id: '5',
//   name: 'NEW PRODUCT NAME',
//   price: 50,
//   description: 'Product description here...',
//   images: [
//     'https://image-url-1.com',
//     'https://image-url-2.com',
//   ],
//   variants: [
//     { size: 'S' },
//     { size: 'M' },
//     { size: 'L' },
//   ],
//   category: 'CATEGORY_NAME',
//   isNew: true,
//   isLimited: false,
//   tags: ['Tag1', 'Tag2'],
// },
